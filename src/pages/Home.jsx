import { ArrowRight, BookOpen, Check, Feather, Filter, Heart, Plus, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/backend';
import BookCard from '../components/BookCard';

const categories = ['ทั้งหมด', 'วรรณกรรม', 'พัฒนาตนเอง', 'ธุรกิจ', 'จิตวิทยา', 'แฟนตาซี'];
const sampleBooks = [
  { id:'b1',title:'ร้านไม่สะดวกซื้อของคุณทกโก',author:'คิม โฮยอน',category:'วรรณกรรม',price:325,cover_url:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=85',description:'เรื่องราวอบอุ่นหัวใจของร้านสะดวกซื้อเล็ก ๆ ที่เปลี่ยนชีวิตผู้คนในย่าน',stock:18,featured:true },
  { id:'b2',title:'Atomic Habits เพราะชีวิตดีได้กว่าที่เป็น',author:'James Clear',category:'พัฒนาตนเอง',price:395,cover_url:'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=85',description:'เปลี่ยนแปลงเล็ก ๆ ทุกวัน เพื่อผลลัพธ์ที่ยิ่งใหญ่ในระยะยาว',stock:25,featured:true },
  { id:'b3',title:'ก่อนที่กาแฟจะเย็นลง',author:'โทชิคาซึ คาวากุจิ',category:'วรรณกรรม',price:289,cover_url:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=85',description:'คาเฟ่เล็ก ๆ ที่ให้คุณย้อนเวลากลับไปพบคนสำคัญอีกครั้ง',stock:9},
  { id:'b4',title:'จิตวิทยาสายดาร์ก',author:'Dr. Hiro',category:'จิตวิทยา',price:275,cover_url:'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&q=85',description:'เข้าใจเบื้องหลังความคิดและพฤติกรรมของมนุษย์',stock:12},
  { id:'b5',title:'The Psychology of Money',author:'Morgan Housel',category:'ธุรกิจ',price:420,cover_url:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=85',description:'บทเรียนอมตะเกี่ยวกับความมั่งคั่ง ความโลภ และความสุข',stock:15},
  { id:'b6',title:'เจ้าชายน้อย',author:'Antoine de Saint-Exupéry',category:'แฟนตาซี',price:195,cover_url:'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=85',description:'นิทานแสนลึกซึ้งที่จะทำให้คุณมองโลกด้วยหัวใจอีกครั้ง',stock:30},
  { id:'b7',title:'ชีวิตเรามีแค่สี่พันสัปดาห์',author:'Oliver Burkeman',category:'พัฒนาตนเอง',price:350,cover_url:'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=85',description:'คู่มือจัดการเวลา สำหรับชีวิตที่ไม่อาจทำทุกอย่างได้',stock:7},
  { id:'b8',title:'The Midnight Library',author:'Matt Haig',category:'แฟนตาซี',price:390,cover_url:'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&q=85',description:'ห้องสมุดระหว่างความเป็นและความตาย กับชีวิตนับไม่ถ้วน',stock:11},
];

export default function Home({ cart, onAdd, onQuantity, onCheckout, notice, cartOpen, setCartOpen }) {
  const [books, setBooks] = useState([]);
  const [apiLive, setApiLive] = useState(false);
  const [apiError, setApiError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ทั้งหมด');
  useEffect(() => {
    let active = true;
    setLoading(true);
    setApiError('');
    api.books().then((data) => { if (active) { setBooks(data); setApiLive(true); } })
      .catch((problem) => { if (active) { setBooks(sampleBooks); setApiLive(false); setApiError(problem.message || 'เชื่อมต่อร้านหนังสือไม่สำเร็จ'); } })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [retryCount]);

  const filtered = useMemo(() => books.filter((book) =>
    (category === 'ทั้งหมด' || book.category === category)
      && `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())), [books, category, query]);
  const cartTotal = cart.reduce((sum, line) => sum + Number(line.book.price) * line.quantity, 0);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  return <main id="top">
    <section className="hero" id="featured">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> ร้านหนังสือสำหรับทุกการเติบโต</div>
        <h1>บางครั้ง<br/>คำตอบที่ตามหา<br/>อยู่ใน <em>หน้าถัดไป</em></h1>
        <p>คัดสรรหนังสือที่ใช่ เพื่อช่วงเวลาที่ดีที่สุดของคุณ<br/>เพราะทุกเรื่องราวดี ๆ เริ่มต้นจากการเปิดอ่าน</p>
        <a href="#books" className="primary-button">ค้นพบหนังสือ <ArrowRight size={17}/></a>
        <div className="hero-note"><span className="avatar-stack"><i>น</i><i>พ</i><i>ม</i></span><span>นักอ่านกว่า <b>2,400+</b> คน เลือกเรา</span></div>
      </div>
      <div className="hero-art"><div className="sun-shape"/><div className="book-visual book-back"><div className="book-spine"/><div className="cover-type">A LIFE<br/>IN STORIES</div><div className="cover-art">✳</div><span>GROW THROUGH<br/>EVERY PAGE</span></div><div className="book-visual book-front"><div className="book-spine"/><div className="cover-illustration"><span>✳</span><i>✿</i><b>· · ·</b></div><div className="book-title-art">ร้านหนังสือ<br/><strong>ในวันที่<br/>ฝนพรำ</strong><small>เรื่องราวที่ทำให้ใจอบอุ่น</small></div><div className="cover-bottom">BOOKMART EDITION</div></div><div className="floating-note"><span>✦</span><div><b>เรื่องราวดี ๆ</b><small>กำลังรอคุณอยู่</small></div></div><div className="floating-stamp">READ<br/>MORE<br/>WORRY<br/>LESS</div></div>
      <div className="hero-bottom"><span>EST. 2024</span><span className="scroll-hint">เลื่อนเพื่อค้นพบ <span>↓</span></span><span>CHIANG MAI · THAILAND</span></div>
    </section>
    <section className="benefits"><div><span className="benefit-icon"><Feather size={19}/></span><p><b>คัดสรรอย่างตั้งใจ</b><small>ทุกเล่มมีเรื่องราว</small></p></div><div><span className="benefit-icon"><ShoppingBag size={19}/></span><p><b>แพ็กด้วยความใส่ใจ</b><small>ถึงมือคุณอย่างปลอดภัย</small></p></div><div><span className="benefit-icon"><Heart size={19}/></span><p><b>อ่านแล้วแบ่งปัน</b><small>ชุมชนนักอ่านที่อบอุ่น</small></p></div><div><span className="benefit-icon"><Check size={19}/></span><p><b>ชำระเงินปลอดภัย</b><small>ง่ายและมั่นใจทุกขั้นตอน</small></p></div></section>
    <section className="catalog section-pad" id="books"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> BOOKSHELF</div><h2>เลือกเรื่องราว<br/><em>ที่เป็นของคุณ</em></h2></div><p>ไม่ว่าคุณกำลังมองหาแรงบันดาลใจ<br/>หรือแค่อยากพักใจสักครู่ เรามีหนังสือสำหรับคุณ</p></div>
      <div className="catalog-toolbar"><div className="category-pills">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? 'pill active' : 'pill'}>{item}</button>)}</div><label className="search-box"><Search size={17}/><input aria-label="ค้นหาหนังสือ" placeholder="ค้นหาชื่อหนังสือ หรือผู้เขียน" value={query} onChange={(event) => setQuery(event.target.value)}/><Filter size={15}/></label></div>
      {loading && <div className="status-line" role="status">กำลังโหลดหนังสือ...</div>}
      {apiError && <div className="catalog-error" role="alert"><span>เชื่อมต่อ API ไม่สำเร็จ: {apiError} · กำลังแสดงข้อมูลตัวอย่าง</span><button className="secondary-button" onClick={() => setRetryCount((count) => count + 1)}>ลองอีกครั้ง</button></div>}
      {!loading && filtered.length === 0 && <div className="empty-state"><BookOpen/><h3>ยังไม่พบหนังสือที่ค้นหา</h3><p>ลองเปลี่ยนคำค้นหรือเลือกหมวดหมู่อื่น</p></div>}
      {!loading && <div className="book-grid">{filtered.map((book) => <BookCard key={book.id} book={book} onAdd={onAdd}/>)}</div>}
      <div className="catalog-foot"><span>{loading ? 'กำลังโหลดรายการหนังสือ' : `แสดง ${filtered.length} จาก ${books.length} เล่ม`}</span><span className="api-indicator"><i className={apiLive ? 'online' : ''}/>{apiLive ? 'เชื่อมต่อ BookMart API แล้ว' : apiError ? 'โหมดข้อมูลตัวอย่าง' : 'รอการเชื่อมต่อ API'}</span></div>
    </section>
    <section className="quote-band" id="about"><div className="quote-mark">“</div><blockquote>หนังสือที่ดีหนึ่งเล่ม<br/>อาจเปลี่ยนวันที่ธรรมดาให้พิเศษขึ้นมา</blockquote><span>— BOOKMART READING CLUB —</span></section>
    <footer className="footer"><Link className="brand" to="/"><span className="brand-mark"><BookOpen size={21}/></span><span>book<span className="brand-accent">mart</span><small>อ่านแล้วเติบโต</small></span></Link><p>เรื่องราวดี ๆ เริ่มต้นจากการเปิดอ่าน</p><span>© 2025 BOOKMART · MADE FOR READERS</span></footer>

    <button id="open-cart" aria-label="เปิดตะกร้า" className="floating-cart" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/> ตะกร้า <b>{cartCount}</b></button>
      {cartOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}><section className="modal drawer" role="dialog" aria-modal="true" aria-label="ตะกร้าสินค้า"><button className="modal-close" onClick={() => setCartOpen(false)} aria-label="ปิด"><X/></button><div className="modal-kicker">YOUR BAG</div><h2>ตะกร้าหนังสือ <span className="count-badge">{cartCount}</span></h2>
      {cart.length === 0 ? <div className="empty-state"><ShoppingBag/><h3>ตะกร้ายังว่างอยู่</h3><p>เลือกหนังสือที่คุณชอบ แล้วกลับมาที่นี่ได้เลย</p><button className="primary-button" onClick={() => setCartOpen(false)}>เลือกหนังสือ <ArrowRight size={16}/></button></div> : <><div className="cart-lines">{cart.map((line) => <div className="cart-line" key={line.book.id}><img src={line.book.cover_url} alt=""/><div className="line-info"><b>{line.book.title}</b><small>{line.book.author}</small><strong>฿{(Number(line.book.price) * line.quantity).toLocaleString()}</strong></div><div className="quantity"><button onClick={() => onQuantity(line.book.id, -1)} aria-label="ลดจำนวน">−</button><span>{line.quantity}</span><button onClick={() => onQuantity(line.book.id, 1)} aria-label="เพิ่มจำนวน" disabled={line.quantity >= Number(line.book.stock)}><Plus size={13}/></button></div></div>)}</div><div className="cart-summary"><div><span>ยอดรวม</span><b>฿{cartTotal.toLocaleString()}</b></div><small>ค่าจัดส่งคำนวณในขั้นตอนถัดไป</small><button className="primary-button full-button" onClick={() => { setCartOpen(false); onCheckout(); }}>ดำเนินการสั่งซื้อ <ArrowRight size={17}/></button></div></>}
      {notice && <p className="cart-notice" role="status">{notice.text}</p>}</section></div>}
  </main>;
}
