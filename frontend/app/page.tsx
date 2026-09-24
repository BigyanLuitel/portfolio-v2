import Hero from "./components/Hero";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <>
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <Hero />
    </>
  );
}
