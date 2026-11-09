import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ loading, error, notice, onRefresh, children }) {
  return <main className="page-wrap admin-page">
    <section className="dashboard-panel admin-panel">
      <div className="admin-page-heading"><div><div className="modal-kicker">BOOKMART ADMIN · ภาพรวมร้าน</div><h1>จัดการร้าน</h1><p>ดูแลหนังสือ สต็อก และติดตามคำสั่งซื้อจากหน้านี้</p></div><button className="secondary-button admin-refresh" onClick={onRefresh} disabled={loading}><RefreshCw size={15}/> โหลดข้อมูลใหม่</button></div>
      {error && <div className="form-error admin-alert" role="alert"><AlertTriangle size={17}/><span>{error}</span><button className="secondary-button" onClick={onRefresh}>ลองอีกครั้ง</button></div>}
      {notice && <p className="success-message admin-notice" role="status">{notice}</p>}
      {loading && <p className="admin-loading" role="status">กำลังโหลดข้อมูลร้าน...</p>}
      {children}
    </section>
  </main>;
}
