export interface Project {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  approach: string;
  stack: string[];
  results: string | null;
  github_url: string | null;
  live_url: string | null;
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }

  return res.json();
}
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
];

export function getProjectGradient(index: number): string {
  return GRADIENTS[index % GRADIENTS.length];
}