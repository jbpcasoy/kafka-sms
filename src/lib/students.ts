export type Student = {
  id: string;
  first_name: string;
  last_name: string;
  grade_level: number;
  created_at: string;
};

export type NewStudent = Pick<Student, "first_name" | "last_name" | "grade_level">;

export type ParseResult =
  | { ok: true; student: NewStudent }
  | { ok: false; errors: Partial<Record<keyof NewStudent, string>> };

export const MIN_GRADE = 1;
export const MAX_GRADE = 12;

export function parseStudentForm(formData: FormData): ParseResult {
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const gradeRaw = String(formData.get("grade_level") ?? "").trim();
  const grade = Number(gradeRaw);

  const errors: Partial<Record<keyof NewStudent, string>> = {};
  if (!firstName) errors.first_name = "First name is required.";
  if (!lastName) errors.last_name = "Last name is required.";
  if (!gradeRaw || !Number.isInteger(grade) || grade < MIN_GRADE || grade > MAX_GRADE) {
    errors.grade_level = `Grade must be a whole number from ${MIN_GRADE} to ${MAX_GRADE}.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, student: { first_name: firstName, last_name: lastName, grade_level: grade } };
}
