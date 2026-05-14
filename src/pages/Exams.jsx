import { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle, Clock, FileText, Plus, X, Loader, Timer, PenLine, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

const deptColors = { CS: '#3D3BF3', IT: '#22C55E', ECE: '#F59E0B', MECH: '#EF4444', CIVIL: '#8B5CF6' };

export default function Exams() {
  const [exams, setExams] = useState([]);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', exam_name: '', department: 'CS', semester: '5', date: '', start_time: '09:00', end_time: '12:00', exam_type: 'Internal', total_marks: 100 });
  const [saving, setSaving] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/exams');
      setExams(res.data.exams || []);
    } catch {
      setExams([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchExams(); }, []);

  const upcoming  = exams.filter(e => e.status !== 'completed' && e.status !== 'Completed').length;
  const completed = exams.filter(e => e.status === 'completed' || e.status === 'Completed').length;

  const filtered = exams.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return !['completed', 'Completed'].includes(e.status);
    if (filter === 'completed') return ['completed', 'Completed'].includes(e.status);
    return e.department === filter;
  });

  const handleAdd = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/exams/create', {
        exam_name: form.exam_name || form.subject,
        subject: form.subject,
        exam_type: form.exam_type,
        department: form.department,
        semester: form.semester,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        total_marks: Number(form.total_marks),
      });
      await fetchExams();
      setShowForm(false);
      setForm({ subject: '', exam_name: '', department: 'CS', semester: '5', date: '', start_time: '09:00', end_time: '12:00', exam_type: 'Internal', total_marks: 100 });
    } catch (err) {
      console.error('Failed to create exam:', err);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Exams & Marks</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Schedule and manage examinations</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={fetchExams} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            <Plus size={18} /> Add Exam
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Exams',  value: exams.length,  color: '#3D3BF3', bg: '#EEF0FF', Icon: BookOpen },
          { label: 'Upcoming',     value: upcoming,       color: '#F59E0B', bg: '#FFFBEB', Icon: Clock },
          { label: 'Completed',    value: completed,      color: '#16A34A', bg: '#F0FDF4', Icon: CheckCircle },
          { label: 'Departments',  value: [...new Set(exams.map(e => e.department).filter(Boolean))].length, color: '#8B5CF6', bg: '#F5F3FF', Icon: FileText },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'upcoming', 'completed', 'CS', 'IT', 'ECE', 'MECH'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 14px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: filter === f ? '#3D3BF3' : '#F3F4F6', color: filter === f ? '#fff' : '#6B7280', textTransform: 'capitalize' }}>
            {f === 'all' ? 'All Exams' : f}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
          <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Loading exams...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
          <BookOpen size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '600' }}>No exams scheduled</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Click "Add Exam" to schedule an exam</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {filtered.map((e) => {
            const dept = e.department || '';
            const color = deptColors[dept] || '#3D3BF3';
            const isCompleted = ['completed', 'Completed'].includes(e.status);
            return (
              <div key={e.exam_id || e.id} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', borderLeft: `4px solid ${color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>{e.exam_name || e.subject || 'Exam'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {dept && <span style={{ fontSize: '12px', fontWeight: '600', color, background: color + '18', padding: '2px 8px', borderRadius: '6px' }}>{dept}</span>}
                      {e.semester && <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Sem {e.semester}</span>}
                      {e.exam_type && <span style={{ fontSize: '12px', color: '#9CA3AF' }}>· {e.exam_type}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isCompleted ? '#16A34A' : '#D97706', background: isCompleted ? '#F0FDF4' : '#FFFBEB', padding: '4px 10px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                    {e.status || 'Scheduled'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {e.date && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {e.date}</span>}
                  {e.start_time && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {e.start_time}</span>}
                  {e.total_marks && <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><PenLine size={12} /> Max: {e.total_marks}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Exam Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: isMobile ? '16px' : '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Schedule Exam</h3>
              <button onClick={() => setShowForm(false)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Exam Name', key: 'exam_name', type: 'text', placeholder: 'e.g. Internal Assessment 1' },
                { label: 'Subject',   key: 'subject',   type: 'text', placeholder: 'e.g. Data Structures' },
                { label: 'Date',      key: 'date',      type: 'date' },
                { label: 'Start Time', key: 'start_time', type: 'time' },
                { label: 'End Time',   key: 'end_time',   type: 'time' },
                { label: 'Total Marks', key: 'total_marks', type: 'number', placeholder: '100' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
                  <input type={type} required placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Department</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    {['CS', 'IT', 'ECE', 'MECH', 'CIVIL'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Semester</label>
                  <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Type</label>
                  <select value={form.exam_type} onChange={e => setForm(p => ({ ...p, exam_type: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', background: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }}>
                    <option>Internal</option><option>External</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving}
                style={{ width: '100%', padding: '12px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                {saving ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Scheduling...</> : 'Schedule Exam'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
