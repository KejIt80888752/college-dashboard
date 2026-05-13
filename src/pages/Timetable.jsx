import { useState, useEffect } from 'react';
import { Clock, BookOpen, Plus, X, Loader, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const COLORS = ['#3D3BF3','#22C55E','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#10B981','#F97316','#8B5CF6'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getColor(subject, map) {
  if (!map[subject]) {
    const idx = Object.keys(map).length % COLORS.length;
    map[subject] = COLORS[idx];
  }
  return map[subject];
}

export default function Timetable() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('CS');
  const [selectedSem, setSelectedSem] = useState('5');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ department: 'CS', semester: '5', subject: '', faculty: '', room: '', day: 'Monday', start_time: '09:00', end_time: '10:00' });
  const colorMap = {};

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/timetable?department=${selectedDept}&semester=${selectedSem}`);
      setSchedule(res.data.schedule || []);
    } catch {
      setSchedule([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTimetable(); }, [selectedDept, selectedSem]);

  // Build grid: day → time_slot → entry
  const grid = {};
  const timeSlots = [];
  const slotSet = new Set();

  schedule.forEach(entry => {
    const day = entry.day;
    const slot = `${entry.start_time}–${entry.end_time}`;
    if (!grid[day]) grid[day] = {};
    grid[day][slot] = entry;
    slotSet.add(slot);
  });

  // Sort time slots
  [...slotSet].sort().forEach(s => timeSlots.push(s));

  const handleAdd = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/timetable/create', form);
      await fetchTimetable();
      setShowForm(false);
    } catch (err) {
      console.error('Failed:', err);
    } finally { setSaving(false); }
  };

  // Unique subjects
  const subjects = [...new Set(schedule.map(e => e.subject).filter(Boolean))];

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Timetable</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Weekly class schedule — published to student app</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={fetchTimetable} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', fontWeight: '600', color: '#374151', background: '#FFFFFF', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {['CS', 'IT', 'ECE', 'MECH', 'CIVIL'].map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', fontWeight: '600', color: '#374151', background: '#FFFFFF', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            <Plus size={16} /> Add Entry
          </button>
        </div>
      </div>

      {/* Legend */}
      {subjects.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {subjects.map(subject => {
            const color = getColor(subject, colorMap);
            return (
              <div key={subject} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{subject}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Timetable Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
          <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Loading timetable...</p>
        </div>
      ) : timeSlots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
          <Clock size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '600' }}>No timetable entries for {selectedDept} Sem {selectedSem}</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Click "Add Entry" to create a timetable — students will see it in their app</div>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#9CA3AF', width: '120px', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Time</div>
                </th>
                {days.map(d => (
                  <th key={d} style={{ padding: '14px 12px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#374151', borderBottom: '1px solid #F3F4F6', borderLeft: '1px solid #F3F4F6' }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 16px', background: '#FAFAFA', borderRight: '1px solid #F3F4F6' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>{slot}</div>
                  </td>
                  {days.map(day => {
                    const entry = grid[day]?.[slot];
                    const color = entry?.subject ? getColor(entry.subject, colorMap) : null;
                    return (
                      <td key={day} style={{ padding: '8px', textAlign: 'center', borderLeft: '1px solid #F3F4F6', verticalAlign: 'middle' }}>
                        {entry ? (
                          <div style={{ background: color + '18', border: `1.5px solid ${color}30`, borderRadius: '10px', padding: '8px 6px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color, lineHeight: 1.3 }}>{entry.subject}</div>
                            {entry.room && <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{entry.room}</div>}
                          </div>
                        ) : (
                          <div style={{ color: '#E5E7EB', fontSize: '18px' }}>—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Subject Summary */}
      {subjects.length > 0 && (
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {subjects.map(subject => {
            const color = getColor(subject, colorMap);
            const count = schedule.filter(e => e.subject === subject).length;
            return (
              <div key={subject} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px 16px', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={16} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>{subject}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{count} period{count !== 1 ? 's' : ''}/week</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Entry Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Add Timetable Entry</h3>
              <button onClick={() => setShowForm(false)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Subject',   key: 'subject', placeholder: 'e.g. Data Structures' },
                { label: 'Faculty',   key: 'faculty',  placeholder: 'e.g. Dr. Rajan' },
                { label: 'Room',      key: 'room',     placeholder: 'e.g. Room 101' },
                { label: 'Start Time', key: 'start_time', type: 'time' },
                { label: 'End Time',   key: 'end_time',   type: 'time' },
              ].map(({ label, key, type = 'text', placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Day</label>
                  <select value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '13px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Dept</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '13px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    {['CS', 'IT', 'ECE', 'MECH', 'CIVIL'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Semester</label>
                  <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '13px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving}
                style={{ width: '100%', padding: '12px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                {saving ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Adding...</> : 'Add Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
