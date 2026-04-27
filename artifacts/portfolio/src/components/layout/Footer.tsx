import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display font-bold text-lg tracking-tight">
            <span className="text-primary">A</span>ditya.
          </span>
          <p className="text-sm text-muted-foreground">
            © {currentYear} Aditya D Agnihotri. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Adityaagnihotri7"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/aditya-d-8866322bb"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:adityadagnihotri7@gmail.com"
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
