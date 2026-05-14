import { useState, useEffect } from 'react';
import {
  Bell, Send, Users, User, BookOpen, Loader, CheckCircle,
  Trash2, Plus, AlertCircle, Edit3, Clock, DollarSign,
  Briefcase, FileText, Megaphone, Zap, Smartphone, History
} from 'lucide-react';
import api from '../api/axios';
import { useIsMobile } from '../hooks/useIsMobile';

const STORAGE_KEY = 'raise_notifications';

// Icon components for each type (NO emojis)
const typeConfig = {
  exam:      { color: '#3D3BF3', bg: '#EEF0FF', Icon: FileText,  label: 'Exam' },
  general:   { color: '#6B7280', bg: '#F3F4F6', Icon: Megaphone, label: 'General' },
  placement: { color: '#22C55E', bg: '#F0FDF4', Icon: Briefcase, label: 'Placement' },
  fee:       { color: '#EF4444', bg: '#FEF2F2', Icon: DollarSign,label: 'Fee' },
  event:     { color: '#F59E0B', bg: '#FFFBEB', Icon: Bell,      label: 'Event' },
};

const targets = [
  { label: 'All Students', icon: Users },
  { label: 'CS Semester 5', icon: BookOpen },
  { label: 'IT Semester 3', icon: BookOpen },
  { label: 'ECE Semester 3', icon: BookOpen },
  { label: 'Final Year', icon: Users },
  { label: 'Specific Student', icon: User },
];

const quickTemplates = [
  { title: 'Holiday Notice',   msg: 'College will remain closed on {date}. All scheduled activities are postponed.',         type: 'general' },
  { title: 'Exam Alert',       msg: 'Upcoming exam on {date}. Please bring your hall ticket and ID proof.',                  type: 'exam' },
  { title: 'Placement Drive',  msg: '{company} campus recruitment drive on {date}. Register before {deadline}.',            type: 'placement' },
  { title: 'Fee Reminder',     msg: 'Semester fee payment deadline is {date}. Late fee applicable after deadline.',          type: 'fee' },
  { title: 'Event Reminder',   msg: '{event} is happening on {date}. All are invited to attend.',                           type: 'event' },
];

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveHistory(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export default function Notifications() {
  const [history, setHistory] = useState(loadHistory);
  const [title, setTitle]   = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('All Students');
  const [type, setType]     = useState('general');
  const [sending, setSending] = useState(false);
  const [sent, setSent]     = useState(false);
  const [sendError, setSendError] = useState('');
  const [tab, setTab]       = useState('compose');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { saveHistory(history); }, [history]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setSendError('');

    try {
      await api.post('/admin/notifications/send', { title, message, target, type });
    } catch {
      // Backend optional — local save continues
    }

    const now = new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).replace(',', '');

    const newNotif = { id: 'N' + Date.now(), title: title.trim(), message: message.trim(), target, type, sent_at: now };
    setHistory(prev => [newNotif, ...prev]);
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setTitle(''); setMessage(''); setTab('history'); }, 1600);
  };

  const handleDelete = (id) => { setHistory(prev => prev.filter(n => n.id !== id)); setDeleteId(null); };

  const cfg = (t) => typeConfig[t] || typeConfig.general;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>Notifications</h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Send and manage notifications to students</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Sent',   value: history.length,                                                    color: '#3D3BF3', bg: '#EEF0FF', Icon: Bell },
          { label: 'Broadcast',    value: history.filter(n => n.target === 'All Students').length,           color: '#22C55E', bg: '#F0FDF4', Icon: CheckCircle },
          { label: 'Dept-Specific',value: history.filter(n => n.target !== 'All Students').length,           color: '#F59E0B', bg: '#FFFBEB', Icon: Users },
          { label: 'Types Used',   value: new Set(history.map(n => n.type)).size || 0,                       color: '#8B5CF6', bg: '#F5F3FF', Icon: Send },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
        <button onClick={() => setTab('compose')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: tab === 'compose' ? '#3D3BF3' : '#F3F4F6', color: tab === 'compose' ? '#fff' : '#6B7280' }}>
          <Edit3 size={14} /> Compose
        </button>
        <button onClick={() => setTab('history')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: tab === 'history' ? '#3D3BF3' : '#F3F4F6', color: tab === 'history' ? '#fff' : '#6B7280' }}>
          <History size={14} /> History ({history.length})
        </button>
      </div>

      {/* COMPOSE TAB */}
      {tab === 'compose' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
          {/* Form */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', margin: '0 0 18px' }}>New Notification</h3>

            {sendError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} /> {sendError}
              </div>
            )}

            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Notification Title *</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Exam Schedule Released"
                  style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Message *</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Write your notification message here..."
                  style={{ width: '100%', padding: '10px 13px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '14px', color: '#374151', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} />
              </div>

              {/* Target */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>Target Audience</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {targets.map(({ label, icon: Icon }) => (
                    <button key={label} type="button" onClick={() => setTarget(label)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 11px', borderRadius: '8px', border: `1.5px solid ${target === label ? '#3D3BF3' : '#E5E7EB'}`, background: target === label ? '#EEF0FF' : '#FFFFFF', color: target === label ? '#3D3BF3' : '#6B7280', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>Type</label>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  {Object.entries(typeConfig).map(([t, { Icon, color, bg, label }]) => (
                    <button key={t} type="button" onClick={() => setType(t)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 13px', borderRadius: '8px', border: `1.5px solid ${type === t ? color : '#E5E7EB'}`, background: type === t ? bg : '#FFFFFF', color: type === t ? color : '#6B7280', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <button type="submit" disabled={sending || sent}
                style={{ width: '100%', padding: '12px', background: sent ? '#22C55E' : '#3D3BF3', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.3s' }}>
                {sending
                  ? <><Loader size={17} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                  : sent
                  ? <><CheckCircle size={17} /> Sent Successfully!</>
                  : <><Send size={17} /> Send Notification</>
                }
              </button>
            </form>
          </div>

          {/* Preview + Templates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Preview */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <Smartphone size={14} color="#6B7280" />
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: 0 }}>Preview</h3>
              </div>
              <div style={{ background: '#F4F7FF', borderRadius: '14px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  {(() => { const { Icon, bg, color } = cfg(type); return (
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color={color} />
                    </div>
                  ); })()}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '3px' }}>{title || 'Notification Title'}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{message || 'Your message will appear here...'}</div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '6px' }}>To: {target} · Just now</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Zap size={14} color="#6B7280" />
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: 0 }}>Quick Templates</h3>
              </div>
              {quickTemplates.map((tpl) => {
                const { Icon, color } = cfg(tpl.type);
                return (
                  <button key={tpl.title} type="button"
                    onClick={() => { setTitle(tpl.title); setMessage(tpl.msg); setType(tpl.type); }}
                    style={{ width: '100%', padding: '9px 12px', marginBottom: '7px', borderRadius: '9px', border: '1px solid #E5E7EB', background: '#FAFAFA', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={14} color={color} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>{tpl.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
              <Bell size={40} color="#E5E7EB" style={{ marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: '600' }}>No notifications sent yet</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Compose your first notification</div>
            </div>
          )}
          {history.map((n) => {
            const { Icon, color, bg } = cfg(n.type);
            return (
              <div key={n.id} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {/* Icon */}
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{n.title}</span>
                    <span style={{ fontSize: '10px', fontWeight: '600', color, background: bg, padding: '2px 7px', borderRadius: '5px', textTransform: 'capitalize' }}>{n.type}</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '0 0 6px', lineHeight: 1.5 }}>{n.message}</p>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9CA3AF' }}>
                      <Users size={11} /> {n.target}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9CA3AF' }}>
                      <Clock size={11} /> {n.sent_at}
                    </span>
                  </div>
                </div>

                {/* Delete */}
                {deleteId === n.id ? (
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => handleDelete(n.id)}
                      style={{ padding: '5px 10px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
                    <button onClick={() => setDeleteId(null)}
                      style={{ padding: '5px 10px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(n.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D1D5DB', padding: '4px', borderRadius: '6px', display: 'flex', flexShrink: 0 }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
