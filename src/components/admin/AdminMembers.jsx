import { Search } from 'lucide-react';
import { formatPrice } from './formatters';

export default function AdminMembers({ loading, members, visibleMembers, memberOrderStats, memberQuery, setMemberQuery, memberRoleFilter, setMemberRoleFilter, changingMemberId, currentUserId, onChangeRole, onViewOrders }) {
  return <section className="admin-section" aria-labelledby="admin-members-title">
    <div className="admin-section-heading"><div><span className="section-index">03</span><div><h2 id="admin-members-title">สมาชิก</h2><p>ค้นหาบัญชี ดูบทบาท และตรวจยอดคำสั่งซื้อของสมาชิก</p></div></div><span className="orders-count">{loading ? 'กำลังโหลด' : `${visibleMembers.length} จาก ${members.length} คน`}</span></div>
    <div className="admin-order-filters"><label className="admin-search"><Search size={16}/><input value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} placeholder="ค้นหาชื่อ อีเมล หรือรหัสสมาชิก" aria-label="ค้นหาสมาชิก"/></label><label className="status-filter">บทบาท<select value={memberRoleFilter} onChange={(event) => setMemberRoleFilter(event.target.value)}><option value="all">ทุกบทบาท</option><option value="member">สมาชิก</option><option value="admin">ผู้ดูแลระบบ</option></select></label></div>
    <div className="admin-book-table-wrap"><table className="admin-book-table admin-member-table"><thead><tr><th>สมาชิก</th><th>อีเมล</th><th>บทบาท / เปลี่ยนสิทธิ์</th><th>คำสั่งซื้อ</th><th>ยอดซื้อรวม</th><th>รายละเอียด</th></tr></thead><tbody>
      {!loading && visibleMembers.map((member) => {
        const stats = memberOrderStats.get(String(member.id)) || { count: 0, total: 0 };
        return <tr key={member.id}><td><div className="member-name-cell"><span className="member-avatar">{(member.name || '?').slice(0, 1).toUpperCase()}</span><div><strong>{member.name}</strong><small>รหัสสมาชิก #{member.id}</small></div></div></td><td>{member.email}</td><td><select className="member-role-select" aria-label={`เปลี่ยนบทบาท ${member.name}`} value={member.role} disabled={changingMemberId === member.id || Number(member.id) === Number(currentUserId)} onChange={(event) => onChangeRole(member, event.target.value)}><option value="member">สมาชิก</option><option value="admin">ผู้ดูแลระบบ</option></select>{Number(member.id) === Number(currentUserId) && <small className="member-self-note">บัญชีที่ใช้อยู่</small>}</td><td>{stats.count} รายการ</td><td>{formatPrice(stats.total)}</td><td><button className="secondary-button member-orders-button" onClick={() => onViewOrders(member)}>ดูคำสั่งซื้อ</button></td></tr>;
      })}
    </tbody></table></div>
    {!loading && visibleMembers.length === 0 && <div className="admin-empty">{members.length ? 'ไม่พบสมาชิกที่ตรงกับคำค้นหาหรือตัวกรอง' : 'ยังไม่มีบัญชีสมาชิก'}</div>}
  </section>;
}
