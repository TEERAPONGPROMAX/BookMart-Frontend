import { BookOpen, LogOut, Menu, ShieldCheck, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar({ cartCount, onCart }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <div className="announcement"><BookOpen size={14}/> ส่งฟรีเมื่อซื้อครบ ฿999 <span>·</span> เติมความสุขให้ทุกวันด้วยหนังสือดี ๆ</div>
    <header className="header">
      <button className="icon-btn mobile-toggle" aria-label="เปิดเมนู" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <Link className="brand" to="/"><span className="brand-mark"><BookOpen size={23}/></span><span>book<span className="brand-accent">mart</span><small>อ่านแล้วเติบโต</small></span></Link>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>หนังสือทั้งหมด</NavLink>
        <a href="/#featured" onClick={() => setMenuOpen(false)}>เล่มแนะนำ</a>
        <a href="/#about" onClick={() => setMenuOpen(false)}>เกี่ยวกับเรา</a>
      </nav>
      <div className="header-actions">
        {user ? <>
          <Link className="icon-btn user-action" title="บัญชีของฉัน" to="/profile"><UserRound size={19}/><span>{user.name}</span></Link>
          <Link className="icon-btn history-action" title="ประวัติการสั่งซื้อ" to="/orders">ประวัติ</Link>
          {user.role === 'admin' && <Link className="icon-btn" title="จัดการร้าน" to="/admin"><ShieldCheck size={19}/></Link>}
          <button className="icon-btn" title="ออกจากระบบ" onClick={logout}><LogOut size={17}/></button>
        </> : <Link className="icon-btn user-action" to="/login"><UserRound size={19}/><span>เข้าสู่ระบบ</span></Link>}
        <button className="cart-button" onClick={onCart}><ShoppingBag size={18}/><span>ตะกร้า</span><b>{cartCount}</b></button>
      </div>
    </header>
  </>;
}
