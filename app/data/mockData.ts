export interface Teacher {
  id: string;
  name: string;
  subject: string;
  department: "KG" | "LP" | "UP & HS" | "HSS";
  isClassTeacher: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: "boolean" | "text";
  group: "common" | "class_teacher";
  points: number;
  day?:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
    | "Everyday";
}

export interface DailyLogSubmission {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  department: string;
  date: string;
  rawDate: string;
  status: "Complete" | "Partial" | "Overridden" | "Rejected";
  score: number;
  tasksCompleted: {
    manualSubmitted: boolean;
    classesTaken: boolean;
    registryUpdated: boolean;
  };
  answers: Record<string, string>;
  isOverridden?: boolean;
  adminNotes?: string;
  notes?: string; // ← Added this back!
}

export interface TeacherRanking {
  rank: number;
  teacherId: string;
  name: string;
  subject: string;
  department: string;
  monthlyScore: number;
  tasksCompletedRate: number;
  streak: number;
}

// 1. Initial Faculty List
export const initialTeachers: Teacher[] = [
  {
    id: "t1",
    name: "Mohammed Thasleem",
    subject: "IT / Computer Science",
    department: "UP & HS",
    isClassTeacher: true,
  },
  {
    id: "t2",
    name: "Ananya Sharma",
    subject: "English Language",
    department: "UP & HS",
    isClassTeacher: false,
  },
  {
    id: "t3",
    name: "Rahul Varma",
    subject: "Mathematics",
    department: "UP & HS",
    isClassTeacher: true,
  },
  {
    id: "t4",
    name: "Sneha Nair",
    subject: "Science",
    department: "UP & HS",
    isClassTeacher: false,
  },
  {
    id: "t5",
    name: "Divya Pillai",
    subject: "General Science",
    department: "LP",
    isClassTeacher: true,
  },
  {
    id: "t6",
    name: "Suresh Kumar",
    subject: "Malayalam",
    department: "HSS",
    isClassTeacher: false,
  },
];

// 2. Initial Question Bank
export const initialQuestions: Question[] = [
  {
    id: "q1",
    text: "Did you submit the teacher manual today?",
    type: "boolean",
    group: "common",
    points: 35,
    day: "Monday",
  },
  {
    id: "q2",
    text: "Did you complete all scheduled IT/Language classes today?",
    type: "boolean",
    group: "common",
    points: 35,
    day: "Everyday",
  },
  {
    id: "q3",
    text: "As a Class Teacher, did you update the attendance registry?",
    type: "boolean",
    group: "class_teacher",
    points: 30,
    day: "Everyday",
  },
  {
    id: "q4",
    text: "Any specific challenges or remarks from today's sessions?",
    type: "text",
    group: "common",
    points: 0,
    day: "Everyday",
  },
];

// 3. Submissions with Exact Answer Histories
export const initialSubmissions: DailyLogSubmission[] = [
  {
    id: "s1",
    teacherId: "t1",
    teacherName: "Mohammed Thasleem",
    subject: "IT / Computer Science",
    department: "UP & HS",
    date: "Today, 3:45 PM",
    rawDate: "2026-07-12",
    status: "Complete",
    score: 100,
    tasksCompleted: {
      manualSubmitted: true,
      classesTaken: true,
      registryUpdated: true,
    },
    answers: {
      q1: "Yes",
      q2: "Yes",
      q3: "Yes",
      q4: "All IT practical labs completed smoothly.",
    },
  },
  {
    id: "s2",
    teacherId: "t3",
    teacherName: "Rahul Varma",
    subject: "Mathematics",
    department: "UP & HS",
    date: "Today, 3:30 PM",
    rawDate: "2026-07-12",
    status: "Partial",
    score: 70,
    tasksCompleted: {
      manualSubmitted: false,
      classesTaken: true,
      registryUpdated: true,
    },
    answers: {
      q1: "No",
      q2: "Yes",
      q3: "Yes",
      q4: "Manual will be submitted tomorrow morning.",
    },
  },
  {
    id: "s3",
    teacherId: "t5",
    teacherName: "Divya Pillai",
    subject: "General Science",
    department: "LP",
    date: "Today, 1:15 PM",
    rawDate: "2026-07-12",
    status: "Complete",
    score: 100,
    tasksCompleted: {
      manualSubmitted: true,
      classesTaken: true,
      registryUpdated: true,
    },
    answers: { q1: "Yes", q2: "Yes", q3: "Yes", q4: "No issues today." },
  },
  {
    id: "s4",
    teacherId: "t2",
    teacherName: "Ananya Sharma",
    subject: "English Language",
    department: "UP & HS",
    date: "Yesterday",
    rawDate: "2026-07-11",
    status: "Complete",
    score: 100,
    tasksCompleted: {
      manualSubmitted: true,
      classesTaken: true,
      registryUpdated: true,
    },
    answers: { q1: "Yes", q2: "Yes", q4: "Conducted group reading session." },
  },
  {
    id: "s5",
    teacherId: "t4",
    teacherName: "Sneha Nair",
    subject: "Science",
    department: "UP & HS",
    date: "Yesterday",
    rawDate: "2026-07-11",
    status: "Partial",
    score: 65,
    tasksCompleted: {
      manualSubmitted: true,
      classesTaken: false,
      registryUpdated: false,
    },
    answers: {
      q1: "Yes",
      q2: "No",
      q4: "Special assembly took up the class period.",
    },
  },
];

export const initialLeaderboard: TeacherRanking[] = [
  {
    rank: 1,
    teacherId: "t1",
    name: "Mohammed Thasleem",
    subject: "IT / Computer Science",
    department: "UP & HS",
    monthlyScore: 98.5,
    tasksCompletedRate: 100,
    streak: 14,
  },
  {
    rank: 2,
    teacherId: "t3",
    name: "Rahul Varma",
    subject: "Mathematics",
    department: "UP & HS",
    monthlyScore: 91.0,
    tasksCompletedRate: 88,
    streak: 12,
  },
  {
    rank: 3,
    teacherId: "t4",
    name: "Sneha Nair",
    subject: "Science",
    department: "UP & HS",
    monthlyScore: 84.4,
    tasksCompletedRate: 79,
    streak: 9,
  },
  {
    rank: 4,
    teacherId: "t2",
    name: "Ananya Sharma",
    subject: "English Language",
    department: "UP & HS",
    monthlyScore: 82.0,
    tasksCompletedRate: 75,
    streak: 5,
  },
  {
    rank: 1,
    teacherId: "t5",
    name: "Divya Pillai",
    subject: "General Science",
    department: "LP",
    monthlyScore: 99.0,
    tasksCompletedRate: 100,
    streak: 15,
  },
];
