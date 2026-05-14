import { useEffect, useState } from 'react';
import { Search, Eye, Loader, X, User, Phone, Mail, BookOpen, Users } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

const deptColors = { CS: '#3D3BF3', IT: '#22C55E', ECE: '#F59E0B', MECH: '#EF4444', CIVIL: '#8B5CF6' };

export default function Students() {
  const isMobile = useIsMobile();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');

  const fetchStudents = async (q = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/students${q ? `?search=${q}` : ''}`);
      setStudents(res.data.students || res.data || []);
    } catch { setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchStudents(search); };

  const viewStudent = async (id) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/students/${id}`);
      setSelected(res.data.student || res.data);
    } catch {
      setSelected(students.find(s => s.student_id === id));
    } finally { setDetailLoading(false); }
  };

  const depts = ['All', ...new Set(students.map(s => s.department).filter(Boolean))];
  const filtered = students.filter(s =>
    (filterDept === 'All' || s.department === filterDept) &&
    (search === '' || s.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const pad = isMobile ? '16px' : '28px';

  return (
    <div style={{ padding: pad }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Students</h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{students.length} total enrolled</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#EEF0FF', padding: '8px 14px', borderRadius: '12px' }}>
          <Users size={16} color="#3D3BF3" />
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#3D3BF3' }}>{students.length}</span>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>
        <button type="submit" style={{ padding: '10px 16px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Search</button>
        {search && <button type="button" onClick={() => { setSearch(''); fetchStudents(); }} style={{ padding: '10px 12px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' }}>✕</button>}
      </form>

      {/* Dept Filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {depts.map(d => (
          <button key={d} onClick={() => setFilterDept(d)}
            style={{ padding: '7px 14px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', background: filterDept === d ? '#3D3BF3' : '#F3F4F6', color: filterDept === d ? '#fff' : '#6B7280' }}>
            {d}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
          <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
          <p style={{ color: '#9CA3AF', marginTop: '12px', fontSize: '14px' }}>Loading students...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
          <Users size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '600' }}>No students found</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Students will appear here once they register</div>
        </div>
      ) : isMobile ? (
        /* ── Mobile Card View ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((s) => (
            <div key={s.student_id} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: deptColors[s.department] || '#3D3BF3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '16px', flexShrink: 0 }}>
                {s.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: deptColors[s.department] || '#3D3BF3', background: (deptColors[s.department] || '#3D3BF3') + '18', padding: '2px 8px', borderRadius: '6px' }}>{s.department || '—'}</span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Sem {s.semester}</span>
                </div>
              </div>
              <button onClick={() => viewStudent(s.student_id)}
                style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#EEF0FF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Eye size={15} color="#3D3BF3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* ── Desktop Table View ── */
        <div style={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                {['Student', 'ID', 'Department', 'Semester', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.student_id} style={{ borderBottom: '1px solid #F9FAFB' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: deptColors[s.department] || '#3D3BF3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                        {s.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9CA3AF', fontFamily: 'monospace' }}>#{s.student_id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: deptColors[s.department] || '#3D3BF3', background: (deptColors[s.department] || '#3D3BF3') + '18', padding: '4px 10px', borderRadius: '8px' }}>{s.department || '—'}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B7280' }}>{s.semester || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: s.status === 'Active' ? '#16A34A' : '#9CA3AF', background: s.status === 'Active' ? '#F0FDF4' : '#F3F4F6', padding: '4px 10px', borderRadius: '8px' }}>{s.status || 'Active'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => viewStudent(s.student_id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', background: '#EEF0FF', border: 'none', color: '#3D3BF3', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {(selected || detailLoading) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 50, padding: isMobile ? '0' : '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: isMobile ? '24px 24px 0 0' : '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: isMobile ? '100%' : '420px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Student Profile</h3>
              <button onClick={() => setSelected(null)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><X size={16} /></button>
            </div>
            {detailLoading ? (
              <div style={{ textAlign: 'center', padding: '32px' }}><Loader size={24} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite' }} /></div>
            ) : selected && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#EEF0FF', borderRadius: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#3D3BF3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '22px', flexShrink: 0 }}>
                    {selected.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '800', color: '#111827' }}>{selected.name}</div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>ID: #{selected.student_id} · {selected.department}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: Mail, label: 'Email', value: selected.email },
                    { icon: Phone, label: 'Phone', value: selected.phone },
                    { icon: BookOpen, label: 'Semester', value: selected.semester },
                    { icon: User, label: "Parent's Name", value: selected.parent_name },
                    { icon: Phone, label: "Parent's Phone", value: selected.parent_phone },
                  ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={16} color="#9CA3AF" />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600', marginTop: '1px' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
