import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-16 text-center justify-center flex-col">
            <h2 className="text-4xl md:text-5xl font-display font-bold">Get In Touch</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-xl">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <a href="mailto:adityadagnihotri7@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                    adityadagnihotri7@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <a href="tel:+918217785285" className="text-muted-foreground hover:text-primary transition-colors">
                    +91 8217785285
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <span className="text-muted-foreground">
                    India
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl flex flex-col justify-center items-center text-center gap-6">
              <h3 className="text-2xl font-bold">Let's Connect</h3>
              <p className="text-muted-foreground">
                Feel free to reach out for collaborations, opportunities, or just a quick chat.
              </p>
              <Button size="lg" className="w-full h-14 text-base group" asChild>
                <a href="mailto:adityadagnihotri7@gmail.com">
                  Say Hello
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
