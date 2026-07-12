'use server';

import { supabase } from '../lib/supabase';
import { revalidatePath } from 'next/cache';

// 1. Fetch all teachers from the database
export async function getTeachers() {
  const { data, error } = await supabase.from('teachers').select('*');
  if (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
  // Convert snake_case database columns back to camelCase for our TypeScript interface
  return data.map((t: any) => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    department: t.department,
    isClassTeacher: t.is_class_teacher,
  }));
}

// 2. Submit a new daily report
export async function submitDailyLog(submissionData: any) {
  const { error } = await supabase.from('submissions').insert([{
    id: submissionData.id,
    teacher_id: submissionData.teacherId,
    teacher_name: submissionData.teacherName,
    subject: submissionData.subject,
    department: submissionData.department,
    date: submissionData.date,
    raw_date: submissionData.rawDate,
    status: submissionData.status,
    score: submissionData.score,
    tasks_completed: submissionData.tasksCompleted,
    answers: submissionData.answers,
    notes: submissionData.notes || null,
  }]);

  if (error) {
    console.error('Database insertion failed:', error);
    return { success: false, error: error.message };
  }

  // Tells Vercel to refresh the cache so the admin dashboard shows the new entry immediately!
  revalidatePath('/admin');
  revalidatePath('/teacher');
  return { success: true };
}

// 3. Check if a teacher already submitted today
export async function checkTodaySubmission(teacherId: string, rawDate: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('raw_date', rawDate)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking submission:', error);
  }
  return !!data; // Returns true if a record already exists
}