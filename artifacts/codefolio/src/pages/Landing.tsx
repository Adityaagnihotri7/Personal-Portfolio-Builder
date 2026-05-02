import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Code2, ChevronRight, Zap, Palette, Globe, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">CodeFolio</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            >
              The portfolio builder for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">serious developers.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Stop wrestling with CSS and generic site builders. CodeFolio gives you a blazing fast, premium portfolio that showcases your work the way it deserves to be seen.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                  Start Building Free <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                View Showcase
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Built for Engineering Excellence</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to present yourself as a senior engineer, right out of the box.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Zap, title: "Blazing Fast", desc: "Built on modern tech. Your portfolio loads instantly everywhere." },
                { icon: Terminal, title: "Developer First", desc: "Connect GitHub, list tech stacks, and write markdown." },
                { icon: Palette, title: "Premium Themes", desc: "Dark mode, glassmorphism, minimalism. We have it all." },
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card">
                  <f.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="h-6 w-6" />
            <span className="font-bold text-xl text-foreground">CodeFolio</span>
          </div>
          <p>© {new Date().getFullYear()} CodeFolio. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}