"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { ConnectWallet } from "@/components/connect-button";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

const navLinks = [
  { name: "Process", href: "/#how-it-works" },
  { name: "Features", href: "/features" },
  { name: "Browse Roles", href: "/roles" },
  { name: "Dashboard", href: "/dashboard" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed z-50 transition-all duration-500 ${isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"}`}>
      <nav className={`mx-auto transition-all duration-500 ${isScrolled || isMobileMenuOpen ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]" : "bg-transparent max-w-[1400px]"}`}>
        <div className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${isScrolled ? "h-14" : "h-20"}`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/icon.svg" alt="BlindHire" width={24} height={24} className="rounded-md" />
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>BlindHire</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 flex items-center justify-center border border-foreground/10 hover:border-foreground/30 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <ConnectWallet />
            <Button asChild size="sm" className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}>
              <Link href="/employer">Post a Role</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ top: 0 }}>
        <div className="flex flex-col h-full px-8 pt-8 pb-8"><div className="flex justify-end"><button onClick={() => setIsMobileMenuOpen(false)} className="p-2" aria-label="Close menu"><X className="w-6 h-6" /></button></div>
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}>
                {link.name}
              </Link>
            ))}
          </div>
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-14 h-14 flex items-center justify-center border border-foreground/10"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <Button asChild variant="outline" className="flex-1 rounded-full h-14 text-base" onClick={() => setIsMobileMenuOpen(false)}>
              <Link href="/candidate">Apply</Link>
            </Button>
            <Button asChild className="flex-1 bg-foreground text-background rounded-full h-14 text-base" onClick={() => setIsMobileMenuOpen(false)}>
              <Link href="/employer">Post a Role</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
