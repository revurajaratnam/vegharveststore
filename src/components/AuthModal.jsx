import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '../store/api/ecommerceApi';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    token: '',
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setStatusMsg('');

    try {
      if (mode === 'login') {
        const response = await login({
          email: form.email,
          password: form.password,
        }).unwrap();
        dispatch(setCredentials(response));
        setStatusMsg('Login successful!');
        setTimeout(() => {
          onAuthSuccess(response.user);
          onClose();
        }, 800);
      } else if (mode === 'register') {
        const response = await register(form).unwrap();
        dispatch(setCredentials(response));
        setStatusMsg('Account created!');
        setTimeout(() => {
          onAuthSuccess(response.user);
          onClose();
        }, 800);
      } else if (mode === 'forgot') {
        const response = await forgotPassword(form.email).unwrap();
        setForm((current) => ({ ...current, token: response.resetToken || '' }));
        setStatusMsg(response.resetToken
          ? `Reset token generated: ${response.resetToken}`
          : 'Password reset instructions sent.');
        if (response.resetToken) setMode('reset');
      } else if (mode === 'reset') {
        const response = await resetPassword({
          token: form.token,
          password: form.password,
        }).unwrap();
        setStatusMsg(response.message || 'Password reset successfully.');
        setMode('login');
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-slate-400 hover:text-slate-700"
          aria-label="Close authentication"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-1 text-xl font-bold text-slate-900">
          {mode === 'login' && 'Sign In'}
          {mode === 'register' && 'Create Account'}
          {mode === 'forgot' && 'Forgot Password'}
          {mode === 'reset' && 'Set New Password'}
        </h2>

        {statusMsg && (
          <div className="mb-4 mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {statusMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {mode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm"
                />
              </div>
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="user">Customer Account</option>
                <option value="admin">Store Manager</option>
              </select>
            </>
          )}

          {mode !== 'reset' && (
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm"
              />
            </div>
          )}

          {mode === 'reset' && (
            <input
              type="text"
              placeholder="Reset Token"
              required
              value={form.token}
              onChange={(event) => setForm({ ...form, token: event.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm"
            />
          )}

          {mode !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder={mode === 'reset' ? 'New Password' : 'Password'}
                required
                minLength={6}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn || isRegistering}
            className="w-full cursor-pointer rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Sign Up'}
            {mode === 'forgot' && 'Send Reset Token'}
            {mode === 'reset' && 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          {mode === 'login' ? (
            <>
              <button type="button" onClick={() => setMode('forgot')} className="cursor-pointer hover:text-emerald-600">
                Forgot password?
              </button>
              <button type="button" onClick={() => setMode('register')} className="cursor-pointer font-semibold text-emerald-600">
                Create an account
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setMode('login')} className="cursor-pointer font-semibold text-emerald-600">
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
