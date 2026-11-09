export const formatPrice = (value) => `฿${Number(value || 0).toLocaleString('th-TH', { maximumFractionDigits: 2 })}`;
export const formatDate = (value) => new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
export const statusLabels = { pending: 'รอดำเนินการ', paid: 'ชำระแล้ว', shipped: 'จัดส่งแล้ว', cancelled: 'ยกเลิก' };
