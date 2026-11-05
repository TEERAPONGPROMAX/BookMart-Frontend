import { useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function Toast({ notice, onDismiss }) {
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(onDismiss, 3500);
    return () => window.clearTimeout(timer);
  }, [notice, onDismiss]);
  if (!notice) return null;
  return <div role={notice.error ? 'alert' : 'status'} className={notice.error ? 'toast toast-error' : 'toast'}>{notice.error ? <X size={17}/> : <Check size={17}/>} {notice.text}</div>;
}
