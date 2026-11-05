import { Link } from 'react-router-dom';

export function Forbidden() { return <main className="page-wrap"><section className="account-card"><div className="modal-kicker">403 · FORBIDDEN</div><h1>หน้านี้สำหรับผู้ดูแลระบบ</h1><p>บัญชีของคุณไม่มีสิทธิ์เข้าถึงส่วนนี้</p><Link className="primary-button" to="/">กลับไปหน้าร้าน</Link></section></main>; }
export default function NotFound() { return <main className="page-wrap"><section className="account-card"><div className="modal-kicker">404 · NOT FOUND</div><h1>ไม่พบหน้าที่คุณกำลังหา</h1><Link className="primary-button" to="/">กลับไปหน้าร้าน</Link></section></main>; }
