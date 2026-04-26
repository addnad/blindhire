"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";
import Link from "next/link";

const footerLinks = {
  App: [
    { name: "Browse Roles", href: "/roles" },
    { name: "Post a Role", href: "/employer" },
    { name: "Apply", href: "/candidate" },
    { name: "Dashboard", href: "/dashboard" },
  ],
  Protocol: [
    { name: "Zama FHEVM", href: "https://docs.zama.ai" },
    { name: "Smart Contract", href: "https://sepolia.etherscan.io/address/0xa0bB4e71d0d28068b39DA4c22EFeB8f9A72dfD2e" },
    { name: "OpenZeppelin", href: "https://github.com/OpenZeppelin/openzeppelin-confidential-contracts" },
    { name: "Sepolia Testnet", href: "https://sepolia.etherscan.io" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/addnad/blindhire" },
  { name: "Twitter", href: "#" },
];

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">BlindHire</span>
              </Link>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                Bias-free confidential hiring powered by Fully Homomorphic Encryption on Ethereum. Employers and candidates match without revealing private data.
              </p>

              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.href} target="_blank" rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-mono">
            © 2026 BlindHire · Deployed on Sepolia · 0xa0bB4e71...dfD2e
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Contract live on Sepolia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
