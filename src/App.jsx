import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { api } from './api/backend';
import { useAuth } from './auth/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound, { Forbidden } from './pages/NotFound';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Register from './pages/Register';

export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const dismissNotice = useCallback(() => setNotice(null), []);
  useEffect(() => {
    if (user && location.state?.reopenCart) {
      setCartOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [user, location.pathname, location.state, navigate]);
  function addToCart(book) {
    const existing = cart.find((item) => item.book.id === book.id);
    if (Number(book.stock) < 1 || (existing && existing.quantity >= Number(book.stock))) {
      setNotice({ text: 'หนังสือเล่มนี้มีสินค้าไม่เพียงพอ', error: true });
      return;
    }
    setCart((current) => {
      const line = current.find((item) => item.book.id === book.id);
      return line ? current.map((item) => item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { book, quantity: 1 }];
    });
    setNotice({ text: 'เพิ่มหนังสือลงตะกร้าแล้ว' });
  }
  function changeQuantity(bookId, amount) {
    const line = cart.find((item) => item.book.id === bookId);
    if (amount > 0 && line && line.quantity >= Number(line.book.stock)) {
      setNotice({ text: 'จำนวนสินค้าในร้านมีเท่านี้แล้ว', error: true });
      return;
    }
    setCart((current) => current.map((item) => item.book.id === bookId ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  }
  async function checkout() {
    if (!user) { setNotice({ text: 'เข้าสู่ระบบก่อนสั่งซื้อ', error: true }); navigate('/login', { state: { from: '/', checkout: true } }); return; }
    try { await api.createOrder(cart.map(({ book, quantity }) => ({ book_id: book.id, quantity }))); setCart([]); setNotice({ text: 'สั่งซื้อสำเร็จ ขอบคุณที่อุดหนุน' }); navigate('/orders'); }
    catch (problem) { setNotice({ text: problem.message, error: true }); }
  }
  return <div className="app-shell">
    <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCart={() => { navigate('/'); setCartOpen(true); }}/>
    <Routes>
      <Route path="/" element={<Home cart={cart} onAdd={addToCart} onQuantity={changeQuantity} onCheckout={checkout} notice={notice} cartOpen={cartOpen} setCartOpen={setCartOpen}/>}/>
      <Route path="/login" element={user ? <Navigate to="/" replace/> : <Login/>}/>
      <Route path="/register" element={user ? <Navigate to="/" replace/> : <Register/>}/>
      <Route element={<ProtectedRoute/>}><Route path="/profile" element={<Profile/>}/><Route path="/orders" element={<Orders/>}/></Route>
      <Route element={<ProtectedRoute role="admin"/>}><Route path="/admin" element={<Admin/>}/></Route>
      <Route path="/403" element={<Forbidden/>}/><Route path="*" element={<NotFound/>}/>
    </Routes>
    <Toast notice={notice} onDismiss={dismissNotice}/>
  </div>;
}
