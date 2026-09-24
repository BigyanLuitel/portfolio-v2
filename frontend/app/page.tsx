"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("unreachable"));
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center">
      <p className="font-heading text-2xl">
        Backend status: <span className="text-accent">{status}</span>
      </p>
    </main>
  );
}
