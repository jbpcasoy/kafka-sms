"use client";

import { useActionState } from "react";
import { MAX_GRADE, MIN_GRADE } from "@/lib/students";
import { addStudent, type AddStudentState } from "./actions";

const initialState: AddStudentState = { message: "", errors: {}, values: {} };

const inputClass = "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700";

export function AddStudentForm() {
  const [state, formAction, pending] = useActionState(addStudent, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        First name
        <input
          name="first_name"
          autoComplete="off"
          defaultValue={state.values.first_name}
          className={inputClass}
        />
        {state.errors.first_name && <span className="text-red-600">{state.errors.first_name}</span>}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Last name
        <input
          name="last_name"
          autoComplete="off"
          defaultValue={state.values.last_name}
          className={inputClass}
        />
        {state.errors.last_name && <span className="text-red-600">{state.errors.last_name}</span>}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Grade
        <input
          name="grade_level"
          type="number"
          inputMode="numeric"
          min={MIN_GRADE}
          max={MAX_GRADE}
          defaultValue={state.values.grade_level}
          className={inputClass}
        />
        {state.errors.grade_level && (
          <span className="text-red-600">{state.errors.grade_level}</span>
        )}
      </label>
      <button
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Saving…" : "Add student"}
      </button>
      <p aria-live="polite" className="text-sm">
        {state.message}
      </p>
    </form>
  );
}
