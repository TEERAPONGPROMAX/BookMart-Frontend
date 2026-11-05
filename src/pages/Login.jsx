import { ArrowRight, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      await login(form.get('email'), form.get('password'));
      navigate(location.state?.from || '/', { replace: true, state: location.state?.checkout ? { reopenCart: true } : null });
    }
    catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  }
  return <main className="page-wrap"><section className="account-card"><BookOpen className="account-icon"/><div className="modal-kicker">WELCOME TO BOOKMART</div><h1>กลับมาอ่านด้วยกัน</h1><p>เข้าสู่ระบบเพื่อสั่งซื้อและติดตามหนังสือของคุณ</p>{error && <div className="form-error" role="alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label>อีเมล<input type="email" name="email" required autoComplete="email" placeholder="you@example.com"/></label><label>รหัสผ่าน<input type="password" name="password" required autoComplete="current-password" placeholder="รหัสผ่านของคุณ"/></label><button className="primary-button full-button" disabled={busy}>{busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'} <ArrowRight size={17}/></button></form><p className="switch-auth">ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link></p></section></main>;
}
