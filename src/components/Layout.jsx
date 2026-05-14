import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  LayoutDashboard, Users, CalendarCheck, FileText, BookOpen,
  Award, Briefcase, Bell, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, ClipboardList, Calendar, Menu, X, ChevronRight as Arrow
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students',      icon: Users,           label: 'Students' },
  { to: '/attendance',    icon: CalendarCheck,   label: 'Attendance' },
  { to: '/leaves',        icon: ClipboardList,   label: 'Leaves' },
  { to: '/exams',         icon: BookOpen,        label: 'Exams' },
  { to: '/timetable',     icon: Calendar,        label: 'Timetable' },
  { to: '/events',        icon: FileText,        label: 'Events' },
  { to: '/scholarships',  icon: Award,           label: 'Scholarships' },
  { to: '/placements',    icon: Briefcase,       label: 'Placements' },
  { to: '/notifications', icon: Bell,            label: 'Notifications' },
];

const bottomNavItems = navItems.slice(0, 4);

export default function Layout() {
  const isMobile = useIsMobile();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  /* ─── MOBILE LAYOUT ─── */
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F4F7FF' }}>

        {/* Mobile Top Header */}
        <header style={{
          background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
          padding: '0 16px', height: '56px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <img src="/raise-logo.png" alt="RAISE" style={{ height: '26px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => navigate('/notifications')}
              style={{ position: 'relative', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={17} color="#6B7280" />
              <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '14px', height: '14px', background: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: '800' }}>3</div>
            </button>
            <button onClick={() => setDrawerOpen(true)}
              style={{ background: '#F3F4F6', border: 'none', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Menu size={18} color="#374151" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#FFFFFF', borderTop: '1px solid #E5E7EB',
          display: 'flex', height: '64px', zIndex: 40,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {bottomNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              style={({ isActive }) => ({
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '3px',
                textDecoration: 'none', color: isActive ? '#3D3BF3' : '#9CA3AF',
                fontSize: '10px', fontWeight: isActive ? '700' : '500',
                background: 'transparent', border: 'none', cursor: 'pointer',
              })}>
              {({ isActive }) => (
                <>
                  <div style={{
                    width: '36px', height: '28px', borderRadius: '10px',
                    background: isActive ? '#EEF0FF' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={isActive ? '#3D3BF3' : '#9CA3AF'} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
          {/* More button */}
          <button onClick={() => setDrawerOpen(true)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '10px', fontWeight: '500' }}>
            <div style={{ width: '36px', height: '28px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Menu size={18} color="#9CA3AF" />
            </div>
            <span>More</span>
          </button>
        </nav>

        {/* Drawer Overlay */}
        {drawerOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            {/* Backdrop */}
            <div onClick={() => setDrawerOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} />
            {/* Drawer */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: '#FFFFFF', borderRadius: '24px 24px 0 0',
              padding: '16px 0 32px', maxHeight: '80vh', overflowY: 'auto',
            }}>
              {/* Handle */}
              <div style={{ width: '36px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 16px' }} />

              {/* Admin info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ width: '42px', height: '42px', background: '#3D3BF3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px' }}>
                  {admin?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>Admin</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{admin?.email}</div>
                </div>
              </div>

              {/* All Nav Items */}
              <div style={{ padding: '8px 12px' }}>
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} onClick={() => setDrawerOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '13px 12px', borderRadius: '12px', marginBottom: '2px',
                      color: isActive ? '#3D3BF3' : '#374151',
                      background: isActive ? '#EEF0FF' : 'transparent',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '15px', textDecoration: 'none',
                    })}>
                    {({ isActive }) => (
                      <>
                        <Icon size={20} color={isActive ? '#3D3BF3' : '#9CA3AF'} />
                        <span style={{ flex: 1 }}>{label}</span>
                        <Arrow size={14} color="#D1D5DB" />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Logout */}
              <div style={{ padding: '8px 20px 0', borderTop: '1px solid #F3F4F6', marginTop: '4px' }}>
                <button onClick={handleLogout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 12px', borderRadius: '12px', background: '#FEF2F2', border: 'none', color: '#DC2626', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── DESKTOP LAYOUT ─── */
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F4F7FF', overflow: 'hidden' }}>
      {/* SIDEBAR */}
      <div style={{
        width: collapsed ? '64px' : '240px',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Collapse Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
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
                padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
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

        {/* Bottom: Admin Profile + Logo */}
        <div style={{ borderTop: '1px solid #F3F4F6' }}>
          <div style={{ padding: '8px 8px 4px' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : '8px', padding: '7px 8px',
              borderRadius: '10px', background: '#F9FAFB',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}>
              <div style={{ width: '28px', height: '28px', background: '#3D3BF3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
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

          {/* RAISE Logo at bottom */}
          <div style={{ padding: collapsed ? '8px 0' : '6px 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {collapsed ? (
              <div style={{ width: '30px', height: '30px', background: '#EEF0FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={16} color="#3D3BF3" />
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <img src="/raise-logo.png" alt="RAISE" style={{ height: '28px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 3px' }} />
                <div style={{ fontSize: '8px', color: '#D1D5DB', fontWeight: '400' }}>
                  Powered by <span style={{ fontWeight: '700', color: '#C4C2FB' }}>KEJ IT</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ flex: 1 }} />
          <select style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', color: '#374151', background: '#F9FAFB', outline: 'none', cursor: 'pointer' }}>
            <option>Academic Year 2026</option>
            <option>Academic Year 2025</option>
          </select>
          <select style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', color: '#374151', background: '#F9FAFB', outline: 'none', cursor: 'pointer' }}>
            <option>All Departments</option>
            <option>CS</option><option>IT</option><option>ECE</option><option>MECH</option>
          </select>
          <button onClick={() => navigate('/notifications')}
            style={{ position: 'relative', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Bell size={18} color="#6B7280" />
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: '800' }}>3</div>
          </button>
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
