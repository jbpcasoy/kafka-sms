import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold">School Management</h1>
      <nav className="flex flex-col gap-2">
        <Link
          href="/students"
          className="rounded-lg border border-zinc-300 px-4 py-3 font-medium dark:border-zinc-700"
        >
          Students →
        </Link>
      </nav>
    </main>
  );
}
