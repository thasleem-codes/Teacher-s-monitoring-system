"use server";

import { supabase } from "../lib/supabase";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. TEACHER DIRECTORY ACTIONS
// ==========================================
export async function getTeachers() {
  const { data, error } = await supabase.from("teachers").select("*");
  if (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
  return data.map((t: any) => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    department: t.department,
    isClassTeacher: t.is_class_teacher,
    assignedClasses: t.assigned_classes || "",
  }));
}

export async function addTeacherToDb(teacher: any) {
  const { data, error } = await supabase.from("teachers").insert([
    {
      id: teacher.id,
      name: teacher.name,
      subject: teacher.subject,
      department: teacher.department,
      is_class_teacher: teacher.isClassTeacher,
      assigned_classes: teacher.assignedClasses,
    },
  ]);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin");
  return { success: true, data };
}

export async function deleteTeacherFromDb(id: string) {
  // 1. First, delete all daily log submissions associated with this teacher
  const { error: submissionsError } = await supabase
    .from("submissions")
    .delete()
    .eq("teacher_id", id);

  if (submissionsError) {
    console.error("Error deleting submissions for teacher:", submissionsError);
    return { success: false, error: "Failed to delete teacher's response history." };
  }

  // 2. Then, delete the teacher from the directory
  const { error: teacherError } = await supabase
    .from("teachers")
    .delete()
    .eq("id", id);

  if (teacherError) {
    console.error("Error deleting teacher:", teacherError);
    return { success: false, error: teacherError.message };
  }

  revalidatePath("/admin");
  revalidatePath("/teacher");
  return { success: true };
}

// ==========================================
// 2. QUESTION STUDIO ACTIONS
// ==========================================
export async function getQuestions() {
  const { data, error } = await supabase.from("questions").select("*");
  if (error) return [];
  return data.map((q: any) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    group: q.group_name,
    points: q.points,
    day: q.day,
    scale_limit: q.scale_limit, // Add this
    custom_options: q.custom_options, // Add this
  }));
}

export async function saveQuestionToDb(question: any) {
  const { error } = await supabase.from("questions").upsert([
    {
      id: question.id,
      text: question.text,
      type: question.type,
      group_name: question.group,
      points: question.points,
      day: question.day,
      scale_limit: question.scale_limit, // Add this
      custom_options: question.custom_options, // Add this
    },
  ]);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/teacher");
  return { success: true };
}

export async function deleteQuestionFromDb(id: string) {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/teacher");
  return { success: true };
}

// ==========================================
// 3. DAILY SUBMISSION & AUDIT ACTIONS
// ==========================================
export async function getSubmissions() {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
  return data.map((s: any) => ({
    id: s.id,
    teacherId: s.teacher_id,
    teacherName: s.teacher_name,
    subject: s.subject,
    department: s.department,
    date: s.date,
    rawDate: s.raw_date,
    status: s.status,
    score: s.score,
    tasksCompleted: s.tasks_completed,
    answers: s.answers,
    isOverridden: s.is_overridden,
    adminNotes: s.admin_notes,
    notes: s.notes,
  }));
}

export async function submitDailyLog(submissionData: any) {
  const { error } = await supabase.from("submissions").insert([
    {
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
    },
  ]);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/teacher");
  return { success: true };
}

export async function updateSubmissionOverride(
  id: string,
  score: number,
  status: string,
  adminNotes: string,
) {
  const { error } = await supabase
    .from("submissions")
    .update({
      score: score,
      status: status,
      is_overridden: true,
      admin_notes: adminNotes,
    })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function checkTodaySubmission(teacherId: string, rawDate: string) {
  const { data, error } = await supabase
    .from("submissions")
    .select("id")
    .eq("teacher_id", teacherId)
    .eq("raw_date", rawDate)
    .maybeSingle();
  if (error && error.code !== "PGRST116")
    console.error("Error checking submission:", error);
  return !!data;
}

// ==========================================
// ADD THIS TO actions.ts
// ==========================================
export async function updateTeacherInDb(teacher: any) {
  const { error } = await supabase
    .from("teachers")
    .update({
      name: teacher.name,
      subject: teacher.subject,
      department: teacher.department,
      is_class_teacher: teacher.isClassTeacher,
      assigned_classes: teacher.assignedClasses,
    })
    .eq("id", teacher.id);

  if (error) {
    console.error("Error updating teacher:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/teacher");
  return { success: true };
}
