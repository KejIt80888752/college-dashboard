import { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Users, TrendingUp, Plus, X, Loader, Calendar, Target, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ company_name: '', job_role: '', package: '', eligibility: 'All', interview_date: '' });

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/placements');
      setPlacements(res.data.placements || []);
    } catch {
      setPlacements([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPlacements(); }, []);

  const handleAdd = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/placements/create', form);
      await fetchPlacements();
      setShowForm(false);
      setForm({ company_name: '', job_role: '', package: '', eligibility: 'All', interview_date: '' });
    } catch (err) {
      console.error('Failed to create placement:', err);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Placements</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Campus placement drives — visible to students in app</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={fetchPlacements} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            <Plus size={18} /> Add Drive
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Drives',   value: placements.length, color: '#3D3BF3', bg: '#EEF0FF', Icon: Briefcase },
          { label: 'Active Drives',  value: placements.length, color: '#22C55E', bg: '#F0FDF4', Icon: TrendingUp },
          { label: 'Companies',      value: new Set(placements.map(p => p.company)).size, color: '#F59E0B', bg: '#FFFBEB', Icon: Target },
          { label: 'Opportunities',  value: placements.reduce((a, p) => a + (p.openings || 0), 0) || placements.length, color: '#8B5CF6', bg: '#F5F3FF', Icon: Users },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Placement List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
          <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Loading placement drives...</p>
        </div>
      ) : placements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
          <Briefcase size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '600' }}>No placement drives yet</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Add a drive — students will see it in the Career section of their app</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {placements.map((j) => {
            const id = j.id || j.placement_id;
            return (
              <div key={id} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px', color: '#3D3BF3', flexShrink: 0 }}>
                  {(j.company || j.company_name || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>{j.company || j.company_name}</span>
                    {j.role && <span style={{ fontSize: '13px', color: '#6B7280' }}>· {j.role}</span>}
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#16A34A', background: '#F0FDF4', padding: '2px 8px', borderRadius: '6px' }}>Active</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {j.package && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={12} /> {j.package}</span>}
                    {(j.eligibility) && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><Target size={12} /> {j.eligibility}</span>}
                    {j.interview_date && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {j.interview_date}</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151', background: '#F9FAFB', padding: '6px 14px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>Full-time</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Drive Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: isMobile ? '16px' : '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Add Placement Drive</h3>
              <button onClick={() => setShowForm(false)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Company Name', key: 'company_name', placeholder: 'e.g. Google' },
                { label: 'Job Role',     key: 'job_role',     placeholder: 'e.g. Software Engineer' },
                { label: 'Package (LPA)', key: 'package',     placeholder: 'e.g. 12 LPA' },
                { label: 'Eligible Depts', key: 'eligibility', placeholder: 'e.g. CS, IT or All' },
                { label: 'Interview Date', key: 'interview_date', type: 'date' },
              ].map(({ label, key, type = 'text', placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <button type="submit" disabled={saving}
                style={{ width: '100%', padding: '12px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                {saving ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Adding...</> : 'Add Drive'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
