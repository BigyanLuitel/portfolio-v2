import About from "./components/About";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Services from "./components/Services";
import Projects from "./components/Projects";

import { getProjects } from "./lib/api";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Education />
      <Skills />
      <Services />
      <Projects projects={projects} />
    </>
  );
}
