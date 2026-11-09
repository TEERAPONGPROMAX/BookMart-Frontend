import { Search } from 'lucide-react';
import { formatDate, formatPrice } from './formatters';

const statusLabels = { pending: 'รอดำเนินการ', paid: 'ชำระแล้ว', shipped: 'จัดส่งแล้ว', cancelled: 'ยกเลิก' };

export default function AdminOrders({ orders, visibleOrders, membersById, loading, query, setQuery, statusFilter, setStatusFilter, changingOrderId, onChangeStatus }) {
  return <section className="admin-section admin-orders-section" aria-labelledby="admin-orders-title" id="admin-orders">
    <div className="admin-section-heading"><div><span className="section-index">02</span><div><h2 id="admin-orders-title">คำสั่งซื้อ</h2><p>ตรวจรายการสินค้า ยอดรวม และปรับสถานะจัดส่ง</p></div></div><span className="orders-count">{loading ? 'กำลังโหลด' : `${visibleOrders.length} รายการ`}</span></div>
    <div className="admin-order-filters"><label className="admin-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาเลขคำสั่งซื้อ สมาชิก หรือชื่อหนังสือ" aria-label="ค้นหาคำสั่งซื้อ"/></label><label className="status-filter">กรองสถานะ<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">ทุกสถานะ</option><option value="pending">รอดำเนินการ</option><option value="paid">ชำระแล้ว</option><option value="shipped">จัดส่งแล้ว</option><option value="cancelled">ยกเลิก</option></select></label></div>
    {visibleOrders.map((order) => {
      const member = membersById.get(String(order.user_id));
      return <article className="admin-order-card" key={order.id}>
        <header className="admin-order-card-head"><div><span className="order-label">คำสั่งซื้อ</span><strong>#{order.id}</strong><time>{formatDate(order.created_at)}</time></div><span className={`order-status status-${order.status}`}>{statusLabels[order.status] || order.status}</span></header>
        <div className="admin-order-customer"><span>ผู้สั่งซื้อ <strong>{member?.name || `สมาชิก #${order.user_id}`}</strong><small>{member?.email || `รหัสสมาชิก ${order.user_id}`}</small></span><span>{order.items?.length || 0} รายการสินค้า</span></div>
        <div className="admin-order-items">{order.items?.map((item, index) => <div className="admin-order-item" key={`${item.book_id}-${index}`}><span>{item.title}<small>{formatPrice(item.price)} × {item.quantity}</small></span><strong>{formatPrice(Number(item.price) * Number(item.quantity))}</strong></div>)}</div>
        <footer className="admin-order-card-foot"><div><small>ยอดรวมคำสั่งซื้อ</small><strong>{formatPrice(order.total)}</strong></div><label>เปลี่ยนสถานะ<select aria-label={`สถานะคำสั่งซื้อ ${order.id}`} value={order.status} disabled={changingOrderId === order.id} onChange={(event) => onChangeStatus(order, event.target.value)}><option value="pending">รอดำเนินการ</option><option value="paid">ชำระแล้ว</option><option value="shipped">จัดส่งแล้ว</option><option value="cancelled">ยกเลิก</option></select></label></footer>
      </article>;
    })}
    {!loading && visibleOrders.length === 0 && <div className="admin-empty">{orders.length ? 'ไม่พบคำสั่งซื้อที่ตรงกับตัวกรอง' : 'ยังไม่มีคำสั่งซื้อจากสมาชิก'}</div>}
  </section>;
}
