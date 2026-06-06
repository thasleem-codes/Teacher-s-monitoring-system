export interface Teacher {
  id: string;
  name: string;
  subject: string;
  department: 'KG' | 'LP' | 'UP & HS' | 'HSS';
  isClassTeacher: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'boolean' | 'text';
  group: 'common' | 'class_teacher';
  day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | 'Everyday';
}

export interface DailyLogSubmission {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  department: string;
  date: string; // Formatted display date
  rawDate: string; // YYYY-MM-DD for checking daily duplicates!
  status: 'Complete' | 'Pending Review';
  score: number;
  notes?: string;
}

export interface TeacherRanking {
  rank: number;
  teacherId: string;
  name: string;
  subject: string;
  department: string;
  monthlyScore: number;
  streak: number;
}

// 1. Initial Teachers
export const initialTeachers: Teacher[] = [
  { id: 't1', name: 'Mohammed Thasleem', subject: 'IT / Computer Science', department: 'UP & HS', isClassTeacher: true },
  { id: 't2', name: 'Ananya Sharma', subject: 'English Language', department: 'UP & HS', isClassTeacher: false },
  { id: 't3', name: 'Rahul Varma', subject: 'Mathematics', department: 'UP & HS', isClassTeacher: true },
  { id: 't4', name: 'Sneha Nair', subject: 'Science', department: 'UP & HS', isClassTeacher: false },
  { id: 't5', name: 'Divya Pillai', subject: 'General Science', department: 'LP', isClassTeacher: true },
  { id: 't6', name: 'Suresh Kumar', subject: 'Malayalam', department: 'HSS', isClassTeacher: false },
];

// 2. Question Bank
export const mockQuestions: Question[] = [
  { id: 'q1', text: 'Did you submit the teacher manual today?', type: 'boolean', group: 'common', day: 'Monday' },
  { id: 'q2', text: 'Did you complete all scheduled IT/Language classes today?', type: 'boolean', group: 'common', day: 'Everyday' },
  { id: 'q3', text: 'As a Class Teacher, did you update the attendance registry?', type: 'boolean', group: 'class_teacher', day: 'Everyday' },
  { id: 'q4', text: "Any specific challenges or remarks from today's sessions?", type: 'text', group: 'common', day: 'Everyday' }
];

// 3. Initial Submissions (Notice t1 and t3 have already submitted for today's date: 2026-07-12)
export const initialSubmissions: DailyLogSubmission[] = [
  { id: 's1', teacherId: 't1', teacherName: 'Mohammed Thasleem', subject: 'IT / Computer Science', department: 'UP & HS', date: 'Today, 3:45 PM', rawDate: '2026-07-12', status: 'Complete', score: 100, notes: 'All IT practical labs completed smoothly.' },
  { id: 's2', teacherId: 't3', teacherName: 'Rahul Varma', subject: 'Mathematics', department: 'UP & HS', date: 'Today, 3:30 PM', rawDate: '2026-07-12', status: 'Complete', score: 95 },
  { id: 's3', teacherId: 't5', teacherName: 'Divya Pillai', subject: 'General Science', department: 'LP', date: 'Today, 1:15 PM', rawDate: '2026-07-12', status: 'Complete', score: 100 },
];

// 4. Leaderboard
export const initialLeaderboard: TeacherRanking[] = [
  { rank: 1, teacherId: 't1', name: 'Mohammed Thasleem', subject: 'IT / Computer Science', department: 'UP & HS', monthlyScore: 98.5, streak: 14 },
  { rank: 2, teacherId: 't3', name: 'Rahul Varma', subject: 'Mathematics', department: 'UP & HS', monthlyScore: 96.0, streak: 12 },
  { rank: 3, teacherId: 't4', name: 'Sneha Nair', subject: 'Science', department: 'UP & HS', monthlyScore: 92.4, streak: 9 },
  { rank: 4, teacherId: 't2', name: 'Ananya Sharma', subject: 'English Language', department: 'UP & HS', monthlyScore: 88.0, streak: 5 },
  { rank: 1, teacherId: 't5', name: 'Divya Pillai', subject: 'General Science', department: 'LP', monthlyScore: 99.0, streak: 15 },
];