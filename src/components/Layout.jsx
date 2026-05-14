import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarCheck, FileText, BookOpen,
  Award, Briefcase, Bell, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, ClipboardList, Calendar
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
  { to: '/leaves', icon: ClipboardList, label: 'Leave Requests' },
  { to: '/exams', icon: BookOpen, label: 'Exams & Marks' },
  { to: '/timetable', icon: Calendar, label: 'Timetable' },
  { to: '/events', icon: FileText, label: 'Events' },
  { to: '/scholarships', icon: Award, label: 'Scholarships' },
  { to: '/placements', icon: Briefcase, label: 'Placements' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F4F7FF', overflow: 'hidden' }}>
      {/* SIDEBAR */}
      <div style={{
        width: collapsed ? '64px' : '240px',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}>

        {/* Collapse Toggle - Top */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '10px 10px',
          borderBottom: '1px solid #F3F4F6',
          minHeight: '44px',
        }}>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: '6px', borderRadius: '8px', flexShrink: 0 }}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} title={collapsed ? label : ''}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px', marginBottom: '2px',
                color: isActive ? '#fff' : '#6B7280',
                background: isActive ? '#3D3BF3' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                fontSize: '13.5px', textDecoration: 'none',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              })}>
              {({ isActive }) => (
                <>
                  <Icon size={17} color={isActive ? '#fff' : '#9CA3AF'} style={{ flexShrink: 0 }} />
                  {!collapsed && label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Admin Profile (compact) + Logo */}
        <div style={{ borderTop: '1px solid #F3F4F6' }}>
          {/* Admin Profile - compact */}
          <div style={{ padding: '8px 8px 4px' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : '8px',
              padding: '7px 8px',
              borderRadius: '10px',
              background: '#F9FAFB',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}>
              <div style={{
                width: '28px', height: '28px', background: '#3D3BF3',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: '700',
                fontSize: '12px', flexShrink: 0,
              }}>
                {admin?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              {!collapsed && (
                <>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin?.email}</div>
                  </div>
                  <button onClick={handleLogout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '3px', borderRadius: '6px', display: 'flex', flexShrink: 0 }}
                    title="Logout">
                    <LogOut size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Powered by tag */}
          {!collapsed && (
            <div style={{ padding: '4px 10px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#D1D5DB', fontWeight: '400' }}>
                Powered by <span style={{ fontWeight: '700', color: '#C4C2FB' }}>KEJ IT</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* RAISE Logo in header */}
          <img src="/raise-logo.png" alt="RAISE" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          <div style={{ flex: 1 }} />
          <select style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', color: '#374151', background: '#F9FAFB', outline: 'none', cursor: 'pointer' }}>
            <option>Academic Year 2026</option>
            <option>Academic Year 2025</option>
          </select>
          <select style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', color: '#374151', background: '#F9FAFB', outline: 'none', cursor: 'pointer' }}>
            <option>All Departments</option>
            <option>CS</option><option>IT</option><option>ECE</option><option>MECH</option>
          </select>
          {/* Bell */}
          <button
            onClick={() => navigate('/notifications')}
            style={{ position: 'relative', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Notifications"
          >
            <Bell size={18} color="#6B7280" />
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: '800' }}>3</div>
          </button>
          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', background: '#3D3BF3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
              {admin?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Admin</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Administrator</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
