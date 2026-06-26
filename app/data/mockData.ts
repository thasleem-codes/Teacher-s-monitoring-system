// 1. TypeScript Interfaces with our new Department and Day triggers
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

// 2. Mock Teacher Database (All assigned to UP & HS department as requested)
export const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Mohammed Thasleem', subject: 'IT / Computer Science', department: 'UP & HS', isClassTeacher: true },
  { id: 't2', name: 'Ananya Sharma', subject: 'English Language', department: 'UP & HS', isClassTeacher: false },
  { id: 't3', name: 'Rahul Varma', subject: 'Mathematics', department: 'UP & HS', isClassTeacher: true },
  { id: 't4', name: 'Sneha Nair', subject: 'Science', department: 'UP & HS', isClassTeacher: false },
];

// 3. Mock Question Bank (Notice Question 1 is now locked to 'Monday')
export const mockQuestions: Question[] = [
  { id: 'q1', text: 'Did you submit the teacher manual today?', type: 'boolean', group: 'common', day: 'Monday' },
  { id: 'q2', text: 'Did you complete all scheduled IT/Language classes today?', type: 'boolean', group: 'common', day: 'Everyday' },
  { id: 'q3', text: 'As a Class Teacher, did you update the attendance registry?', type: 'boolean', group: 'class_teacher', day: 'Everyday' },
  { id: 'q4', text: "Any specific challenges or remarks from today's sessions?", type: 'text', group: 'common', day: 'Everyday' }
];