import { motion } from "framer-motion";
import { SiPython, SiJavascript, SiGit, SiGithub, SiFigma } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { Code2 } from "lucide-react";

export function Skills() {
  const skillCategories = [
    {
      title: "Languages",
      skills: [
        { name: "Java", icon: FaJava },
        { name: "Python", icon: SiPython },
        { name: "C", icon: Code2 },
        { name: "JavaScript", icon: SiJavascript },
      ],
    },
    {
      title: "Core CS",
      skills: [
        { name: "DSA" },
        { name: "OOP" },
        { name: "DBMS" },
        { name: "OS" },
      ],
    },
    {
      title: "Tools",
      skills: [
        { name: "Git", icon: SiGit },
        { name: "GitHub", icon: SiGithub },
        { name: "VS Code", icon: VscVscode },
        { name: "Figma", icon: SiFigma },
      ],
    },
    {
      title: "Other",
      skills: [
        { name: "Basic AI/ML" },
        { name: "Prompt Engineering" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="skills" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Technical Skills</h2>
            <div className="h-[1px] flex-grow bg-border mt-2"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 gap-8"
          >
            {skillCategories.map((category, index) => (
              <motion.div key={index} variants={itemVariants} className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors cursor-default"
                    >
                      {skill.icon && <skill.icon className="w-4 h-4" />}
                      {skill.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
