import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader, Mail, Lock } from 'lucide-react';
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

export default function Login() {
  const isMobile = useIsMobile();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row', background: '#F5F5FF' }}>

      {/* LEFT — Brand Panel (desktop only) */}
      <div style={{
        width: '50%', display: isMobile ? 'none' : 'flex',
        background: 'linear-gradient(145deg, #3D3BF3 0%, #2320b8 100%)',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ marginBottom: '24px' }}>
            <img src="/raise-logo.png" alt="RAISE" style={{ height: '48px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>RAISE College CRM</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', maxWidth: '300px', lineHeight: '1.6', marginBottom: '48px' }}>
            Manage your institution efficiently with our comprehensive admin portal
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%', maxWidth: '300px' }}>
            {[{ label: 'Students', value: '1,247' }, { label: 'Courses', value: '24' }, { label: 'Placement Rate', value: '72%' }, { label: 'Events/Year', value: '50+' }].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '18px 14px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 16px' : '40px' }}>
        {isMobile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '110px', background: 'linear-gradient(145deg, #3D3BF3 0%, #2320b8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
            <img src="/raise-logo.png" alt="RAISE" style={{ height: '34px', filter: 'brightness(0) invert(1)' }} />
          </div>
        )}
        <div style={{
          width: '100%', maxWidth: '420px', background: '#FFFFFF',
          borderRadius: isMobile ? '24px' : '28px',
          padding: isMobile ? '28px 20px' : '40px',
          boxShadow: '0 8px 40px rgba(61,59,243,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          marginTop: isMobile ? '80px' : '0', position: 'relative', zIndex: 1,
        }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
              Welcome back 👋
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              Sign in to your admin account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '18px' }}>
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
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
            <div style={{ marginBottom: '28px' }}>
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
              style={{ width: '100%', padding: '13px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>

          {/* Footer note */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#D1D5DB', marginTop: '24px' }}>
            RAISE College Management System · Authorized Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
