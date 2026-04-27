import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Resume() {
  return (
    <section id="resume" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-top-left -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-4">
            <FileText className="h-8 w-8" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Want to see the full picture?
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Get a comprehensive overview of my experience, skills, and educational background.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Resume Available on Request</DialogTitle>
                <DialogDescription>
                  My full resume is available upon request. Please feel free to reach out to me via email or LinkedIn, and I would be happy to share it with you!
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" asChild>
                  <a href="https://www.linkedin.com/in/aditya-d-8866322bb" target="_blank" rel="noopener noreferrer">
                    Connect on LinkedIn
                  </a>
                </Button>
                <Button asChild>
                  <a href="mailto:adityadagnihotri7@gmail.com">
                    Send Email
                  </a>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}
