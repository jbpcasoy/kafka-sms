"use server";

import { refresh } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { parseStudentForm, type ParseResult } from "@/lib/students";

export type AddStudentState = {
  message: string;
  errors: Extract<ParseResult, { ok: false }>["errors"];
  /** Echoed back so the form keeps what was typed when React resets it. */
  values: Record<string, string>;
};

export async function addStudent(
  _prevState: AddStudentState,
  formData: FormData,
): Promise<AddStudentState> {
  const values = {
    first_name: String(formData.get("first_name") ?? ""),
    last_name: String(formData.get("last_name") ?? ""),
    grade_level: String(formData.get("grade_level") ?? ""),
  };
  const parsed = parseStudentForm(formData);
  if (!parsed.ok) return { message: "", errors: parsed.errors, values };

  const supabase = getSupabase();
  if (!supabase) return { message: "Database is not configured.", errors: {}, values };

  const { error } = await supabase.from("students").insert(parsed.student);
  if (error) {
    console.error("Failed to add student:", error.message);
    return { message: "Could not save the student. Try again.", errors: {}, values };
  }

  refresh();
  return { message: "Student added.", errors: {}, values: {} };
}
