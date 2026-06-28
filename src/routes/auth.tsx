import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

import { toast } from "sonner";

type Mode = "login" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode === "signup" || s.mode === "forgot" ? s.mode : "login") as Mode,
    code: s.code as string | undefined,
    error: s.error as string | undefined,
    error_description: s.error_description as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — ThreadCounty" },
      { name: "description", content: "Sign in or create your ThreadCounty account to start analyzing fabric samples." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();

  // Redirect signed-in users away
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-12 bg-[#FBFBFA] selection:bg-brand/10 selection:text-brand-dark overflow-hidden relative">
      {/* Decorative gradient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-brand/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-[#14B8A6]/5 blur-[100px] pointer-events-none" />
      
      {/* Left panel: Auth forms */}
      <div className="lg:col-span-5 flex flex-col p-6 sm:p-10 lg:p-12 justify-between z-10 min-h-screen">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Back to site <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {mode === "forgot" ? (
                <ForgotForm />
              ) : mode === "signup" ? (
                <SignupForm />
              ) : (
                <LoginForm />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
          © {new Date().getFullYear()} ThreadCounty Labs · Intelligent Metrology
        </div>
      </div>

      {/* Right panel: Premium Inspections Dashboard Mockup */}
      <aside className="lg:col-span-7 relative hidden overflow-hidden border-l border-border bg-neutral-950 lg:flex flex-col justify-between p-12 text-white">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-brand/5 blur-[150px] pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400/80 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand animate-pulse" />
            Inspection System Active
          </div>
          <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            v2.4.92 / SECURE
          </div>
        </div>

        {/* Live scanning mockup container */}
        <div className="relative flex-1 flex flex-col justify-center items-center py-6 z-10">
          <div className="relative w-full max-w-md aspect-square rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-md shadow-2xl p-6 flex flex-col justify-between overflow-hidden group">
            {/* Ambient HUD grid lines */}
            <div className="absolute inset-0 border border-white/5 m-4 pointer-events-none rounded opacity-30" />
            
            {/* Upper tags */}
            <div className="flex justify-between items-center z-10 font-mono text-[9px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="size-1 bg-[#14B8A6] rounded-full animate-ping" />
                Live spec: Twill_Weave_04
              </span>
              <span>MAG: 400X</span>
            </div>

            {/* Scanning Scope */}
            <div className="relative w-48 h-48 my-auto mx-auto rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
              {/* Rotating target grid */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-[spin_20s_linear_infinite]" 
                   style={{ backgroundImage: "radial-gradient(circle, rgba(20,184,166,0.1) 1px, transparent 1px)", backgroundSize: "12px 12px" }} 
              />
              
              {/* Scanning sweep beam */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#14B8A6]/60 to-transparent shadow-[0_0_10px_#14B8A6] animate-[bounce_4s_ease-in-out_infinite]" />
              
              {/* Core focus reticle */}
              <div className="size-32 rounded-full border border-brand/20 border-dashed animate-[spin_40s_linear_infinite]" />
              <div className="absolute size-4 border border-brand/40 rounded-full" />
              <div className="absolute w-6 h-px bg-[#14B8A6]/50" />
              <div className="absolute h-6 w-px bg-[#14B8A6]/50" />
              
              {/* Circular scope data indicator */}
              <svg className="absolute inset-0 size-full -rotate-90 opacity-40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="#14B8A6" strokeWidth="1" strokeDasharray="10 30" />
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="#0F766E" strokeWidth="0.5" strokeDasharray="200 40" className="animate-[spin_30s_linear_infinite]" />
              </svg>
            </div>

            {/* Under HUD metrics grid */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 font-mono z-10">
              <div className="bg-neutral-900/60 p-2 rounded border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-slate-500 block">Density</span>
                <span className="text-[11px] font-semibold text-white">88 threads/cm</span>
              </div>
              <div className="bg-neutral-900/60 p-2 rounded border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-slate-500 block">Warp/Weft</span>
                <span className="text-[11px] font-semibold text-brand">54 : 34</span>
              </div>
              <div className="bg-neutral-900/60 p-2 rounded border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-slate-500 block">Confidence</span>
                <span className="text-[11px] font-semibold text-[#14B8A6]">99.82%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote testimonial */}
        <div className="z-10 max-w-md">
          <blockquote className="text-xl font-medium leading-relaxed text-slate-200">
            "The optical thread counting interface is unbelievably fast and accurate. Our QC process went from minutes to a click."
          </blockquote>
          <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
            <div>
              <div className="text-xs font-semibold text-white">Anika Roy</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                Head of Quality, Loomworks Mills
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function GoogleButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    if (result.error) {
      toast.error("Google sign-in failed: " + result.error.message);
      setLoading(false);
      return;
    }
    if (result.data.url) return;
    window.location.href = "/dashboard";
  }
  return (
    <Button 
      variant="outline" 
      type="button" 
      onClick={go} 
      disabled={disabled || loading} 
      className="w-full rounded-md h-11 gap-2 border-border hover:bg-neutral-50 hover:text-foreground text-sm font-medium transition-all"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
        </svg>
      )}
      Continue with Google
    </Button>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">or email credentials</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// Custom 1-Click Demo Login button to bypass setup issues
function DemoLoginButton({ onLoadingState }: { onLoadingState: (loading: boolean) => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleDemoLogin() {
    setLoading(true);
    onLoadingState(true);
    
    const demoEmail = "demo2@threadcounty.com";
    const demoPassword = "ThreadCountyDemo123!";

    const { data, error } = await supabase.auth.signInAnonymously();

    setLoading(false);
    onLoadingState(false);

    if (error) {
      toast.error(`Login failed: ${error.message}. Please check if anonymous sign-ins are enabled.`);
    } else {
      toast.success("Welcome! Demo account initialized anonymously.");
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <Button
      type="button"
      onClick={handleDemoLogin}
      disabled={loading}
      className="w-full h-11 rounded-md bg-gradient-to-r from-teal-600 to-brand text-white hover:from-teal-700 hover:to-brand-dark transition-all duration-300 font-semibold shadow-md flex items-center justify-center gap-2 group hover:scale-[1.01]"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4 group-hover:animate-pulse" />
      )}
      {loading ? "Initializing Guest Session..." : "Instant Demo Access (1-Click)"}
    </Button>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);
    localStorage.setItem("threadcounty-remember-me", rememberMe ? "true" : "false");
    if (!rememberMe && typeof window !== "undefined") {
      sessionStorage.setItem("threadcounty-session-only", "true");
    } else {
      sessionStorage.removeItem("threadcounty-session-only");
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setLoading(false);
      if (error.message.includes("Email not confirmed") || error.message.includes("confirm")) {
        setErrorDetails("confirm_error");
        toast.error("Email not confirmed.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    setLoading(false);
    toast.success("Welcome back.");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          New to ThreadCounty?{" "}
          <Link to="/auth" search={{ mode: "signup" }} className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4 hover:underline-offset-2 transition-all">
            Create an account
          </Link>
        </p>
      </div>

      {errorDetails === "confirm_error" && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs space-y-1.5 flex flex-col">
          <span className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="size-4 text-amber-600 flex-shrink-0" />
            Email Verification Active
          </span>
          <span>
            Please check your email inbox to verify your account, OR turn off email confirmation in your **Supabase Dashboard** (Authentication → Providers → Email → Toggle OFF "Confirm email").
          </span>
        </div>
      )}

      <div>
        {/* Instant Demo Access (1-Click) */}
        <DemoLoginButton onLoadingState={setLoading} />
        
        <Divider />
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com"
                autoComplete="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10 h-11 border-border focus-visible:ring-brand"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Password</Label>
              <Link to="/auth" search={{ mode: "forgot" }} className="text-xs font-semibold text-brand hover:text-brand-dark">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password"
                autoComplete="current-password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="pl-10 pr-10 h-11 border-border focus-visible:ring-brand"
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(v === true)}
              disabled={loading}
            />
            <Label htmlFor="remember-me" className="text-sm font-normal text-muted-foreground cursor-pointer">
              Remember me
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 rounded-md bg-foreground text-background hover:bg-foreground/90 font-semibold transition-all mt-6"
          >
            {loading ? "Verifying..." : "Sign in"}
          </Button>
        </form>
        
        <div className="mt-4">
          <GoogleButton disabled={loading} />
        </div>
      </div>
    </div>
  );
}

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function SignupForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signUpState, setSignUpState] = useState<"idle" | "verify_needed">( "idle" );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ fullName, email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    
    setLoading(true);
    setSignUpState("idle");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + "/auth/callback",
      },
    });
    
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (data.session) {
      setLoading(false);
      toast.success("Account created successfully!");
      navigate({ to: "/dashboard" });
    } else {
      // The auto-confirm trigger or dashboard setting handles confirmation.
      // Let's attempt immediate login with the password to bypass the email check!
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (signInError) {
        setSignUpState("verify_needed");
        toast.info("Account created. Verification link sent to your email.");
      } else {
        toast.success("Welcome! Account created successfully.");
        navigate({ to: "/dashboard" });
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth" search={{ mode: "login" }} className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4 hover:underline-offset-2 transition-all">
            Sign in
          </Link>
        </p>
      </div>

      {signUpState === "verify_needed" && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs space-y-1.5 flex flex-col">
          <span className="font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-blue-600 flex-shrink-0" />
            Verification Link Sent
          </span>
          <span>
            We created your account! Please verify it by clicking the link in your email inbox, **or turn off "Confirm email" in Supabase** to bypass verification permanently.
          </span>
        </div>
      )}

      <div>
        <DemoLoginButton onLoadingState={setLoading} />
        
        <Divider />
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Full name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                id="name" 
                placeholder="Ansika Singh"
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="pl-10 h-11 border-border focus-visible:ring-brand"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email2" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                id="email2" 
                type="email" 
                placeholder="name@company.com"
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10 h-11 border-border focus-visible:ring-brand"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pass2" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                id="pass2" 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a strong password"
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="pl-10 pr-10 h-11 border-border focus-visible:ring-brand"
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">At least 8 characters required.</p>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 rounded-md bg-foreground text-background hover:bg-foreground/90 font-semibold transition-all mt-4"
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
          
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            By signing up, you agree to our terms of service and privacy policy.
          </p>
        </form>
        
        <div className="mt-4">
          <GoogleButton disabled={loading} />
        </div>
      </div>
    </div>
  );
}

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Reset link sent. Check your inbox.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We will send a secure link to your email to reset your credentials.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="emailf" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              id="emailf" 
              type="email" 
              placeholder="name@company.com"
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="pl-10 h-11 border-border focus-visible:ring-brand"
              disabled={loading}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-11 rounded-md bg-foreground text-background hover:bg-foreground/90 font-semibold transition-all mt-4"
        >
          {loading ? "Sending link..." : "Send reset link"}
        </Button>
        
        <div className="text-center pt-2">
          <Link to="/auth" search={{ mode: "login" }} className="text-sm font-semibold text-brand hover:text-brand-dark">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
