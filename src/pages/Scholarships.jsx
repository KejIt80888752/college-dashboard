import { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, Clock, DollarSign, Loader, Plus, X, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const statusConfig = {
  pending:  { color: '#D97706', bg: '#FFFBEB', label: 'Pending',  icon: Clock },
  approved: { color: '#16A34A', bg: '#F0FDF4', label: 'Approved', icon: CheckCircle },
  rejected: { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected', icon: XCircle },
  Pending:  { color: '#D97706', bg: '#FFFBEB', label: 'Pending',  icon: Clock },
  Approved: { color: '#16A34A', bg: '#F0FDF4', label: 'Approved', icon: CheckCircle },
  Rejected: { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected', icon: XCircle },
};

export default function Scholarships() {
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('schemes');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [form, setForm] = useState({ scholarship_name: '', eligibility: '', amount: '', deadline: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/scholarships');
      setSchemes(res.data.scholarships || []);
    } catch {
      setSchemes([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/scholarships/create', { ...form, amount: Number(form.amount) });
      await fetchData();
      setShowForm(false);
      setForm({ scholarship_name: '', eligibility: '', amount: '', deadline: '' });
    } catch (err) {
      console.error('Failed:', err);
    } finally { setSaving(false); }
  };

  const handleAction = async (appId, action) => {
    setActionLoading(appId + action);
    try {
      await api.put('/admin/scholarships/action', { application_id: appId, action });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: action } : a));
    } catch (err) {
      console.error('Action failed:', err);
    } finally { setActionLoading(null); }
  };

  const totalAmount = schemes.reduce((s, sc) => s + (sc.amount || 0), 0);

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Scholarships</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Manage scholarship schemes — visible to students in app</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={fetchData} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          {tab === 'schemes' && (
            <button onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
              <Plus size={18} /> Add Scheme
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Schemes', value: schemes.length, color: '#3D3BF3', bg: '#EEF0FF', Icon: Award },
          { label: 'Active Schemes', value: schemes.length, color: '#22C55E', bg: '#F0FDF4', Icon: CheckCircle },
          { label: 'Applications', value: applications.length, color: '#D97706', bg: '#FFFBEB', Icon: Clock },
          { label: 'Total Amount', value: totalAmount > 0 ? `₹${(totalAmount/1000).toFixed(0)}K` : '—', color: '#22C55E', bg: '#F0FDF4', Icon: DollarSign },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {['schemes', 'applications'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: tab === t ? '#3D3BF3' : '#F3F4F6', color: tab === t ? '#fff' : '#6B7280', textTransform: 'capitalize' }}>
            {t === 'schemes' ? `Schemes (${schemes.length})` : `Applications (${applications.length})`}
          </button>
        ))}
      </div>

      {/* Schemes Tab */}
      {tab === 'schemes' && (
        loading ? (
          <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
            <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
            <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Loading scholarships...</p>
          </div>
        ) : schemes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
            <Award size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
            <div style={{ fontSize: '15px', fontWeight: '600' }}>No scholarship schemes yet</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Add a scheme — students can apply from their app</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {schemes.map((s) => (
              <div key={s.id} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={22} color="#3D3BF3" />
                  </div>
                  {s.amount > 0 && (
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#16A34A' }}>₹{s.amount.toLocaleString()}</span>
                  )}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>{s.name || s.scholarship_name}</div>
                {s.eligibility && <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px' }}>Eligibility: {s.eligibility}</div>}
                {s.deadline && <div style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>Deadline: {s.deadline}</div>}
              </div>
            ))}
          </div>
        )
      )}

      {/* Applications Tab */}
      {tab === 'applications' && (
        applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
            <Clock size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
            <div style={{ fontSize: '15px', fontWeight: '600' }}>No applications yet</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Student applications will appear here once they apply from the app</div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}>
                  {['Student', 'Scheme', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => {
                  const s = statusConfig[a.status] || statusConfig.pending;
                  const StatusIcon = s.icon;
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{a.student_name}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{a.department}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{a.scheme}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#16A34A' }}>₹{a.amount?.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: s.color, background: s.bg, padding: '4px 10px', borderRadius: '8px' }}>
                          <StatusIcon size={12} /> {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {['pending', 'Pending'].includes(a.status) && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleAction(a.id, 'Approved')} disabled={!!actionLoading}
                              style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#F0FDF4', color: '#16A34A', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              {actionLoading === a.id + 'Approved' ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={12} />} Approve
                            </button>
                            <button onClick={() => handleAction(a.id, 'Rejected')} disabled={!!actionLoading}
                              style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#FEF2F2', color: '#DC2626', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              {actionLoading === a.id + 'Rejected' ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={12} />} Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Add Scheme Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '440px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Add Scholarship Scheme</h3>
              <button onClick={() => setShowForm(false)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Scholarship Name', key: 'scholarship_name', placeholder: 'e.g. Merit Scholarship' },
                { label: 'Eligibility',      key: 'eligibility',      placeholder: 'e.g. CGPA ≥ 9.0' },
                { label: 'Amount (₹)',        key: 'amount',           type: 'number', placeholder: '25000' },
                { label: 'Deadline',          key: 'deadline',         type: 'date' },
              ].map(({ label, key, type = 'text', placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <button type="submit" disabled={saving}
                style={{ width: '100%', padding: '12px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                {saving ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : 'Create Scheme'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
