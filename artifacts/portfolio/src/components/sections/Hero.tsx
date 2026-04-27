import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[100dvh] flex flex-col justify-center relative overflow-hidden pt-20"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary font-mono text-sm md:text-base font-medium tracking-wider uppercase mb-4">
              Hi, my name is
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-4">
              Aditya D Agnihotri.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-muted-foreground mb-6">
              Software Developer | Java • DSA • AI Projects
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              I build scalable solutions and AI-powered applications that solve real-world problems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button size="lg" asChild className="font-medium group">
              <a href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="font-medium group">
              <a href="#resume">
                <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                Download Resume
              </a>
            </Button>
            <Button size="lg" variant="ghost" asChild className="font-medium">
              <a href="#contact">Contact</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
