import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, X, Loader, Globe, EyeOff, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

const categoryColors = {
  Technical: '#3D3BF3', Cultural: '#EC4899', Placement: '#22C55E',
  Sports: '#F59E0B', Alumni: '#8B5CF6', General: '#6B7280',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ event_title: '', description: '', event_date: '', venue: '', category: 'Technical', department: 'All', capacity: '' });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/events');
      setEvents(res.data.events || []);
    } catch {
      setEvents([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const categories = ['all', ...new Set(events.map(e => e.category).filter(Boolean))];

  const filtered = events.filter(e => filter === 'all' || e.category === filter);

  const handleAdd = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/events/create', {
        event_title: form.event_title,
        category: form.category,
        department: form.department,
        event_date: form.event_date,
        venue: form.venue,
        description: form.description,
      });
      await fetchEvents();
      setShowForm(false);
      setForm({ event_title: '', description: '', event_date: '', venue: '', category: 'Technical', department: 'All', capacity: '' });
    } catch (err) {
      console.error('Failed to create event:', err);
    } finally { setSaving(false); }
  };

  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.published).length;
  const thisMonth = events.filter(e => {
    try { return new Date(e.event_date).getMonth() === new Date().getMonth(); } catch { return false; }
  }).length;

  return (
    <div style={{ padding: isMobile ? '16px' : '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Events</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Manage college events and announcements</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={fetchEvents} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Events',   value: totalEvents,     color: '#3D3BF3', bg: '#EEF0FF' },
          { label: 'Published',      value: publishedEvents,  color: '#22C55E', bg: '#F0FDF4' },
          { label: 'This Month',     value: thisMonth,        color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Categories',     value: categories.length - 1, color: '#8B5CF6', bg: '#F5F3FF' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Calendar size={22} color={color} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: filter === c ? (categoryColors[c] || '#3D3BF3') : '#F3F4F6', color: filter === c ? '#fff' : '#6B7280' }}>
            {c === 'all' ? 'All Events' : c}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
          <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Loading events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
          <Calendar size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '600' }}>No events yet</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Create an event — students will see it in their app</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {filtered.map((e) => {
            const color = categoryColors[e.category] || '#3D3BF3';
            const id = e.event_id || e.id;
            return (
              <div key={id} style={{ background: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <div style={{ height: '5px', background: color }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>{e.event_title || e.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {e.category && <span style={{ fontSize: '11px', fontWeight: '700', color, background: color + '18', padding: '3px 8px', borderRadius: '6px' }}>{e.category}</span>}
                        <span style={{ fontSize: '11px', color: e.published ? '#16A34A' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          {e.published ? <Globe size={11} /> : <EyeOff size={11} />}
                          {e.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {e.event_date && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {e.event_date}</span>}
                    {e.venue && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {e.venue}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '520px', padding: isMobile ? '16px' : '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Create Event</h3>
              <button onClick={() => setShowForm(false)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Event Title', key: 'event_title', placeholder: 'e.g. Annual Tech Fest 2026' },
                { label: 'Date',        key: 'event_date',  type: 'date' },
                { label: 'Venue',       key: 'venue',       placeholder: 'e.g. Main Auditorium' },
              ].map(({ label, key, type = 'text', placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea placeholder="Event description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    {['Technical', 'Cultural', 'Sports', 'Placement', 'Alumni', 'General'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Department</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    {['All', 'CS', 'IT', 'ECE', 'MECH', 'CIVIL'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving}
                style={{ width: '100%', padding: '12px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                {saving ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
