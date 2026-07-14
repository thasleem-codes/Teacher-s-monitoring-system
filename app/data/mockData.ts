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