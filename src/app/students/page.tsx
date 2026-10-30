import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { Student } from "@/lib/students";
import { AddStudentForm } from "./add-student-form";

export const metadata: Metadata = { title: "Students" };

async function StudentList() {
  await connection();
  const supabase = getSupabase();
  if (!supabase) {
    return (
      <p className="text-sm text-amber-700 dark:text-amber-400">
        Database not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY (see docs/phone-workflow.md).
      </p>
    );
  }

  const { data, error } = await supabase
    .from("students")
    .select("id, first_name, last_name, grade_level, created_at")
    .order("last_name")
    .returns<Student[]>();

  if (error) {
    console.error("Failed to load students:", error.message);
    return <p className="text-sm text-red-600">Could not load students.</p>;
  }
  if (data.length === 0) return <p className="text-sm text-zinc-500">No students yet.</p>;

  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {data.map((student) => (
        <li key={student.id} className="flex justify-between py-2">
          <span>
            {student.last_name}, {student.first_name}
          </span>
          <span className="text-zinc-500">Grade {student.grade_level}</span>
        </li>
      ))}
    </ul>
  );
}

export default function StudentsPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Students</h1>
      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Add a student</h2>
        <AddStudentForm />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="font-medium">All students</h2>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <StudentList />
        </Suspense>
      </section>
    </main>
  );
}
