import Hero from "./components/Hero";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted">Projects section coming soon</p>
      </div>
    </>
  );
}
