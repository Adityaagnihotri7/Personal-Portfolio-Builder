import { motion } from "framer-motion";
import { Trophy, Star, Target } from "lucide-react";

export function Achievements() {
  const achievements = [
    {
      title: "Top 8 Hackathon Finalist",
      description: "Reached the Top 8 finalist position out of 50+ teams in a competitive hackathon.",
      icon: Trophy,
    },
    {
      title: "AI-Based Real-World System",
      description: "Successfully built and deployed an AI-based system addressing a real-world problem.",
      icon: Star,
    },
    {
      title: "Strong DSA Foundation",
      description: "Consistent practice and strong foundation in Data Structures and Algorithms.",
      icon: Target,
    },
  ];

  return (
    <section id="achievements" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Achievements</h2>
            <div className="h-[1px] flex-grow bg-border mt-2"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border p-8 rounded-2xl text-center flex flex-col items-center gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <achievement.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
