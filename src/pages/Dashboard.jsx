import { useEffect, useState } from 'react';
import { Users, CalendarCheck, BookOpen, Bell, Award, Briefcase, ClipboardList, Wifi, Calendar, Loader, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

const catColor = { Technical: '#3D3BF3', Cultural: '#EC4899', Placement: '#22C55E', Sports: '#F59E0B', Alumni: '#8B5CF6', General: '#6B7280' };
const catBg   = { Technical: '#EEF0FF', Cultural: '#FDF2F8', Placement: '#F0FDF4', Sports: '#FFFBEB', Alumni: '#F5F3FF', General: '#F9FAFB' };

export default function Dashboard() {
  const isMobile = useIsMobile();
  const [stats, setStats]     = useState({});
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dashRes, eventsRes] = await Promise.all([
        api.get('/admin/dashboard').catch(() => ({ data: {} })),
        api.get('/admin/events').catch(() => ({ data: { events: [] } })),
      ]);
      const d = dashRes.data?.data || dashRes.data || {};
      setStats(d);
      const all = eventsRes.data?.events || [];
      const upcoming = all
        .filter(e => e.event_date && new Date(e.event_date) >= new Date())
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
        .slice(0, 5);
      setEvents(upcoming);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const s = stats;

  const cards = [
    { label: 'Total Students',  value: s.total_students  ?? 0, icon: Users,        color: '#3D3BF3', bg: '#EEF0FF' },
    { label: 'Active Courses',  value: s.active_courses  ?? 0, icon: BookOpen,      color: '#22C55E', bg: '#F0FDF4' },
    { label: 'Pending Leaves',  value: s.pending_leaves  ?? 0, icon: ClipboardList, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Upcoming Exams',  value: s.upcoming_exams  ?? 0, icon: CalendarCheck, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  const quickStats = [
    { label: 'Placement Drives', value: s.total_placements    ?? 0, Icon: Briefcase, color: '#22C55E', bg: '#F0FDF4' },
    { label: 'Scholarships',     value: s.total_scholarships  ?? 0, Icon: Award,     color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Events',           value: s.total_events        ?? 0, Icon: Calendar,  color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Notifications',    value: s.unread_notifications ?? 0, Icon: Bell,     color: '#EF4444', bg: '#FEF2F2' },
  ];

  const summaryRows = [
    { label: 'Students Enrolled',      value: s.total_students  ?? 0, color: '#3D3BF3', bg: '#EEF0FF', Icon: Users },
    { label: 'Pending Leave Requests', value: s.pending_leaves  ?? 0, color: '#F59E0B', bg: '#FFFBEB', Icon: ClipboardList },
    { label: 'Upcoming Exams',         value: s.upcoming_exams  ?? 0, color: '#8B5CF6', bg: '#F5F3FF', Icon: CalendarCheck },
    { label: 'Active Courses',         value: s.active_courses  ?? 0, color: '#22C55E', bg: '#F0FDF4', Icon: BookOpen },
  ];

  const pad = isMobile ? '16px' : '24px';

  return (
    <div style={{ padding: pad, minHeight: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px' }}>{today}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={fetchAll} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          {!isMobile && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wifi size={13} /> System Online
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Cards — 2 col on mobile, 4 on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '14px', marginBottom: isMobile ? '12px' : '20px' }}>
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '16px', padding: isMobile ? '14px' : '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>
              {loading ? '—' : (typeof value === 'number' ? value.toLocaleString() : value)}
            </div>
            <div style={{ fontSize: isMobile ? '11px' : '13px', color: '#374151', marginTop: '3px', fontWeight: '500' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Stats — 2 col on mobile, 4 on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '14px', marginBottom: isMobile ? '12px' : '20px' }}>
        {quickStats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '14px', padding: isMobile ? '12px' : '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <div style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '800', color }}>
                {loading ? '—' : (typeof value === 'number' ? value.toLocaleString() : value)}
              </div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row — stack on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '14px' }}>

        {/* Upcoming Events */}
        <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 12px' }}>Upcoming Events</h3>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
              <Loader size={22} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: '#9CA3AF' }}>
              <Calendar size={28} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '13px', fontWeight: '600' }}>No upcoming events</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>Events created in admin will appear here</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {events.map((ev) => {
                const id = ev.event_id || ev.id;
                const color = catColor[ev.category] || '#6B7280';
                const bg    = catBg[ev.category]   || '#F9FAFB';
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: bg, border: `1px solid ${color}22` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.event_title || ev.title}</div>
                      <div style={{ fontSize: '11px', color, fontWeight: '600', marginTop: '2px' }}>{ev.event_date}{ev.venue ? ` · ${ev.venue}` : ''}</div>
                    </div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* System Summary */}
        <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 12px' }}>System Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {summaryRows.map(({ label, value, color, bg, Icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: bg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={14} color={color} />
                  <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#374151', fontWeight: '500' }}>{label}</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '800', color }}>
                  {loading ? '—' : (typeof value === 'number' ? value.toLocaleString() : value)}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: '#F9FAFB', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wifi size={13} color="#22C55E" />
            <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>Connected to backend · 13.53.193.80</span>
          </div>
        </div>
      </div>
    </div>
  );
}
