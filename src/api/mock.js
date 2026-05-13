// ─── MOCK API ─────────────────────────────────────────────────────────────────
// Used when VITE_USE_MOCK=true  (UI-only demo, no backend needed)
// ─────────────────────────────────────────────────────────────────────────────

const STUDENTS = [
  { id: 1, name: 'Arun Kumar',     email: 'arun@student.com',   department: 'CS',    semester: 5, roll_number: 'CS21001', mobile: '9876543210' },
  { id: 2, name: 'Priya Sharma',   email: 'priya@student.com',  department: 'IT',    semester: 3, roll_number: 'IT22002', mobile: '9876543211' },
  { id: 3, name: 'Vikram Nair',    email: 'vikram@student.com', department: 'ECE',   semester: 5, roll_number: 'EC21003', mobile: '9876543212' },
  { id: 4, name: 'Divya Menon',    email: 'divya@student.com',  department: 'MECH',  semester: 7, roll_number: 'ME20004', mobile: '9876543213' },
  { id: 5, name: 'Ravi Shankar',   email: 'ravi@student.com',   department: 'CS',    semester: 3, roll_number: 'CS22005', mobile: '9876543214' },
  { id: 6, name: 'Ananya Iyer',    email: 'ananya@student.com', department: 'IT',    semester: 5, roll_number: 'IT21006', mobile: '9876543215' },
  { id: 7, name: 'Karthik Raj',    email: 'karthik@student.com',department: 'CS',    semester: 7, roll_number: 'CS20007', mobile: '9876543216' },
  { id: 8, name: 'Sneha Pillai',   email: 'sneha@student.com',  department: 'CIVIL', semester: 5, roll_number: 'CV21008', mobile: '9876543217' },
];

const LEAVES = [
  { id: 1, student_name: 'Priya Sharma',  department: 'IT',   leave_type: 'Medical',  from_date: '2026-05-15', to_date: '2026-05-17', reason: 'High fever and doctor rest advised', status: 'Pending' },
  { id: 2, student_name: 'Arun Kumar',    department: 'CS',   leave_type: 'Personal', from_date: '2026-05-20', to_date: '2026-05-20', reason: 'Family function', status: 'Pending' },
  { id: 3, student_name: 'Vikram Nair',   department: 'ECE',  leave_type: 'Medical',  from_date: '2026-05-18', to_date: '2026-05-19', reason: 'Dental surgery follow-up', status: 'Pending' },
  { id: 4, student_name: 'Divya Menon',   department: 'MECH', leave_type: 'Academic', from_date: '2026-05-22', to_date: '2026-05-23', reason: 'Inter-college project presentation', status: 'Approved' },
  { id: 5, student_name: 'Ravi Shankar',  department: 'CS',   leave_type: 'Personal', from_date: '2026-05-10', to_date: '2026-05-11', reason: 'Attending cousin wedding', status: 'Rejected' },
];

const EXAMS = [
  { exam_id: 1, exam_name: 'Internal Assessment 1', subject: 'Data Structures',      exam_type: 'Internal', department: 'CS',   semester: '5', date: '2026-05-25', start_time: '09:00', end_time: '12:00', total_marks: 100, status: 'Scheduled' },
  { exam_id: 2, exam_name: 'Internal Assessment 1', subject: 'Database Management',  exam_type: 'Internal', department: 'CS',   semester: '5', date: '2026-05-27', start_time: '09:00', end_time: '12:00', total_marks: 100, status: 'Scheduled' },
  { exam_id: 3, exam_name: 'Internal Assessment 1', subject: 'Computer Networks',    exam_type: 'Internal', department: 'IT',   semester: '5', date: '2026-05-26', start_time: '10:00', end_time: '13:00', total_marks: 100, status: 'Scheduled' },
  { exam_id: 4, exam_name: 'Semester Final Exam',   subject: 'Circuit Theory',       exam_type: 'External', department: 'ECE',  semester: '3', date: '2026-06-10', start_time: '09:00', end_time: '12:00', total_marks: 100, status: 'Scheduled' },
  { exam_id: 5, exam_name: 'Internal Assessment 2', subject: 'Operating Systems',    exam_type: 'Internal', department: 'CS',   semester: '5', date: '2026-04-20', start_time: '09:00', end_time: '11:00', total_marks: 50,  status: 'Completed' },
  { exam_id: 6, exam_name: 'Internal Assessment 2', subject: 'Thermodynamics',       exam_type: 'Internal', department: 'MECH', semester: '5', date: '2026-04-22', start_time: '10:00', end_time: '12:00', total_marks: 50,  status: 'Completed' },
];

const EVENTS = [
  { event_id: 1, event_title: 'Annual Tech Fest 2026',       category: 'Technical',  department: 'All', event_date: '2026-06-01', venue: 'Main Auditorium',   published: true  },
  { event_id: 2, event_title: 'Cultural Night',               category: 'Cultural',   department: 'All', event_date: '2026-06-15', venue: 'Open Air Theatre',  published: true  },
  { event_id: 3, event_title: 'TCS Placement Drive',          category: 'Placement',  department: 'CS',  event_date: '2026-05-20', venue: 'Seminar Hall',      published: true  },
  { event_id: 4, event_title: 'Alumni Meet 2026',             category: 'Alumni',     department: 'All', event_date: '2026-07-10', venue: 'Main Auditorium',   published: false },
  { event_id: 5, event_title: 'Inter-College Cricket Match',  category: 'Sports',     department: 'All', event_date: '2026-05-30', venue: 'College Ground',    published: true  },
  { event_id: 6, event_title: 'Hackathon 2026',               category: 'Technical',  department: 'CS',  event_date: '2026-06-20', venue: 'CS Lab Block',      published: true  },
];

const PLACEMENTS = [
  { id: 1, company: 'TCS',       company_name: 'TCS',       role: 'Software Engineer',       job_role: 'Software Engineer',       package: '7 LPA',  eligibility: 'CS, IT', interview_date: '2026-05-20' },
  { id: 2, company: 'Infosys',   company_name: 'Infosys',   role: 'Systems Engineer',         job_role: 'Systems Engineer',         package: '6.5 LPA',eligibility: 'All',    interview_date: '2026-05-28' },
  { id: 3, company: 'Wipro',     company_name: 'Wipro',     role: 'Project Engineer',         job_role: 'Project Engineer',         package: '6 LPA',  eligibility: 'CS, IT, ECE', interview_date: '2026-06-05' },
  { id: 4, company: 'Zoho',      company_name: 'Zoho',      role: 'Software Developer',       job_role: 'Software Developer',       package: '12 LPA', eligibility: 'CS, IT', interview_date: '2026-06-12' },
  { id: 5, company: 'L&T',       company_name: 'L&T',       role: 'Graduate Engineer Trainee',job_role: 'Graduate Engineer Trainee',package: '5.5 LPA',eligibility: 'MECH, CIVIL', interview_date: '2026-06-18' },
];

const SCHOLARSHIPS = [
  { id: 1, name: 'Merit Scholarship',      scholarship_name: 'Merit Scholarship',      eligibility: 'CGPA ≥ 9.0',                amount: 25000, deadline: '2026-05-31' },
  { id: 2, name: 'Sports Excellence Award',scholarship_name: 'Sports Excellence Award',eligibility: 'State/National level sports',amount: 15000, deadline: '2026-06-15' },
  { id: 3, name: 'Need-Based Financial Aid',scholarship_name: 'Need-Based Financial Aid',eligibility: 'Annual income < ₹3 Lakhs',amount: 30000, deadline: '2026-05-25' },
  { id: 4, name: 'Research Grant',          scholarship_name: 'Research Grant',          eligibility: 'Published research paper',  amount: 20000, deadline: '2026-07-01' },
];

const TIMETABLE = {
  CS_5: [
    { id: 1, day: 'Monday',    subject: 'Data Structures',   faculty: 'Dr. Ramesh',   room: 'CS-101', start_time: '09:00', end_time: '10:00' },
    { id: 2, day: 'Monday',    subject: 'DBMS',              faculty: 'Dr. Meena',    room: 'CS-102', start_time: '10:00', end_time: '11:00' },
    { id: 3, day: 'Monday',    subject: 'Operating Systems', faculty: 'Prof. Arjun',  room: 'CS-103', start_time: '11:00', end_time: '12:00' },
    { id: 4, day: 'Tuesday',   subject: 'Computer Networks', faculty: 'Dr. Preethi',  room: 'CS-101', start_time: '09:00', end_time: '10:00' },
    { id: 5, day: 'Tuesday',   subject: 'Data Structures',   faculty: 'Dr. Ramesh',   room: 'CS-Lab', start_time: '10:00', end_time: '12:00' },
    { id: 6, day: 'Wednesday', subject: 'DBMS',              faculty: 'Dr. Meena',    room: 'CS-Lab', start_time: '09:00', end_time: '11:00' },
    { id: 7, day: 'Wednesday', subject: 'Software Engg',     faculty: 'Prof. Vijay',  room: 'CS-102', start_time: '11:00', end_time: '12:00' },
    { id: 8, day: 'Thursday',  subject: 'Operating Systems', faculty: 'Prof. Arjun',  room: 'CS-101', start_time: '09:00', end_time: '10:00' },
    { id: 9, day: 'Thursday',  subject: 'Computer Networks', faculty: 'Dr. Preethi',  room: 'CS-102', start_time: '10:00', end_time: '11:00' },
    { id: 10,day: 'Friday',    subject: 'Software Engg',     faculty: 'Prof. Vijay',  room: 'CS-101', start_time: '09:00', end_time: '10:00' },
    { id: 11,day: 'Friday',    subject: 'DBMS',              faculty: 'Dr. Meena',    room: 'CS-102', start_time: '10:00', end_time: '11:00' },
    { id: 12,day: 'Saturday',  subject: 'Data Structures',   faculty: 'Dr. Ramesh',   room: 'CS-101', start_time: '09:00', end_time: '10:00' },
  ],
};

// ─── URL matcher ─────────────────────────────────────────────────────────────

function resolve(method, url, body = {}) {
  // Auth
  if (url.includes('/admin/send-otp'))
    return { status: 'success', otp_ref_id: 'MOCK-OTP-001', expiry_seconds: 120 };

  if (url.includes('/admin/verify-otp'))
    return { status: 'success', verified: true, message: 'OTP verified successfully' };

  if (url.includes('/admin/set-password'))
    return { status: 'success', message: 'Account created successfully' };

  if (url.includes('/admin/login'))
    return { status: 'success', token: 'mock-demo-token-raise-2026', admin_id: 1, role: 'College Admin', message: 'Login successful', expires_in: 86400 };

  // Dashboard
  if (url.includes('/admin/dashboard'))
    return { status: 'success', data: { total_students: 1247, active_courses: 24, pending_leaves: 8, upcoming_exams: 3, total_placements: 12, total_scholarships: 45, total_events: 8, unread_notifications: 3 } };

  // Students
  if (url.includes('/admin/students')) {
    const search = url.includes('?search=') ? decodeURIComponent(url.split('?search=')[1]).toLowerCase() : '';
    const filtered = search
      ? STUDENTS.filter(s => s.name.toLowerCase().includes(search) || s.roll_number.toLowerCase().includes(search))
      : STUDENTS;
    // single student detail
    const idMatch = url.match(/\/admin\/students\/(\d+)/);
    if (idMatch) {
      const student = STUDENTS.find(s => s.id === Number(idMatch[1])) || STUDENTS[0];
      return { student };
    }
    return { students: filtered };
  }

  // Leaves
  if (url.includes('/admin/leaves')) {
    if (method === 'PUT') return { status: 'success', message: 'Leave status updated' };
    return { leaves: LEAVES };
  }

  // Exams
  if (url.includes('/admin/exams')) {
    if (method === 'POST') return { status: 'success', message: 'Exam created' };
    return { exams: EXAMS };
  }

  // Events
  if (url.includes('/admin/events')) {
    if (method === 'POST') return { status: 'success', message: 'Event created' };
    return { events: EVENTS };
  }

  // Placements
  if (url.includes('/admin/placements')) {
    if (method === 'POST') return { status: 'success', message: 'Placement drive created' };
    return { placements: PLACEMENTS };
  }

  // Scholarships
  if (url.includes('/admin/scholarships')) {
    if (method === 'POST' || method === 'PUT') return { status: 'success', message: 'Success' };
    return { scholarships: SCHOLARSHIPS };
  }

  // Timetable
  if (url.includes('/admin/timetable')) {
    if (method === 'POST') return { status: 'success', message: 'Timetable entry added' };
    const dept = url.includes('department=CS') ? 'CS' : null;
    const sem  = url.includes('semester=5')   ? '5'  : null;
    const schedule = (dept === 'CS' && sem === '5') ? TIMETABLE.CS_5 : [];
    return { schedule };
  }

  // Attendance
  if (url.includes('/admin/attendance'))
    return {
      overall_percentage: 87,
      subjects: [
        { subject: 'Data Structures',   faculty: 'Dr. Ramesh',  present: 40, total: 45 },
        { subject: 'DBMS',              faculty: 'Dr. Meena',   present: 38, total: 44 },
        { subject: 'Operating Systems', faculty: 'Prof. Arjun', present: 35, total: 42 },
        { subject: 'Computer Networks', faculty: 'Dr. Preethi', present: 28, total: 40 },
        { subject: 'Software Engg',     faculty: 'Prof. Vijay', present: 42, total: 44 },
      ],
    };

  // Notifications
  if (url.includes('/admin/notifications'))
    return { status: 'success', notification_id: Date.now(), message: 'Sent successfully' };

  return { status: 'success' };
}

// ─── Mock axios object ────────────────────────────────────────────────────────

export const mockApi = {
  get:    (url)        => Promise.resolve({ data: resolve('GET',    url) }),
  post:   (url, body)  => Promise.resolve({ data: resolve('POST',   url, body) }),
  put:    (url, body)  => Promise.resolve({ data: resolve('PUT',    url, body) }),
  delete: (url)        => Promise.resolve({ data: resolve('DELETE', url) }),
  interceptors: {
    request:  { use: () => {} },
    response: { use: () => {} },
  },
};
