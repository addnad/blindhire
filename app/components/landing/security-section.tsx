"use client";

import { useEffect, useState, useRef } from "react";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Encrypted at input",
    description: "Values are encrypted client-side before they ever leave your browser. The server and contract only ever see ciphertexts.",
  },
  {
    icon: Shield,
    title: "FHE computation",
    description: "The smart contract computes comparisons directly on encrypted data using Zama's FHEVM. No decryption happens mid-computation.",
  },
  {
    icon: Eye,
    title: "Selective reveal",
    description: "FHE.allow() grants each wallet the right to decrypt only their own result. Employers can't see candidate scores. Candidates can't see thresholds.",
  },
  {
    icon: FileCheck,
    title: "On-chain verifiable",
    description: "Every match is recorded on Sepolia. The result is cryptographically bound to your wallet — no middleman, no black box.",
  },
];

const guarantees = ["FHE.gte()", "FHE.and()", "FHE.allow()", "ebool", "euint32", "Sepolia"];

export function SecuritySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="security" ref={sectionRef} className="relative py-24 lg:py-32 bg-foreground/[0.02] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Content */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Privacy model
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              Privacy by
              <br />
              cryptography.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              BlindHire doesn&apos;t ask you to trust a server or a company.
              The privacy guarantees come from the math — Fully Homomorphic
              Encryption running directly on-chain via Zama&apos;s FHEVM.
            </p>

            {/* FHE primitives */}
            <div className="flex flex-wrap gap-3">
              {guarantees.map((item, index) => (
                <span
                  key={item}
                  className={`px-4 py-2 border border-foreground/10 text-sm font-mono transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Features */}
          <div className="grid gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 group ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
