import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/backend';

const blankBook = { title: '', author: '', category: '', price: '', stock: '', cover_url: '', description: '' };

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  async function refreshBooks() { setBooks(await api.books()); }
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([api.books(), api.adminOrders()])
      .then(([bookRows, orderRows]) => { if (active) { setBooks(bookRows); setOrders(orderRows); } })
      .catch((problem) => { if (active) setError(problem.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retryCount]);

  async function saveBook(event) {
    event.preventDefault(); setError('');
    const form = new FormData(event.currentTarget);
    const book = { title: form.get('title'), author: form.get('author'), category: form.get('category'), price: Number(form.get('price')), stock: Number(form.get('stock')), cover_url: form.get('cover_url'), description: form.get('description') };
    try { if (edit?.id) await api.updateBook(edit.id, book); else await api.saveBook(book); await refreshBooks(); setEdit(null); setNotice('บันทึกข้อมูลหนังสือแล้ว'); }
    catch (problem) { setError(problem.message); }
  }
  async function deleteBook(book) {
    if (!window.confirm(`ยืนยันลบ “${book.title}” หรือไม่?`)) return;
    try { await api.deleteBook(book.id); await refreshBooks(); setNotice('ลบหนังสือแล้ว'); }
    catch (problem) { setError(problem.message); }
  }
  async function changeStatus(order, status) {
    try { await api.updateOrder(order.id, status); setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item)); }
    catch (problem) { setError(problem.message); }
  }

  return <main className="page-wrap"><section className="dashboard-panel admin-panel"><div className="modal-kicker">BOOKMART ADMIN</div><h1>จัดการร้าน</h1>{error && <div className="form-error" role="alert">{error}<button className="secondary-button" onClick={() => setRetryCount((count) => count + 1)}>โหลดข้อมูลอีกครั้ง</button></div>}{notice && <p className="success-message" role="status">{notice}</p>}
    {loading && <p role="status">กำลังโหลดข้อมูลร้าน...</p>}
    <div className="admin-stats"><div><small>หนังสือในร้าน</small><b>{loading ? '—' : books.length}</b></div><div><small>คำสั่งซื้อทั้งหมด</small><b>{loading ? '—' : orders.length}</b></div></div>
    <div className="admin-heading"><h2>หนังสือ</h2><button className="primary-button" onClick={() => setEdit({ ...blankBook })}><Plus size={16}/> เพิ่มหนังสือ</button></div>
    {edit && <form className="admin-edit-form" onSubmit={saveBook}><h3>{edit.id ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}</h3><div className="admin-form-grid">{[['title','ชื่อหนังสือ'],['author','ผู้เขียน'],['category','หมวดหมู่'],['price','ราคา'],['stock','จำนวนคงเหลือ'],['cover_url','URL รูปปก']].map(([name,label]) => <label key={name}>{label}<input name={name} type={name === 'price' || name === 'stock' ? 'number' : name === 'cover_url' ? 'url' : 'text'} min={name === 'price' ? '0.01' : name === 'stock' ? '0' : undefined} step={name === 'price' ? '0.01' : name === 'stock' ? '1' : undefined} required defaultValue={edit[name]}/></label>)}</div><label>คำอธิบาย<textarea name="description" rows="2" defaultValue={edit.description}/></label><div className="form-actions"><button className="primary-button">บันทึก</button><button type="button" className="secondary-button" onClick={() => setEdit(null)}>ยกเลิก</button></div></form>}
    <div className="admin-book-list">{!loading && !error && books.length === 0 && <p className="form-intro">ยังไม่มีหนังสือในร้าน กด “เพิ่มหนังสือ” เพื่อเริ่มต้น</p>}{books.map((book) => <div key={book.id}><span>{book.title}<small>฿{Number(book.price).toLocaleString()} · คงเหลือ {book.stock}</small></span><button className="secondary-button" onClick={() => setEdit({ ...book })}>แก้ไข</button><button className="delete-button" onClick={() => deleteBook(book)}>ลบ</button></div>)}</div>
    <h2 className="admin-subhead">คำสั่งซื้อ</h2>{!loading && !error && orders.length === 0 && <p className="form-intro">ยังไม่มีรายการสั่งซื้อ</p>}{orders.map((order) => <div className="admin-order" key={order.id}><span>#{String(order.id).slice(0, 8)} · ฿{Number(order.total).toLocaleString()}</span><select aria-label={`สถานะคำสั่งซื้อ ${String(order.id).slice(0, 8)}`} value={order.status} onChange={(event) => changeStatus(order, event.target.value)}><option value="pending">รอดำเนินการ</option><option value="paid">ชำระแล้ว</option><option value="shipped">จัดส่งแล้ว</option><option value="cancelled">ยกเลิก</option></select></div>)}
  </section></main>;
}
