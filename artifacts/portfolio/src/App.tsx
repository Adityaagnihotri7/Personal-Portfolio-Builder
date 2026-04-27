import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { motion, useScroll, useSpring } from "framer-motion";

function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left z-50"
        style={{ scaleX }}
      />
      
      <Sidebar />
      
      <main className="flex-1 md:ml-64 relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-24 space-y-32">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
          
          <footer className="pt-20 pb-8 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <p className="text-sm">© 2026 Aditya D Agnihotri</p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 rounded-full glass hover:bg-white/10 transition-colors"
              aria-label="Back to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Portfolio />
    </ThemeProvider>
  );
}

export default App;
