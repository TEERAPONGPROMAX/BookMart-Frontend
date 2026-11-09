import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/backend';
import { useAuth } from '../auth/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminStats from '../components/admin/AdminStats';
import AdminBooks from '../components/admin/AdminBooks';
import AdminOrders from '../components/admin/AdminOrders';
import AdminMembers from '../components/admin/AdminMembers';

const blankBook = { title: '', author: '', category: '', price: '', stock: '', cover_url: '', description: '', featured: false };
const statusLabels = { pending: 'รอดำเนินการ', paid: 'ชำระแล้ว', shipped: 'จัดส่งแล้ว', cancelled: 'ยกเลิก' };

export default function Admin() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [bookQuery, setBookQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [memberRoleFilter, setMemberRoleFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [changingOrderId, setChangingOrderId] = useState(null);
  const [changingMemberId, setChangingMemberId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([api.books(), api.adminOrders(), api.adminMembers()])
      .then(([bookRows, orderRows, memberRows]) => { if (active) { setBooks(bookRows); setOrders(orderRows); setMembers(memberRows); } })
      .catch((problem) => { if (active) setError(problem.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retryCount]);

  const memberById = useMemo(() => new Map(members.map((member) => [String(member.id), member])), [members]);
  const memberOrderStats = useMemo(() => {
    const stats = new Map();
    orders.forEach((order) => {
      const key = String(order.user_id);
      const current = stats.get(key) || { count: 0, total: 0 };
      current.count += 1;
      current.total += Number(order.total || 0);
      stats.set(key, current);
    });
    return stats;
  }, [orders]);
  const visibleBooks = useMemo(() => books.filter((book) =>
    `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(bookQuery.trim().toLowerCase())), [books, bookQuery]);
  const visibleOrders = useMemo(() => orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const member = memberById.get(String(order.user_id));
    const searchText = `${order.id} ${order.user_id} ${member?.name || ''} ${member?.email || ''} ${(order.items || []).map((item) => item.title).join(' ')}`.toLowerCase();
    return matchesStatus && searchText.includes(orderQuery.trim().toLowerCase());
  }), [orders, orderQuery, statusFilter, memberById]);
  const visibleMembers = useMemo(() => members.filter((member) => {
    const matchesRole = memberRoleFilter === 'all' || member.role === memberRoleFilter;
    const matchesQuery = `${member.id} ${member.name} ${member.email}`.toLowerCase().includes(memberQuery.trim().toLowerCase());
    return matchesRole && matchesQuery;
  }).sort((a, b) => Number(b.id) - Number(a.id)), [members, memberQuery, memberRoleFilter]);

  function showMemberOrders(member) {
    setOrderQuery(String(member.id));
    setStatusFilter('all');
    document.getElementById('admin-orders-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function refreshBooks() { setBooks(await api.books()); }

  async function saveBook(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const book = {
      title: form.get('title').trim(), author: form.get('author').trim(), category: form.get('category').trim(),
      price: Number(form.get('price')), stock: Number(form.get('stock')), cover_url: form.get('cover_url').trim(),
      description: form.get('description').trim(), featured: form.get('featured') === 'on',
    };
    try {
      if (edit?.id) await api.updateBook(edit.id, book);
      else await api.saveBook(book);
      await refreshBooks();
      setEdit(null);
      setNotice(edit?.id ? 'บันทึกการแก้ไขหนังสือแล้ว' : 'เพิ่มหนังสือเข้าร้านแล้ว');
    } catch (problem) { setError(problem.message); }
    finally { setSaving(false); }
  }

  async function deleteBook(book) {
    if (!window.confirm(`ยืนยันลบ “${book.title}” หรือไม่? หนังสือที่อยู่ในคำสั่งซื้อจะลบไม่ได้`)) return;
    setError('');
    setNotice('');
    try { await api.deleteBook(book.id); await refreshBooks(); setNotice(`ลบ “${book.title}” แล้ว`); }
    catch (problem) { setError(problem.message); }
  }

  async function changeStatus(order, status) {
    setError('');
    setChangingOrderId(order.id);
    try {
      const updated = await api.updateOrder(order.id, status);
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, ...updated } : item));
      setNotice(`อัปเดตคำสั่งซื้อ #${order.id} เป็น “${statusLabels[status]}” แล้ว`);
    } catch (problem) { setError(problem.message); }
    finally { setChangingOrderId(null); }
  }

  async function changeMemberRole(member, role) {
    if (member.role === role) return;
    if (Number(member.id) === Number(user?.id) && role !== 'admin') {
      setError('ไม่สามารถลดสิทธิ์บัญชีที่กำลังใช้งานอยู่ได้');
      return;
    }
    const roleName = role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิก';
    if (!window.confirm(`ยืนยันเปลี่ยนสิทธิ์ ${member.name} เป็น “${roleName}” หรือไม่?`)) return;
    setError('');
    setNotice('');
    setChangingMemberId(member.id);
    try {
      const updated = await api.updateMemberRole(member.id, role);
      setMembers((current) => current.map((item) => item.id === member.id ? { ...item, ...updated } : item));
      setNotice(role === 'admin' ? `เปลี่ยนสิทธิ์ ${member.name} แล้ว ให้สมาชิกออกจากระบบและเข้าใหม่` : `ลดสิทธิ์ ${member.name} เป็นสมาชิกแล้ว`);
    } catch (problem) { setError(problem.message); }
    finally { setChangingMemberId(null); }
  }

  return <AdminDashboard loading={loading} error={error} notice={notice} onRefresh={() => setRetryCount((count) => count + 1)}>
      <AdminStats books={books} members={members} orders={orders} loading={loading}/>

      <AdminBooks books={books} visibleBooks={visibleBooks} loading={loading} query={bookQuery} setQuery={setBookQuery} edit={edit} setEdit={setEdit} blankBook={blankBook} saving={saving} onSave={saveBook} onDelete={deleteBook}/>

      <AdminOrders orders={orders} visibleOrders={visibleOrders} membersById={memberById} loading={loading} query={orderQuery} setQuery={setOrderQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} changingOrderId={changingOrderId} onChangeStatus={changeStatus}/>

      <AdminMembers loading={loading} members={members} visibleMembers={visibleMembers} memberOrderStats={memberOrderStats} memberQuery={memberQuery} setMemberQuery={setMemberQuery} memberRoleFilter={memberRoleFilter} setMemberRoleFilter={setMemberRoleFilter} changingMemberId={changingMemberId} currentUserId={user?.id} onChangeRole={changeMemberRole} onViewOrders={showMemberOrders}/>
    </AdminDashboard>;
}
