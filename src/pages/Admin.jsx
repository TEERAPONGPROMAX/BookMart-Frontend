import { AlertTriangle, BookOpen, Boxes, ClipboardList, Plus, RefreshCw, Search, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/backend';

const blankBook = { title: '', author: '', category: '', price: '', stock: '', cover_url: '', description: '', featured: false };
const statusLabels = { pending: 'รอดำเนินการ', paid: 'ชำระแล้ว', shipped: 'จัดส่งแล้ว', cancelled: 'ยกเลิก' };
const formatPrice = (value) => `฿${Number(value || 0).toLocaleString('th-TH', { maximumFractionDigits: 2 })}`;
const formatDate = (value) => new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function Admin() {
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [changingOrderId, setChangingOrderId] = useState(null);

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

  const lowStockBooks = books.filter((book) => Number(book.stock) <= 5);
  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const memberById = useMemo(() => new Map(members.map((member) => [String(member.id), member])), [members]);
  const visibleBooks = useMemo(() => books.filter((book) =>
    `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(bookQuery.trim().toLowerCase())), [books, bookQuery]);
  const visibleOrders = useMemo(() => orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const member = memberById.get(String(order.user_id));
    const searchText = `${order.id} ${order.user_id} ${member?.name || ''} ${member?.email || ''} ${(order.items || []).map((item) => item.title).join(' ')}`.toLowerCase();
    return matchesStatus && searchText.includes(orderQuery.trim().toLowerCase());
  }), [orders, orderQuery, statusFilter, memberById]);

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

  return <main className="page-wrap admin-page">
    <section className="dashboard-panel admin-panel">
      <div className="admin-page-heading"><div><div className="modal-kicker">BOOKMART ADMIN · ภาพรวมร้าน</div><h1>จัดการร้าน</h1><p>ดูแลหนังสือ สต็อก และติดตามคำสั่งซื้อจากหน้านี้</p></div><button className="secondary-button admin-refresh" onClick={() => setRetryCount((count) => count + 1)} disabled={loading}><RefreshCw size={15}/> โหลดข้อมูลใหม่</button></div>

      {error && <div className="form-error admin-alert" role="alert"><AlertTriangle size={17}/><span>{error}</span><button className="secondary-button" onClick={() => setRetryCount((count) => count + 1)}>ลองอีกครั้ง</button></div>}
      {notice && <p className="success-message admin-notice" role="status">{notice}</p>}
      {loading && <p className="admin-loading" role="status">กำลังโหลดข้อมูลร้าน...</p>}

      <div className="admin-overview">
        <article className="overview-card"><span className="overview-icon"><BookOpen size={18}/></span><div><small>หนังสือทั้งหมด</small><strong>{loading ? '—' : books.length}</strong><span>รายการในแคตตาล็อก</span></div></article>
        <article className="overview-card"><span className="overview-icon"><ClipboardList size={18}/></span><div><small>สมาชิกทั้งหมด</small><strong>{loading ? '—' : members.length}</strong><span>บัญชีในระบบ</span></div></article>
        <article className={lowStockBooks.length ? 'overview-card overview-warning' : 'overview-card'}><span className="overview-icon"><Boxes size={18}/></span><div><small>สต็อกต่ำ (ไม่เกิน 5 เล่ม)</small><strong>{loading ? '—' : lowStockBooks.length}</strong><span>{lowStockBooks.length ? 'ควรตรวจสอบจำนวนคงเหลือ' : 'สต็อกอยู่ในระดับปกติ'}</span></div></article>
        <article className="overview-card"><span className="overview-icon"><ClipboardList size={18}/></span><div><small>คำสั่งซื้อทั้งหมด</small><strong>{loading ? '—' : orders.length}</strong><span>รวมทุกสถานะ</span></div></article>
        <article className={pendingOrders.length ? 'overview-card overview-pending' : 'overview-card'}><span className="overview-icon"><TrendingUp size={18}/></span><div><small>รอดำเนินการ</small><strong>{loading ? '—' : pendingOrders.length}</strong><span>คำสั่งซื้อที่ต้องติดตาม</span></div></article>
      </div>

      <section className="admin-section" aria-labelledby="admin-books-title">
        <div className="admin-section-heading"><div><span className="section-index">01</span><div><h2 id="admin-books-title">คลังหนังสือ</h2><p>จัดการรายละเอียด ราคา และจำนวนสินค้า</p></div></div><button className="primary-button" onClick={() => setEdit({ ...blankBook })}><Plus size={16}/> เพิ่มหนังสือ</button></div>
        <label className="admin-search"><Search size={16}/><input value={bookQuery} onChange={(event) => setBookQuery(event.target.value)} placeholder="ค้นหาชื่อหนังสือ ผู้เขียน หรือหมวดหมู่" aria-label="ค้นหาหนังสือในคลัง"/></label>
        {edit && <form className="admin-edit-form" onSubmit={saveBook}>
          <div className="admin-form-title"><div><div className="modal-kicker">BOOK DETAILS</div><h3>{edit.id ? 'แก้ไขข้อมูลหนังสือ' : 'เพิ่มหนังสือใหม่'}</h3></div><button type="button" className="secondary-button" onClick={() => setEdit(null)}>ปิดฟอร์ม</button></div>
          <div className="admin-form-grid">{[['title','ชื่อหนังสือ'],['author','ผู้เขียน'],['category','หมวดหมู่'],['price','ราคา (บาท)'],['stock','จำนวนคงเหลือ'],['cover_url','URL รูปปก']].map(([name,label]) => <label key={name}>{label}<input name={name} type={name === 'price' || name === 'stock' ? 'number' : name === 'cover_url' ? 'url' : 'text'} min={name === 'price' ? '0.01' : name === 'stock' ? '0' : undefined} step={name === 'price' ? '0.01' : name === 'stock' ? '1' : undefined} required defaultValue={edit[name]}/></label>)}</div>
          <label className="admin-description-field">คำอธิบาย<textarea name="description" rows="3" defaultValue={edit.description}/></label>
          <label className="featured-checkbox"><input name="featured" type="checkbox" defaultChecked={Boolean(edit.featured)}/> แสดงเป็นหนังสือแนะนำ</label>
          <div className="form-actions"><button className="primary-button" disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึกหนังสือ'}</button><button type="button" className="secondary-button" onClick={() => setEdit(null)} disabled={saving}>ยกเลิก</button></div>
        </form>}
        <div className="admin-book-table-wrap"><table className="admin-book-table"><thead><tr><th>หนังสือ</th><th>หมวดหมู่</th><th>ราคา</th><th>คงเหลือ</th><th>สถานะ</th><th>จัดการ</th></tr></thead><tbody>
          {!loading && visibleBooks.map((book) => <tr key={book.id}>
            <td><div className="admin-book-title"><img src={book.cover_url} alt=""/><div><strong>{book.title}</strong><small>{book.author}</small></div></div></td>
            <td>{book.category}</td><td>{formatPrice(book.price)}</td>
            <td><span className={Number(book.stock) <= 5 ? 'stock-count stock-low' : 'stock-count'}>{book.stock} เล่ม</span></td>
            <td><span className={Number(book.stock) < 1 ? 'inventory-badge inventory-out' : book.featured ? 'inventory-badge inventory-featured' : 'inventory-badge'}>{Number(book.stock) < 1 ? 'หมด' : book.featured ? 'แนะนำ' : 'พร้อมขาย'}</span></td>
            <td><div className="admin-row-actions"><button className="secondary-button" onClick={() => setEdit({ ...book })}>แก้ไข</button><button className="delete-button" onClick={() => deleteBook(book)}>ลบ</button></div></td>
          </tr>)}
        </tbody></table></div>
        {!loading && visibleBooks.length === 0 && <div className="admin-empty">{books.length ? 'ไม่พบหนังสือที่ตรงกับคำค้น' : 'ยังไม่มีหนังสือในร้าน กด “เพิ่มหนังสือ” เพื่อเริ่มต้น'}</div>}
        <p className="admin-list-count">แสดง {loading ? '—' : visibleBooks.length} จาก {loading ? '—' : books.length} รายการ</p>
      </section>

      <section className="admin-section admin-orders-section" aria-labelledby="admin-orders-title">
        <div className="admin-section-heading"><div><span className="section-index">02</span><div><h2 id="admin-orders-title">คำสั่งซื้อ</h2><p>ตรวจรายการสินค้า ยอดรวม และปรับสถานะจัดส่ง</p></div></div><span className="orders-count">{loading ? 'กำลังโหลด' : `${visibleOrders.length} รายการ`}</span></div>
        <div className="admin-order-filters"><label className="admin-search"><Search size={16}/><input value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} placeholder="ค้นหาเลขคำสั่งซื้อ สมาชิก หรือชื่อหนังสือ" aria-label="ค้นหาคำสั่งซื้อ"/></label><label className="status-filter">กรองสถานะ<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">ทุกสถานะ</option><option value="pending">รอดำเนินการ</option><option value="paid">ชำระแล้ว</option><option value="shipped">จัดส่งแล้ว</option><option value="cancelled">ยกเลิก</option></select></label></div>
        {visibleOrders.map((order) => <article className="admin-order-card" key={order.id}>
          <header className="admin-order-card-head"><div><span className="order-label">คำสั่งซื้อ</span><strong>#{order.id}</strong><time>{formatDate(order.created_at)}</time></div><span className={`order-status status-${order.status}`}>{statusLabels[order.status] || order.status}</span></header>
          <div className="admin-order-customer"><span>ผู้สั่งซื้อ <strong>{memberById.get(String(order.user_id))?.name || `สมาชิก #${order.user_id}`}</strong><small>{memberById.get(String(order.user_id))?.email || `รหัสสมาชิก ${order.user_id}`}</small></span><span>{order.items?.length || 0} รายการสินค้า</span></div>
          <div className="admin-order-items">{order.items?.map((item, index) => <div className="admin-order-item" key={`${item.book_id}-${index}`}><span>{item.title}<small>{formatPrice(item.price)} × {item.quantity}</small></span><strong>{formatPrice(Number(item.price) * Number(item.quantity))}</strong></div>)}</div>
          <footer className="admin-order-card-foot"><div><small>ยอดรวมคำสั่งซื้อ</small><strong>{formatPrice(order.total)}</strong></div><label>เปลี่ยนสถานะ<select aria-label={`สถานะคำสั่งซื้อ ${order.id}`} value={order.status} disabled={changingOrderId === order.id} onChange={(event) => changeStatus(order, event.target.value)}><option value="pending">รอดำเนินการ</option><option value="paid">ชำระแล้ว</option><option value="shipped">จัดส่งแล้ว</option><option value="cancelled">ยกเลิก</option></select></label></footer>
        </article>)}
        {!loading && visibleOrders.length === 0 && <div className="admin-empty">{orders.length ? 'ไม่พบคำสั่งซื้อที่ตรงกับตัวกรอง' : 'ยังไม่มีคำสั่งซื้อจากสมาชิก'}</div>}
      </section>
    </section>
  </main>;
}
