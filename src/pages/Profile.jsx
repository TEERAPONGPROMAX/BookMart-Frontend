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
