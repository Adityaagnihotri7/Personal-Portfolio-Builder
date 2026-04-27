import { motion } from "framer-motion";
import { User, Code2, Cpu } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">About Me</h2>
            <div className="h-[1px] flex-grow bg-border mt-2"></div>
          </div>

          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm a Computer Science student focused on becoming a high-impact Software Developer. I specialize in Java, Data Structures & Algorithms, and building real-world projects including AI-powered systems.
              </p>
              <p>
                I've worked on innovative solutions and reached the Top 8 in a competitive hackathon. Currently, I'm strengthening DSA, building scalable projects, and preparing for top product-based companies.
              </p>
            </div>

            <div className="md:col-span-4 grid gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Software Dev</h3>
                  <p className="text-sm text-muted-foreground mt-1">Building robust applications</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI / ML</h3>
                  <p className="text-sm text-muted-foreground mt-1">Intelligent solutions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
