import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock, Loader, Calendar, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

const statusConfig = {
  Pending:  { color: '#D97706', bg: '#FFFBEB', label: 'Pending',  icon: Clock },
  Approved: { color: '#16A34A', bg: '#F0FDF4', label: 'Approved', icon: CheckCircle },
  Rejected: { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected', icon: XCircle },
  pending:  { color: '#D97706', bg: '#FFFBEB', label: 'Pending',  icon: Clock },
  approved: { color: '#16A34A', bg: '#F0FDF4', label: 'Approved', icon: CheckCircle },
  rejected: { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected', icon: XCircle },
};

const days = (from, to) => {
  try { const d = (new Date(to) - new Date(from)) / 86400000 + 1; return d === 1 ? '1 day' : `${d} days`; }
  catch { return ''; }
};

export default function Leaves() {
  const isMobile = useIsMobile();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/leaves/pending');
      setLeaves(res.data.leaves || []);
    } catch { setLeaves([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      await api.put('/admin/leaves/action', { leave_id: id, action: action === 'approve' ? 'Approved' : 'Rejected' });
      setLeaves(prev => prev.map(l => (l.leave_id === id || l.id === id) ? { ...l, status: action === 'approve' ? 'Approved' : 'Rejected' } : l));
    } catch (err) { console.error('Action failed:', err); }
    finally { setActionLoading(null); }
  };

  const pending  = leaves.filter(l => ['pending', 'Pending'].includes(l.status)).length;
  const approved = leaves.filter(l => ['approved', 'Approved'].includes(l.status)).length;
  const rejected = leaves.filter(l => ['rejected', 'Rejected'].includes(l.status)).length;
  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status?.toLowerCase() === filter);

  const pad = isMobile ? '16px' : '28px';

  return (
    <div style={{ padding: pad }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Leave Requests</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Manage student leave applications</p>
        </div>
        <button onClick={fetchLeaves} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {!isMobile && ' Refresh'}
        </button>
      </div>

      {/* Stats — 2 col mobile, 4 desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: leaves.length, color: '#3D3BF3', bg: '#EEF0FF', Icon: ClipboardList },
          { label: 'Pending',  value: pending,  color: '#D97706', bg: '#FFFBEB', Icon: Clock },
          { label: 'Approved', value: approved, color: '#16A34A', bg: '#F0FDF4', Icon: CheckCircle },
          { label: 'Rejected', value: rejected, color: '#DC2626', bg: '#FEF2F2', Icon: XCircle },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '16px', padding: isMobile ? '14px' : '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { key: 'all',      label: `All (${leaves.length})` },
          { key: 'pending',  label: `Pending (${pending})` },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', background: filter === key ? '#3D3BF3' : '#F3F4F6', color: filter === key ? '#fff' : '#6B7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
          <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Loading...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px', color: '#9CA3AF', background: '#FFFFFF', borderRadius: '20px' }}>
              <ClipboardList size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: '600' }}>No {filter !== 'all' ? filter : ''} leave requests</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Leave requests from the student app will appear here</div>
            </div>
          ) : filtered.map((l) => {
            const id = l.leave_id || l.id;
            const status = l.status || 'Pending';
            const s = statusConfig[status] || statusConfig.Pending;
            const StatusIcon = s.icon;
            const isPending = ['Pending', 'pending'].includes(status);
            return (
              <div key={id} style={{ background: '#FFFFFF', borderRadius: '16px', padding: isMobile ? '14px' : '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D3BF3', fontWeight: '800', fontSize: '16px', flexShrink: 0 }}>
                    {(l.student_name || 'S')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{l.student_name || `Student #${l.student_id}`}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: s.color, background: s.bg, padding: '4px 10px', borderRadius: '8px', flexShrink: 0 }}>
                        <StatusIcon size={11} /> {s.label}
                      </span>
                    </div>
                    {l.department && <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{l.department} · Sem {l.semester}</div>}
                    {l.reason && <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', fontStyle: 'italic' }}>"{l.reason}"</div>}
                    {l.from_date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px', color: '#9CA3AF' }}>
                        <Calendar size={11} /> {l.from_date} → {l.to_date} ({days(l.from_date, l.to_date)})
                      </div>
                    )}
                  </div>
                </div>
                {isPending && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                    <button onClick={() => handleAction(id, 'approve')} disabled={!!actionLoading}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', border: 'none', background: '#F0FDF4', color: '#16A34A', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      {actionLoading === id + 'approve' ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={13} />} Approve
                    </button>
                    <button onClick={() => handleAction(id, 'reject')} disabled={!!actionLoading}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', border: 'none', background: '#FEF2F2', color: '#DC2626', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      {actionLoading === id + 'reject' ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={13} />} Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
