import { BookOpen, Boxes, ClipboardList, TrendingUp } from 'lucide-react';

export default function AdminStats({ books, members, orders, loading }) {
  const lowStock = books.filter((book) => Number(book.stock) <= 5);
  const pending = orders.filter((order) => order.status === 'pending');
  return <div className="admin-overview">
    <article className="overview-card"><span className="overview-icon"><BookOpen size={18}/></span><div><small>หนังสือทั้งหมด</small><strong>{loading ? '—' : books.length}</strong><span>รายการในแคตตาล็อก</span></div></article>
    <article className="overview-card"><span className="overview-icon"><ClipboardList size={18}/></span><div><small>สมาชิกทั้งหมด</small><strong>{loading ? '—' : members.length}</strong><span>บัญชีในระบบ</span></div></article>
    <article className={lowStock.length ? 'overview-card overview-warning' : 'overview-card'}><span className="overview-icon"><Boxes size={18}/></span><div><small>สต็อกต่ำ (ไม่เกิน 5 เล่ม)</small><strong>{loading ? '—' : lowStock.length}</strong><span>{lowStock.length ? 'ควรตรวจสอบจำนวนคงเหลือ' : 'สต็อกอยู่ในระดับปกติ'}</span></div></article>
    <article className="overview-card"><span className="overview-icon"><ClipboardList size={18}/></span><div><small>คำสั่งซื้อทั้งหมด</small><strong>{loading ? '—' : orders.length}</strong><span>รวมทุกสถานะ</span></div></article>
    <article className={pending.length ? 'overview-card overview-pending' : 'overview-card'}><span className="overview-icon"><TrendingUp size={18}/></span><div><small>รอดำเนินการ</small><strong>{loading ? '—' : pending.length}</strong><span>คำสั่งซื้อที่ต้องติดตาม</span></div></article>
  </div>;
}
