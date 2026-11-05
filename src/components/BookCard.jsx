import { Plus } from 'lucide-react';

export default function BookCard({ book, onAdd }) {
  return <article className="book-card">
      <button className="book-cover" onClick={() => onAdd(book)} aria-label={`เพิ่ม ${book.title} ลงตะกร้า`} disabled={Number(book.stock) < 1}>
      <img src={book.cover_url} alt={`ปกหนังสือ ${book.title}`} loading="lazy"/>
      <span className="cover-quick"><Plus size={16}/> เพิ่มลงตะกร้า</span>
      {book.featured && <span className="book-badge">BESTSELLER</span>}
    </button>
    <div className="book-meta"><span className="book-category">{book.category}</span>{book.featured && <span className="rating">BOOKMART PICK</span>}</div>
    <h3>{book.title}</h3><p className="book-author">{book.author}</p>
    <div className="book-buy"><b>฿{Number(book.price).toLocaleString()}</b>{Number(book.stock) > 0 ? <button onClick={() => onAdd(book)} aria-label={`ซื้อ ${book.title}`}><Plus size={17}/></button> : <span className="sold-out">สินค้าหมด</span>}</div>
  </article>;
}
