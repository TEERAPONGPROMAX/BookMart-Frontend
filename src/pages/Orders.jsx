import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/backend';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api.orders().then(setOrders).catch((problem) => setError(problem.message)).finally(() => setLoading(false)); }, []);
  return <main className="page-wrap"><section className="dashboard-panel"><div className="modal-kicker">ORDER HISTORY</div><h1>ประวัติการสั่งซื้อ</h1>{loading && <p role="status">กำลังโหลดประวัติ...</p>}{error && <div className="form-error" role="alert">{error}</div>}{!loading && !error && orders.length === 0 && <div className="empty-state"><Clock3/><h3>ยังไม่มีรายการสั่งซื้อ</h3><p>เมื่อคุณสั่งซื้อ รายการจะแสดงที่นี่</p></div>}{orders.map((order) => <article className="order-card" key={order.id}><div className="order-head"><b>#{String(order.id).slice(0, 8)}</b><span>{new Date(order.created_at).toLocaleDateString('th-TH')}</span></div>{order.items?.map((item, index) => <p key={`${item.book_id}-${index}`}>{item.title} × {item.quantity}</p>)}<div className="order-total"><span>{order.status}</span><b>฿{Number(order.total).toLocaleString()}</b></div></article>)}</section></main>;
}
