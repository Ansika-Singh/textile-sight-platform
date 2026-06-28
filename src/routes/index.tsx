import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Cpu, FileBarChart, Layers, Scan, Sparkles, Workflow, Loader2, Check, Shield, Zap, Globe, Mail, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThreadCounty — AI Textile Analysis & Thread Count Reports" },
      {
        name: "description",
        content:
          "Upload a fabric image and instantly get thread density, warp/weft counts, weave identification and lab-grade reports. Built for mills, designers, and QC teams.",
      },
      { property: "og:title", content: "ThreadCounty — AI Textile Analysis" },
      {
        property: "og:description",
        content:
          "The precision instrument for textile measurement. Automated thread counting and weave identification powered by computer vision.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <PublicLayout>
      <Hero />
      <LogosStrip />
      <ProductOverview />
      <Features />
      <Benefits />
      <Workflow3 />
      <InstrumentPreview />
      <Stats />
      <Testimonials />
      <FaqTeaser />
      <ContactSection />
      <Cta />
    </PublicLayout>
  );
}

function Hero() {
  const words = ["material integrity.", "quality control.", "textile analysis.", "weave structure."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0 grid-pattern opacity-50 animate-grid-shift" aria-hidden />
      
      {/* Floating Dialog Boxes */}
      <div className="absolute top-20 left-10 hidden lg:block animate-float" style={{ animationDelay: "0ms", animationDuration: "6s" }}>
        <div className="rounded-md border border-border bg-card/80 backdrop-blur-md p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Weave Detected</span>
          </div>
          <div className="mt-1 font-semibold text-sm">Jacquard (Complex)</div>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-1/4 hidden lg:block animate-float" style={{ animationDelay: "2000ms", animationDuration: "7s" }}>
        <div className="rounded-md border border-border bg-card/80 backdrop-blur-md p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <Scan className="size-4 text-brand" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Confidence</span>
          </div>
          <div className="mt-1 font-semibold text-sm text-brand">99.85%</div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-12 lg:items-center lg:py-32">
        <div className="lg:col-span-6 relative z-10">
          <div className="tag mb-6 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <span className="size-1.5 rounded-full bg-brand animate-pulse" />
            v2.4 · Real-time Optical Analysis
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            The metric of <br className="hidden lg:block" />
            <span className="text-brand inline-block min-w-[300px] transition-all duration-500 ease-in-out opacity-100 translate-y-0" key={index} style={{ animation: "fade-in-up 0.5s ease-out" }}>
              {words[index]}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Automated thread density, warp/weft validation and weave identification for
            high-precision textile manufacturing and quality control.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-sm bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-semibold tracking-wide"
            >
              <Link to="/auth" search={{ mode: "signup" }}>
                Start free analysis <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-sm border-border bg-card hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-semibold tracking-wide"
            >
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8 text-sm animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Latency
              </dt>
              <dd className="mt-1 font-mono text-xl text-foreground">1.2s</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Accuracy
              </dt>
              <dd className="mt-1 font-mono text-xl text-foreground">99.8%</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Samples
              </dt>
              <dd className="mt-1 font-mono text-xl text-foreground">4.2M+</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6 animate-fade-in-up relative z-10" style={{ animationDelay: "200ms" }}>
          <HeroLoupe />
        </div>
      </div>
    </section>
  );
}

function HeroLoupe() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl animate-in fade-in zoom-in-95 duration-1000 hover:scale-[1.03] transition-all duration-700 hover:shadow-2xl">
      <div className="absolute inset-0 rounded-full border border-border bg-surface shadow-instrument" />
      
      {/* Slowly Rotating Weave Grid */}
      <div className="absolute inset-6 overflow-hidden rounded-full weave-pattern bg-surface-2 spin-slow opacity-50" />
      
      {/* Pulsing Light Beam */}
      <div className="absolute inset-6 overflow-hidden rounded-full bg-brand/5 beam-pulse" />
      <div className="absolute inset-6 rounded-full ring-1 ring-inset ring-border" />
      
      {/* Scanning Laser Line */}
      <div className="absolute left-6 right-6 h-0.5 bg-brand shadow-[0_0_10px_var(--color-brand)] scan-laser z-10" />

      {/* Crosshairs */}
      <div className="absolute left-0 top-1/2 h-px w-full bg-brand/20" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-brand/20" />
      
      {/* Callouts */}
      <div className="absolute right-[18%] top-[18%] z-20">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] font-medium text-brand">WARP · 88 /cm</span>
          <span className="block h-px w-16 bg-brand transition-all duration-1000" />
        </div>
      </div>
      <div className="absolute bottom-[18%] left-[18%] z-20">
        <div className="flex flex-col items-start gap-1">
          <span className="block h-px w-16 bg-brand transition-all duration-1000" />
          <span className="font-mono text-[10px] font-medium text-brand">WEFT · 72 /cm</span>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/60 bg-background/85 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand backdrop-blur z-20 pulse-border">
        Mag 400×
      </div>
    </div>
  );
}

function LogosStrip() {
  return (
    <section className="border-b border-border bg-surface overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground animate-fade-in-up">
          Trusted by 500+ mills, designers and research labs
        </span>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <span className="hover:text-foreground transition-colors duration-300">Loomworks</span>
          <span className="hover:text-foreground transition-colors duration-300">Spindle &amp; Co</span>
          <span className="hover:text-foreground transition-colors duration-300">Atelier 19</span>
          <span className="hover:text-foreground transition-colors duration-300">Fibratec</span>
          <span className="hover:text-foreground transition-colors duration-300">NIFT Labs</span>
        </div>
      </div>
    </section>
  );
}

function ProductOverview() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <ScrollReveal direction="left">
          <div className="tag mb-4">Product Overview</div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            One platform for textile measurement and quality control.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            ThreadCounty replaces manual magnifier inspections with AI-powered optical analysis.
            Upload a macro fabric photo from your phone or lab camera and receive warp/weft counts,
            weave identification, confidence scores and downloadable lab reports in seconds.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Manufacturers & mills", "Students & researchers", "QC professionals", "Design studios"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-brand shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={150}>
          <div className="rounded-md border border-border bg-card p-8 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Avg. analysis time", value: "< 30s" },
                { label: "Supported formats", value: "JPG · PNG" },
                { label: "Weave types", value: "12+" },
                { label: "Accuracy", value: "99.8%" },
              ].map((s) => (
                <div key={s.label} className="rounded-sm border border-border bg-surface p-4">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-lg font-semibold">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Zap, title: "85% faster inspections", body: "Replace hours of manual counting with sub-second optical scans." },
    { icon: Shield, title: "Lab-grade accuracy", body: "Benchmarked against ISO 7211 microscope counts on standard wovens." },
    { icon: Globe, title: "Works anywhere", body: "Browser-based — no special hardware. Upload from mill floor or classroom." },
    { icon: FileBarChart, title: "Audit-ready reports", body: "Download PDF compliance reports with confidence scores and weave data." },
  ];
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <div className="tag mb-4">Benefits</div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why teams choose ThreadCounty.</h2>
          </div>
        </ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((b, i) => {
            const Icon = b.icon;
            return (
              <ScrollReveal key={b.title} delay={i * 80}>
                <div className="rounded-md border border-border bg-card p-6 h-full hover:border-brand/40 transition-colors">
                  <Icon className="size-5 text-brand" />
                  <h3 className="mt-4 font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Scan,
    title: "Automated thread counting",
    body:
      "AI detects and counts warp/weft threads across woven and knitted structures with sub-millimeter precision.",
  },
  {
    icon: Layers,
    title: "Weave structure recognition",
    body:
      "Identify plain, twill, satin, dobby and jacquard constructions automatically from a single photograph.",
  },
  {
    icon: FileBarChart,
    title: "Compliance reports",
    body:
      "Generate ISO-aligned PDF lab reports with statistical variances, weave diagrams and confidence intervals.",
  },
  {
    icon: Cpu,
    title: "Vision 2.0 engine",
    body:
      "Trained on 4.2M textile samples across cotton, linen, denim, silk and synthetic blends.",
  },
  {
    icon: Boxes,
    title: "Batch + archive",
    body:
      "Bulk upload entire production batches, search the archive by fabric type and export historical trends.",
  },
  {
    icon: Sparkles,
    title: "AI suggestions",
    body:
      "Get actionable QC notes — loom tensioner alerts, shrinkage tolerances and grade recommendations.",
  },
];

function Features() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-16 max-w-2xl">
            <div className="tag mb-4">Capabilities</div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Engineered for modern textile production.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Reduce inspection time by 85% with computer vision models specifically trained on
              textile libraries — from raw fiber inspection to finished fabric audits.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <ScrollReveal key={f.title} delay={i * 80} duration={500}>
                <div className="bg-card p-8 h-full border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand/30 group">
                  <Icon className="size-5 text-brand transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  <h3 className="mt-6 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", t: "Upload sample", d: "Drag a JPG or PNG of your fabric — macro, scan or phone photo." },
  { n: "02", t: "Vision analysis", d: "Our engine isolates warp/weft and identifies the weave structure." },
  { n: "03", t: "Receive report", d: "Get a lab-grade report with metrics, confidence and AI suggestions." },
];

function Workflow3() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <div className="tag mb-4">
                <Workflow className="size-3 animate-pulse" /> Workflow
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From sample to report in seconds.</h2>
            </div>
          </div>
        </ScrollReveal>
        <ol className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 120} duration={500}>
              <li className="bg-card p-8 h-full transition-all duration-300 hover:bg-surface/50 group">
                <div className="font-mono text-xs font-medium text-brand transition-transform duration-300 group-hover:translate-x-1">[ {s.n} ]</div>
                <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SWATCHES = [
  {
    id: "cotton",
    name: "Cotton Twill Swatch",
    type: "Twill 2/1 Cotton",
    density: 152,
    warp: 80,
    weft: 72,
    confidence: 99.8,
    scanId: "TC-8892",
    date: "2026-06-26 14:02",
    patternClass: "weave-pattern bg-[oklch(0.14_0.012_240)]",
    insights: [
      "Slight tension variance in weft quadrant B4.",
      "Consistency score 98.4% vs reference swatch.",
      "Recommended wash-shrinkage tolerance: 1.2%.",
    ]
  },
  {
    id: "denim",
    name: "Heavy Indigo Denim",
    type: "Twill 3/1 Indigo Denim",
    density: 112,
    warp: 62,
    weft: 50,
    confidence: 99.2,
    scanId: "DN-4771",
    date: "2026-06-27 10:15",
    patternClass: "bg-radial from-[oklch(0.35_0.08_240)] to-[oklch(0.20_0.05_240)] bg-[size:12px_12px] bg-[oklch(0.14_0.012_240)]",
    insights: [
      "Heavy warp thread yarn density detected.",
      "Loom tension alignment meets Grade-A specifications.",
      "Weft slub-count variance is within standard 0.05% margin.",
    ]
  },
  {
    id: "linen",
    name: "Raw Flax Linen",
    type: "Plain Weave Flax",
    density: 96,
    warp: 48,
    weft: 48,
    confidence: 98.7,
    scanId: "LN-9082",
    date: "2026-06-27 11:30",
    patternClass: "bg-[linear-gradient(45deg,oklch(0.22_0.012_240)_25%,transparent_25%),linear-gradient(-45deg,oklch(0.22_0.012_240)_25%,transparent_25%)] bg-[size:18px_18px] bg-[oklch(0.14_0.012_240)]",
    insights: [
      "Organic thickness fluctuations detected in flax fibers.",
      "Pore density distribution: 14% breathability coefficient.",
      "Thread count verified under ISO 7211-2 standards.",
    ]
  },
  {
    id: "silk",
    name: "Mulberry Silk Satin",
    type: "Satin 5-Harness Silk",
    density: 220,
    warp: 120,
    weft: 100,
    confidence: 99.9,
    scanId: "SL-3114",
    date: "2026-06-27 12:05",
    patternClass: "bg-gradient-to-tr from-[oklch(0.25_0.04_300)] via-[oklch(0.18_0.02_240)] to-[oklch(0.28_0.04_195)] bg-[size:200%_200%] animate-pulse duration-[6000ms]",
    insights: [
      "Ultra-fine filament diameter detected (average 12 microns).",
      "Float length regularity: 99.95% accuracy.",
      "Perfect satin luster rating (Gloss factor: 88).",
    ]
  }
];

function InstrumentPreview() {
  const [activeSwatch, setActiveSwatch] = useState(SWATCHES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [displayDensity, setDisplayDensity] = useState(0);
  const [displayWarp, setDisplayWarp] = useState(0);
  const [displayWeft, setDisplayWeft] = useState(0);
  const [displayConfidence, setDisplayConfidence] = useState(0);

  const runCountingAnimation = (targetDensity: number, targetWarp: number, targetWeft: number, targetConfidence: number) => {
    setIsScanning(true);
    setDisplayDensity(0);
    setDisplayWarp(0);
    setDisplayWeft(0);
    setDisplayConfidence(0);

    const duration = 1200; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      setDisplayDensity(Math.round(targetDensity * easeProgress));
      setDisplayWarp(Math.round(targetWarp * easeProgress));
      setDisplayWeft(Math.round(targetWeft * easeProgress));
      setDisplayConfidence(Number((targetConfidence * easeProgress).toFixed(1)));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayDensity(targetDensity);
        setDisplayWarp(targetWarp);
        setDisplayWeft(targetWeft);
        setDisplayConfidence(targetConfidence);
        setIsScanning(false);
      }
    }, intervalTime);
  };

  useEffect(() => {
    runCountingAnimation(activeSwatch.density, activeSwatch.warp, activeSwatch.weft, activeSwatch.confidence);
  }, [activeSwatch]);

  return (
    <section className="border-b border-border bg-foreground py-24 text-background">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <div className="tag mb-4 bg-white/10 text-background/70">The Interface</div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                A dedicated environment for textile verification.
              </h2>
              <p className="mt-4 text-sm text-background/60">
                Replace manual counting with 99.8% accurate computer vision. Choose a swatch below to run a real-time scanning simulation.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal duration={800}>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[oklch(0.18_0.012_240)] shadow-2xl">
            {/* Swatch Selector Tab Header */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-4 bg-neutral-900 overflow-x-auto">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-background/40 mr-2">Select Specimen Swatch:</span>
              {SWATCHES.map((sw) => (
                <button
                  key={sw.id}
                  onClick={() => {
                    if (!isScanning) setActiveSwatch(sw);
                  }}
                  disabled={isScanning}
                  className={`rounded-sm px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all duration-300 ${
                    isScanning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } ${
                    activeSwatch.id === sw.id
                      ? "border-brand bg-brand text-brand-foreground shadow-[0_0_8px_oklch(0.50_0.10_195/0.4)]"
                      : "border-white/10 bg-white/[0.02] text-background/60 hover:border-white/30 hover:text-background"
                  }`}
                >
                  {sw.name}
                </button>
              ))}
            </div>

            <div className="grid gap-px bg-white/10 lg:grid-cols-[1fr_320px]">
              <div className="bg-[oklch(0.18_0.012_240)] p-6 lg:p-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-background/50">
                      SCAN_ID · {activeSwatch.scanId}
                    </span>
                    <span className={`rounded-sm px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300 ${
                      isScanning ? "bg-yellow-500/20 text-yellow-500" : "bg-brand/20 text-brand animate-pulse"
                    }`}>
                      {isScanning ? "Scanning..." : "Verified"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-background/40">
                    {activeSwatch.date}
                  </span>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 bg-[oklch(0.14_0.012_240)] shadow-inner">
                    {/* The texture preview */}
                    <div className={`absolute inset-0 transition-all duration-700 ${activeSwatch.patternClass}`} />
                    
                    {/* Grid mesh */}
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    
                    {/* Sweeping scan laser */}
                    {isScanning && (
                      <div className="absolute left-0 right-0 h-0.5 bg-brand shadow-[0_0_12px_var(--color-brand)] scan-laser z-10" />
                    )}

                    {/* Scanning radar visual */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
                      <div className={`size-16 rounded-full border border-brand/40 flex items-center justify-center ${isScanning ? "animate-ping" : "animate-pulse"}`} />
                      <div className="absolute size-3 rounded-full border border-brand bg-brand/20" />
                    </div>

                    {/* Detected coordinate locks */}
                    {!isScanning && (
                      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 animate-in fade-in">
                        <span className="absolute left-[35%] top-[45%] size-1.5 rounded-full bg-brand animate-ping" />
                        <span className="absolute left-[65%] top-[55%] size-1.5 rounded-full bg-brand animate-ping" style={{ animationDelay: "450ms" }} />
                        <span className="absolute left-[50%] top-[30%] size-1.5 rounded-full bg-brand animate-ping" style={{ animationDelay: "900ms" }} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    <Metric label="Thread Density" value={displayDensity.toString()} unit="TPI" bar={displayDensity / 240} />
                    <div className="grid grid-cols-2 gap-3">
                      <Mini label="Warp" value={`${displayWarp} /cm`} />
                      <Mini label="Weft" value={`${displayWeft} /cm`} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Mini label="Fabric Type" value={activeSwatch.type} />
                      <Mini label="Confidence" value={`${displayConfidence}%`} accent={!isScanning} />
                    </div>
                    <button className={`w-full rounded-sm py-3 font-mono text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                      isScanning 
                        ? "bg-white/10 text-background/40 cursor-not-allowed" 
                        : "bg-background text-foreground hover:bg-brand hover:text-brand-foreground hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                    }`}>
                      {isScanning ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="size-3 animate-spin text-brand" /> Processing...
                        </span>
                      ) : (
                        "Export Swatch Specs (PDF)"
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <aside className="bg-[oklch(0.14_0.012_240)] p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-background/40">AI Insights & QC</span>
                  <ul className="mt-4 space-y-4 text-[13px] leading-relaxed text-background/70">
                    {activeSwatch.insights.map((ins, idx) => (
                      <li 
                        key={idx} 
                        className={`transition-all duration-500 transform ${
                          isScanning ? "opacity-30 translate-x-2" : "opacity-100 translate-x-0"
                        }`}
                        style={{ transitionDelay: `${idx * 150}ms` }}
                      >
                        <span className="text-brand mr-2 font-bold">+</span>
                        {ins}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 border-t border-white/10 pt-4 font-mono text-[9px] text-background/30 text-right">
                  THREADCOUNT VISION V2.4
                </div>
              </aside>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Metric({ label, value, unit, bar }: { label: string; value: string; unit?: string; bar: number }) {
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-background/50">{label}</span>
      <div className="mt-1 font-mono text-3xl tracking-tight text-background">
        {value} {unit && <span className="text-xs text-background/40">{unit}</span>}
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden bg-white/10">
        <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${bar * 100}%` }} />
      </div>
    </div>
  );
}
function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-sm border border-white/10 bg-white/[0.03] px-3 py-2 transition-all duration-300 hover:bg-white/[0.06]">
      <div className="font-mono text-[10px] uppercase tracking-widest text-background/40">{label}</div>
      <div className={`mt-0.5 text-sm font-medium ${accent ? "text-brand" : "text-background"}`}>{value}</div>
    </div>
  );
}

function Stats() {
  const items = [
    ["12M+", "Fibers analyzed"],
    ["0.2s", "Processing latency"],
    ["99.8%", "Detection accuracy"],
    ["140+", "Fabric variants"],
  ] as const;
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {items.map(([v, l], i) => (
          <ScrollReveal key={l} delay={i * 100} duration={500}>
            <div>
              <div className="text-4xl font-semibold tracking-tight text-foreground transition-all hover:text-brand hover:scale-105 duration-300 origin-left inline-block">{v}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{l}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

const QUOTES = [
  {
    q: "We replaced a 20-minute manual count with a 2-second scan. The reports go straight into our QC pipeline.",
    n: "Anika Roy",
    r: "Head of Quality, Loomworks Mills",
  },
  {
    q: "The weave-recognition is the part that surprised me — it caught a satin variant we'd been misclassifying for months.",
    n: "Marc Geffroy",
    r: "Design Director, Atelier 19",
  },
  {
    q: "For research it's a game-changer. We process entire archive scans overnight.",
    n: "Dr. Priya Subramaniam",
    r: "Textile Research, NIFT",
  },
];

function Testimonials() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="tag mb-4">Field Reports</div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What practitioners say.
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <ScrollReveal key={q.n} delay={i * 120} duration={500}>
              <figure className="bg-card p-8 h-full border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand/20">
                <blockquote className="text-[15px] leading-relaxed text-foreground">"{q.q}"</blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <div className="text-sm font-semibold">{q.n}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{q.r}</div>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqTeaser() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_2fr]">
        <ScrollReveal direction="left" distance="20px">
          <div>
            <div className="tag mb-4">FAQ</div>
            <h2 className="text-3xl font-semibold tracking-tight">Questions, answered.</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              See the full FAQ for details on accuracy, formats, plans and account management.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Link to="/faq">Browse all FAQs <ArrowRight className="ml-1 size-4" /></Link>
            </Button>
          </div>
        </ScrollReveal>
        <div className="divide-y divide-border border-y border-border">
          {[
            ["What image formats are supported?", "JPG, PNG and JPEG up to 10MB per image."],
            ["How accurate is the analysis?", "Benchmark at 99.8% alignment with laboratory microscope counts on standard woven fabrics."],
            ["Can I cancel my subscription?", "Yes — cancel any time from your profile. You keep access until the end of the current period."],
          ].map(([q, a], i) => (
            <ScrollReveal key={q} delay={i * 100} duration={500} direction="right" distance="15px">
              <div className="grid gap-4 py-6 md:grid-cols-[1fr_1.5fr] group hover:bg-surface/30 px-2 rounded-sm transition-all duration-300">
                <dt className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">{q}</dt>
                <dd className="text-sm text-muted-foreground">{a}</dd>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="border-b border-border bg-surface py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
        <ScrollReveal direction="left">
          <div className="tag mb-4">Contact</div>
          <h2 className="text-3xl font-semibold tracking-tight">Ready to modernize your textile QC?</h2>
          <p className="mt-4 text-muted-foreground">
            Talk to our team about enterprise deployments, research partnerships or student programs.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <a href="mailto:hello@threadcounty.com" className="flex items-center gap-2 font-medium hover:text-brand transition-colors">
              <Mail className="size-4 text-brand" /> hello@threadcounty.com
            </a>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 text-brand shrink-0" />
              14 Loom Street, 4th Floor · Bangalore, India 560001
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={100}>
          <div className="rounded-md border border-border bg-card p-8">
            <p className="text-sm text-muted-foreground mb-6">
              Send us a message or visit the full contact page for the form.
            </p>
            <Button asChild className="rounded-sm bg-foreground text-background hover:bg-foreground/90">
              <Link to="/contact">Go to contact page <ArrowRight className="ml-1 size-4" /></Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Begin your first analysis in under a minute.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Sign up free, upload a fabric image, and receive a complete report. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-sm bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-semibold tracking-wide"
            >
              <Link to="/auth" search={{ mode: "signup" }}>
                Create free account <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Link to="/contact">Talk to sales</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

