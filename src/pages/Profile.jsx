import { Check, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/backend';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  async function updateName(event) {
    event.preventDefault(); setNotice(''); setError('');
    try { const form = new FormData(event.currentTarget); setUser(await api.updateProfile(form.get('name'))); setNotice('บันทึกโปรไฟล์แล้ว'); }
    catch (problem) { setError(problem.message); }
  }
  async function updatePassword(event) {
    event.preventDefault(); setNotice(''); setError('');
    const formElement = event.currentTarget;
    try { const form = new FormData(formElement); await api.changePassword(form.get('password')); formElement.reset(); setNotice('เปลี่ยนรหัสผ่านแล้ว'); }
    catch (problem) { setError(problem.message); }
  }
  return <main className="page-wrap"><section className="account-card profile-card"><UserRound className="account-icon"/><div className="modal-kicker">YOUR ACCOUNT</div><h1>บัญชีของฉัน</h1><p>สมาชิก BookMart · {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักอ่าน'}</p>{user.role === 'admin' && <span className="role-chip"><ShieldCheck size={14}/> ADMIN</span>}{notice && <p className="success-message" role="status">{notice}</p>}{error && <div className="form-error" role="alert">{error}</div>}
    <form className="auth-form" onSubmit={updateName}><label>ชื่อที่แสดง<input name="name" defaultValue={user.name} required minLength="2"/></label><label>อีเมล<input value={user.email} disabled/></label><button className="primary-button full-button">บันทึกโปรไฟล์ <Check size={16}/></button></form>
    <form className="auth-form password-form" onSubmit={updatePassword}><label>เปลี่ยนรหัสผ่าน<input name="password" type="password" minLength="8" required placeholder="รหัสผ่านใหม่ อย่างน้อย 8 ตัว"/></label><button className="secondary-button">อัปเดตรหัสผ่าน</button></form>
    <button className="logout-button" onClick={logout}><LogOut size={16}/> ออกจากระบบ</button>
  </section></main>;
}