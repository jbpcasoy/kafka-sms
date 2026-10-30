import { describe, expect, it } from "vitest";
import { parseStudentForm } from "./students";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("parseStudentForm", () => {
  it("accepts a valid student and trims names", () => {
    const result = parseStudentForm(
      form({ first_name: "  Test ", last_name: "Student", grade_level: "7" }),
    );
    expect(result).toEqual({
      ok: true,
      student: { first_name: "Test", last_name: "Student", grade_level: 7 },
    });
  });

  it("reports every missing field", () => {
    const result = parseStudentForm(form({}));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["first_name", "grade_level", "last_name"]);
    }
  });

  it.each(["0", "13", "7.5", "seven"])("rejects grade %s", (grade) => {
    const result = parseStudentForm(
      form({ first_name: "Test", last_name: "Student", grade_level: grade }),
    );
    expect(result.ok).toBe(false);
  });
});
