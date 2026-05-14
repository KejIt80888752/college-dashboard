import { useState } from 'react';
import { Search, Users, CalendarCheck, TrendingUp, AlertTriangle, Loader, Calendar } from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

const deptColors = { CS: '#3D3BF3', IT: '#22C55E', ECE: '#F59E0B', MECH: '#EF4444', CIVIL: '#8B5CF6' };

export default function Attendance() {
  const [query,             setQuery]             = useState('');
  const [students,          setStudents]          = useState([]);
  const [searching,         setSearching]         = useState(false);
  const [searched,          setSearched]          = useState(false);
  const [selected,          setSelected]          = useState(null);
  const [attendance,        setAttendance]        = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearched(false);
    setSelected(null);
    setAttendance(null);
    try {
      const res = await api.get(`/admin/students?search=${encodeURIComponent(query.trim())}`);
      setStudents(res.data.students || []);
    } catch {
      setStudents([]);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  };

  const handleSelect = async (student) => {
    setSelected(student);
    setStudents([]);
    setLoadingAttendance(true);
    setAttendance(null);
    try {
      const id  = student.id || student.student_id;
      const res = await api.get(`/admin/attendance/${id}`);
      setAttendance(res.data.attendance || res.data || null);
    } catch {
      setAttendance(null);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleBack = () => {
    setSelected(null);
    setAttendance(null);
    setSearched(false);
    setStudents([]);
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '28px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Attendance</h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
          Search a student to view their subject-wise attendance records
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} color="#9CA3AF"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by student name or roll number..."
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF', fontFamily: 'inherit', color: '#111827' }}
          />
        </div>
        <button type="submit" disabled={searching}
          style={{ padding: '12px 24px', background: '#3D3BF3', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          {searching
            ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Searching...</>
            : <><Search size={16} /> Search</>}
        </button>
      </form>

      {/* Student List (search results) */}
      {!selected && students.length > 0 && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #F3F4F6', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
            {students.length} student{students.length !== 1 ? 's' : ''} found — click to view attendance
          </div>
          {students.map((st) => {
            const id    = st.id || st.student_id;
            const color = deptColors[st.department] || '#6B7280';
            const name  = st.name || st.full_name || 'Student';
            return (
              <div key={id} onClick={() => handleSelect(st)}
                style={{ padding: '14px 20px', borderBottom: '1px solid #F9FAFB', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color, flexShrink: 0 }}>
                  {name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                    {st.department} · Sem {st.semester} · {st.roll_number || st.email || ''}
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color, background: color + '18', padding: '3px 10px', borderRadius: '6px', flexShrink: 0 }}>
                  {st.department}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* No results */}
      {!selected && searched && students.length === 0 && (
        <div style={{ textAlign: 'center', padding: '52px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
          <Users size={36} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 10px' }} />
          <div style={{ fontSize: '15px', fontWeight: '600' }}>No students found for "{query}"</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Try a different name or roll number</div>
        </div>
      )}

      {/* Selected student view */}
      {selected && (
        <>
          {/* Back + student info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <button onClick={handleBack}
              style={{ padding: '8px 16px', background: '#F3F4F6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer' }}>
              ← Back
            </button>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>
                {selected.name || selected.full_name}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {selected.department} · Semester {selected.semester} · {selected.roll_number || selected.email || ''}
              </div>
            </div>
          </div>

          {/* Attendance content */}
          {loadingAttendance ? (
            <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px' }}>
              <Loader size={28} color="#3D3BF3" style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
              <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Loading attendance...</p>
            </div>
          ) : !attendance ? (
            <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
              <CalendarCheck size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: '600' }}>No attendance records found</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                Attendance is recorded when students mark it through the mobile app
              </div>
            </div>
          ) : (
            <AttendanceView data={attendance} student={selected} />
          )}
        </>
      )}

      {/* Initial empty state */}
      {!query && !selected && !searched && (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
          <Search size={40} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '600' }}>Search for a student</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>
            Enter a student name or roll number to view their attendance records
          </div>
        </div>
      )}

    </div>
  );
}

function AttendanceView({ data, student }) {
  const subjects = Array.isArray(data)
    ? data
    : (data.subjects || data.attendance_records || data.attendance || []);

  const overall = data.overall_percentage ?? data.overall ?? data.overall_attendance ?? null;
  const deptColor = deptColors[student?.department] || '#3D3BF3';

  if (subjects.length === 0 && overall == null) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', background: '#FFFFFF', borderRadius: '20px', color: '#9CA3AF' }}>
        <CalendarCheck size={36} color="#E5E7EB" style={{ display: 'block', margin: '0 auto 10px' }} />
        <div style={{ fontSize: '14px', fontWeight: '600' }}>No attendance data available</div>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>No records have been submitted yet</div>
      </div>
    );
  }

  return (
    <div>
      {/* Overall */}
      {overall != null && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: deptColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={24} color={deptColor} />
            </div>
            <div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: Number(overall) >= 75 ? '#16A34A' : '#EF4444' }}>
                {overall}%
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                Overall Attendance ·{' '}
                <span style={{ fontWeight: '700', color: Number(overall) >= 75 ? '#16A34A' : '#EF4444' }}>
                  {Number(overall) >= 75 ? 'Eligible' : 'Below 75% — At Risk'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject-wise table */}
      {subjects.length > 0 && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>Subject-wise Attendance</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}>
                {['Subject', 'Present', 'Total Classes', 'Percentage', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, i) => {
                const pct = sub.percentage
                  ?? sub.attendance_percentage
                  ?? (sub.present != null && sub.total != null && sub.total > 0
                      ? Math.round((sub.present / sub.total) * 100)
                      : null);
                const isLow = pct != null && pct < 75;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
                        {sub.subject || sub.subject_name || sub.name || 'Subject'}
                      </div>
                      {sub.faculty && (
                        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{sub.faculty}</div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>
                      {sub.present ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>
                      {sub.total ?? sub.total_classes ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {pct != null ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '80px', height: '6px', background: '#F3F4F6', borderRadius: '999px' }}>
                            <div style={{ height: '6px', borderRadius: '999px', background: isLow ? '#EF4444' : '#22C55E', width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{pct}%</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {pct != null ? (
                        <span style={{ fontSize: '12px', fontWeight: '700', color: isLow ? '#DC2626' : '#16A34A', background: isLow ? '#FEF2F2' : '#F0FDF4', padding: '4px 10px', borderRadius: '8px' }}>
                          {isLow ? 'Low' : 'Good'}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
