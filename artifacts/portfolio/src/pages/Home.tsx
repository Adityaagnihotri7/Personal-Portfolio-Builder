import { motion, useScroll } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Resume } from "@/components/sections/Resume";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Resume />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
