import { Plus, Search } from 'lucide-react';
import AdminBookForm from './AdminBookForm';
import { formatPrice } from './formatters';

export default function AdminBooks({ books, visibleBooks, loading, query, setQuery, edit, setEdit, blankBook, saving, onSave, onDelete }) {
  return <section className="admin-section" aria-labelledby="admin-books-title">
    <div className="admin-section-heading"><div><span className="section-index">01</span><div><h2 id="admin-books-title">คลังหนังสือ</h2><p>จัดการรายละเอียด ราคา และจำนวนสินค้า</p></div></div><button className="primary-button" onClick={() => setEdit({ ...blankBook })}><Plus size={16}/> เพิ่มหนังสือ</button></div>
    <label className="admin-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อหนังสือ ผู้เขียน หรือหมวดหมู่" aria-label="ค้นหาหนังสือในคลัง"/></label>
    {edit && <AdminBookForm key={edit.id || 'new'} book={edit} saving={saving} onSubmit={onSave} onClose={() => setEdit(null)}/>}
    <div className="admin-book-table-wrap"><table className="admin-book-table"><thead><tr><th>หนังสือ</th><th>หมวดหมู่</th><th>ราคา</th><th>คงเหลือ</th><th>สถานะ</th><th>จัดการ</th></tr></thead><tbody>
      {!loading && visibleBooks.map((book) => <tr key={book.id}><td><div className="admin-book-title"><img src={book.cover_url} alt=""/><div><strong>{book.title}</strong><small>{book.author}</small></div></div></td><td>{book.category}</td><td>{formatPrice(book.price)}</td><td><span className={Number(book.stock) <= 5 ? 'stock-count stock-low' : 'stock-count'}>{book.stock} เล่ม</span></td><td><span className={Number(book.stock) < 1 ? 'inventory-badge inventory-out' : book.featured ? 'inventory-badge inventory-featured' : 'inventory-badge'}>{Number(book.stock) < 1 ? 'หมด' : book.featured ? 'แนะนำ' : 'พร้อมขาย'}</span></td><td><div className="admin-row-actions"><button className="secondary-button" onClick={() => setEdit({ ...book })}>แก้ไข</button><button className="delete-button" onClick={() => onDelete(book)}>ลบ</button></div></td></tr>)}
    </tbody></table></div>
    {!loading && visibleBooks.length === 0 && <div className="admin-empty">{books.length ? 'ไม่พบหนังสือที่ตรงกับคำค้น' : 'ยังไม่มีหนังสือในร้าน กด “เพิ่มหนังสือ” เพื่อเริ่มต้น'}</div>}
    <p className="admin-list-count">แสดง {loading ? '—' : visibleBooks.length} จาก {loading ? '—' : books.length} รายการ</p>
  </section>;
}
