import { ArrowRight, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try { await register(form.get('name'), form.get('email'), form.get('password')); navigate('/profile', { replace: true }); }
    catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  }
  return <main className="page-wrap"><section className="account-card"><BookOpen className="account-icon"/><div className="modal-kicker">JOIN BOOKMART</div><h1>เริ่มต้นการเดินทาง</h1><p>สมัครสมาชิก เพื่อเก็บหนังสือเล่มโปรดไว้ในที่เดียว</p>{error && <div className="form-error" role="alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label>ชื่อที่แสดง<input name="name" required minLength="2" autoComplete="name" placeholder="ชื่อของคุณ"/></label><label>อีเมล<input type="email" name="email" required autoComplete="email" placeholder="you@example.com"/></label><label>รหัสผ่าน<input type="password" name="password" required minLength="8" autoComplete="new-password" placeholder="อย่างน้อย 8 ตัวอักษร"/></label><button className="primary-button full-button" disabled={busy}>{busy ? 'กำลังสมัคร...' : 'สมัครสมาชิก'} <ArrowRight size={17}/></button></form><p className="switch-auth">มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p></section></main>;
}
