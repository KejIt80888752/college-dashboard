import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader, Mail, Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  fontSize: '15px',
  borderRadius: '12px',
  border: '2px solid #E5E7EB',
  background: '#F9FAFB',
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  WebkitAppearance: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

const OTP_EXPIRY = 120; // seconds

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | register | otp | setpass
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const [resending, setResending] = useState(false);
  const timerRef = useRef(null);
  const otpRefs = useRef([]);

  // OTP countdown timer
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer]);

  const startTimer = () => setTimer(OTP_EXPIRY);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/admin/send-otp', { email });
      setMode('otp');
      setSuccess(`OTP sent to ${email}`);
      setOtp(['', '', '', '', '', '']);
      startTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Check your email.');
    } finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    setResending(true); setError(''); setSuccess('');
    try {
      await api.post('/admin/send-otp', { email });
      setSuccess(`OTP resent to ${email}`);
      setOtp(['', '', '', '', '', '']);
      startTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally { setResending(false); }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    if (timer === 0) { setError('OTP expired. Please resend.'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/admin/verify-otp', { email, otp: otpStr });
      setMode('setpass');
      setSuccess('OTP verified! Set your password below.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally { setLoading(false); }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/admin/set-password', { email, password, confirm_password: confirmPassword });
      setMode('login');
      setSuccess('Account created! Please login.');
      setPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password');
    } finally { setLoading(false); }
  };

  const goBack = () => {
    setMode(mode === 'otp' || mode === 'setpass' ? 'register' : 'login');
    setError(''); setSuccess('');
    clearTimeout(timerRef.current);
  };

  const formatTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F5FF' }}>

      {/* LEFT — Brand Panel */}
      <div style={{
        width: '50%',
        background: 'linear-gradient(145deg, #3D3BF3 0%, #2320b8 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ marginBottom: '24px' }}>
            <img src="/raise-logo.png" alt="RAISE" style={{ height: '48px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>RAISE College CRM</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', maxWidth: '300px', lineHeight: '1.6', marginBottom: '48px' }}>
            Manage your institution efficiently with our comprehensive admin portal
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%', maxWidth: '300px' }}>
            {[
              { label: 'Students', value: '1,247' },
              { label: 'Courses', value: '24' },
              { label: 'Placement Rate', value: '72%' },
              { label: 'Events/Year', value: '50+' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '18px 14px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '40px',
          boxShadow: '0 8px 40px rgba(61,59,243,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        }}>
          {/* Back button */}
          {mode !== 'login' && (
            <button onClick={goBack}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '13px', fontWeight: '600', marginBottom: '20px', padding: '0' }}>
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
              {mode === 'login' ? 'Welcome back 👋'
                : mode === 'register' ? 'Create Account'
                : mode === 'otp' ? 'Verify Your Email'
                : 'Set Your Password'}
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              {mode === 'login' ? 'Sign in to your admin account'
                : mode === 'register' ? 'Enter your email to get an OTP'
                : mode === 'otp' ? `We sent a 6-digit code to ${email}`
                : 'Create a strong password for your account'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '18px' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '18px' }}>
              {success}
            </div>
          )}

          {/* LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input type="email" required autoComplete="off"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@college.edu" style={{ ...inputStyle, paddingLeft: '44px' }}
                    onFocus={e => e.target.style.borderColor = '#3D3BF3'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required autoComplete="off"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '48px' }}
                    onFocus={e => e.target.style.borderColor = '#3D3BF3'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
                New admin?{' '}
                <button type="button" onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                  style={{ color: '#3D3BF3', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                  Register here
                </button>
              </p>
            </form>
          )}

          {/* REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input type="email" required autoComplete="off"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@college.edu"
                    style={{ ...inputStyle, paddingLeft: '44px' }}
                    onFocus={e => e.target.style.borderColor = '#3D3BF3'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>Send OTP <Mail size={16} /></>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
                Already have account?{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  style={{ color: '#3D3BF3', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                  Login
                </button>
              </p>
            </form>
          )}

          {/* OTP */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              {/* 6-box OTP Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ ...labelStyle, textAlign: 'center', display: 'block', marginBottom: '14px' }}>
                  Enter 6-digit OTP
                </label>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }} onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '46px', height: '52px',
                        textAlign: 'center',
                        fontSize: '22px', fontWeight: '700',
                        borderRadius: '12px',
                        border: `2px solid ${digit ? '#3D3BF3' : '#E5E7EB'}`,
                        background: digit ? '#EEF0FF' : '#F9FAFB',
                        color: '#111827',
                        outline: 'none',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#3D3BF3'}
                      onBlur={e => e.target.style.borderColor = otp[idx] ? '#3D3BF3' : '#E5E7EB'}
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {timer > 0 ? (
                  <span style={{ fontSize: '13px', color: timer < 30 ? '#EF4444' : '#6B7280' }}>
                    OTP expires in <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTimer(timer)}</strong>
                  </span>
                ) : (
                  <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: '600' }}>OTP expired</span>
                )}
              </div>

              <button type="submit" disabled={loading || otp.join('').length !== 6}
                style={{ width: '100%', padding: '13px', background: otp.join('').length === 6 ? '#3D3BF3' : '#E5E7EB', color: otp.join('').length === 6 ? '#fff' : '#9CA3AF', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: otp.join('').length === 6 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
                {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Verify OTP'}
              </button>

              <button type="button" onClick={handleResendOtp} disabled={resending || timer > 0}
                style={{ width: '100%', padding: '10px', background: 'none', color: timer > 0 ? '#D1D5DB' : '#3D3BF3', border: `1.5px solid ${timer > 0 ? '#E5E7EB' : '#3D3BF3'}`, borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: timer > 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {resending ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={14} />}
                {timer > 0 ? `Resend in ${formatTimer(timer)}` : 'Resend OTP'}
              </button>
            </form>
          )}

          {/* SET PASSWORD */}
          {mode === 'setpass' && (
            <form onSubmit={handleSetPassword}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '48px' }}
                    onFocus={e => e.target.style.borderColor = '#3D3BF3'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: password.length > i * 3 ? (password.length < 8 ? '#F59E0B' : '#22C55E') : '#E5E7EB' }} />
                    ))}
                    <span style={{ fontSize: '11px', color: password.length < 8 ? '#F59E0B' : '#22C55E', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      {password.length < 6 ? 'Weak' : password.length < 8 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirmPass ? 'text' : 'password'} required
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '48px', borderColor: confirmPassword && confirmPassword !== password ? '#EF4444' : undefined }}
                    onFocus={e => e.target.style.borderColor = '#3D3BF3'}
                    onBlur={e => e.target.style.borderColor = confirmPassword && confirmPassword !== password ? '#EF4444' : '#E5E7EB'} />
                  <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '5px' }}>Passwords do not match</div>
                )}
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
