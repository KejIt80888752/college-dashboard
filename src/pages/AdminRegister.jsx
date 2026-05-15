import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader, Mail, Lock, KeyRound } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

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

export default function AdminRegister() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState(searchParams.get('key') || '');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!adminKey.trim()) { setError('Admin key is required'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/admin/register', {
        email,
        password,
        confirm_password: confirmPassword,
        admin_key: adminKey,
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your admin key.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5FF', padding: isMobile ? '24px 16px' : '40px' }}>

      {isMobile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '90px', background: 'linear-gradient(145deg, #3D3BF3 0%, #2320b8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
          <img src="/raise-logo.png" alt="RAISE" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
        </div>
      )}

      <div style={{
        width: '100%', maxWidth: '440px', background: '#FFFFFF',
        borderRadius: isMobile ? '24px' : '28px',
        padding: isMobile ? '28px 20px' : '40px',
        boxShadow: '0 8px 40px rgba(61,59,243,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        marginTop: isMobile ? '70px' : '0', position: 'relative', zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ marginBottom: '8px', textAlign: 'center' }}>
          {!isMobile && (
            <img src="/raise-logo.png" alt="RAISE" style={{ height: '36px', objectFit: 'contain', marginBottom: '16px' }} onError={e => { e.target.style.display = 'none'; }} />
          )}
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
            Create Admin Account
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>
            Authorized personnel only — Admin key required
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

        <form onSubmit={handleRegister}>
          {/* Admin Key */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Admin Key</label>
            <div style={{ position: 'relative' }}>
              <input type={showKey ? 'text' : 'password'} required
                value={adminKey} onChange={e => setAdminKey(e.target.value)}
                placeholder="Enter admin secret key"
                style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '48px' }}
                onFocus={e => e.target.style.borderColor = '#3D3BF3'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              <KeyRound size={16} color="#9CA3AF" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
              <button type="button" onClick={() => setShowKey(!showKey)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
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

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
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
            style={{ width: '100%', padding: '13px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create Admin Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/')}
              style={{ color: '#3D3BF3', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
