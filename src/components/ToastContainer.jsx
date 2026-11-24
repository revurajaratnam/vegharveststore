import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { selectToasts, removeToast } from '../store/slices/toastSlice';

const STYLES = {
  success: {
    box: 'bg-emerald-600 text-white',
    icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
  },
  error: {
    box: 'bg-rose-600 text-white',
    icon: <AlertCircle className="w-4 h-4 shrink-0" />,
  },
  info: {
    box: 'bg-slate-800 text-white',
    icon: <Info className="w-4 h-4 shrink-0" />,
  },
};

function ToastItem({ toast }) {
  const dispatch = useDispatch();
  const style = STYLES[toast.type] || STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 3500);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-64 max-w-sm transition-all ${style.box}`}
    >
      {style.icon}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="opacity-80 hover:opacity-100 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector(selectToasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}