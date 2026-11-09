export default function AdminBookForm({ book, saving, onSubmit, onClose }) {
  const fields = [['title','ชื่อหนังสือ'],['author','ผู้เขียน'],['category','หมวดหมู่'],['price','ราคา (บาท)'],['stock','จำนวนคงเหลือ'],['cover_url','URL รูปปก']];
  return <form className="admin-edit-form" onSubmit={onSubmit}>
    <div className="admin-form-title"><div><div className="modal-kicker">BOOK DETAILS</div><h3>{book.id ? 'แก้ไขข้อมูลหนังสือ' : 'เพิ่มหนังสือใหม่'}</h3></div><button type="button" className="secondary-button" onClick={onClose}>ปิดฟอร์ม</button></div>
    <div className="admin-form-grid">{fields.map(([name,label]) => <label key={name}>{label}<input name={name} type={name === 'price' || name === 'stock' ? 'number' : name === 'cover_url' ? 'url' : 'text'} min={name === 'price' ? '0.01' : name === 'stock' ? '0' : undefined} step={name === 'price' ? '0.01' : name === 'stock' ? '1' : undefined} required defaultValue={book[name]}/></label>)}</div>
    <label className="admin-description-field">คำอธิบาย<textarea name="description" rows="3" defaultValue={book.description}/></label>
    <label className="featured-checkbox"><input name="featured" type="checkbox" defaultChecked={Boolean(book.featured)}/> แสดงเป็นหนังสือแนะนำ</label>
    <div className="form-actions"><button className="primary-button" disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึกหนังสือ'}</button><button type="button" className="secondary-button" onClick={onClose} disabled={saving}>ยกเลิก</button></div>
  </form>;
}
