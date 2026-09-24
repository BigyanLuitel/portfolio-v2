import About from "./components/About";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import { getProjects } from "./lib/api";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Projects projects={projects} />
    </>
  );
}
