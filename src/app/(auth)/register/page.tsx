"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Bot, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "CHARACTER" | "COMPANY";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("CHARACTER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Registration failed");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, name }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Failed to create profile");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Join CharacterX</CardTitle>
          <CardDescription>
            {step === 1 ? "Choose your account type" : "Create your account"}
          </CardDescription>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 w-8 rounded-full transition-colors",
                  s <= step ? "bg-violet-600" : "bg-slate-200"
                )}
              />
            ))}
          </div>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {(["CHARACTER", "COMPANY"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "relative rounded-xl border-2 p-4 text-left transition-all hover:border-violet-400",
                      role === r ? "border-violet-600 bg-violet-50" : "border-slate-200"
                    )}
                  >
                    {role === r && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-violet-600 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="mb-2">
                      {r === "CHARACTER" ? (
                        <Bot className="h-7 w-7 text-violet-600" />
                      ) : (
                        <Building2 className="h-7 w-7 text-slate-600" />
                      )}
                    </div>
                    <p className="font-semibold text-sm">
                      {r === "CHARACTER" ? "AI Character" : "Company"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {r === "CHARACTER"
                        ? "List your AI persona & get booked"
                        : "Find & book AI characters"}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {role === "CHARACTER" ? "Character Name" : "Company Name"}
                  </Label>
                  <Input
                    id="name"
                    placeholder={role === "CHARACTER" ? "e.g. Nova AI" : "e.g. Acme Corp"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex gap-2 w-full">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={loading}>
                {step === 1 ? "Continue" : loading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
            <p className="text-sm text-slate-500 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
