import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Leaf } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (userData: {
      username: string;
      password: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Signup failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account created!",
        description: "Welcome to Mera Pruthvi. Let's make the planet better together!",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      signupMutation.mutate({
        username,
        password,
        email: email || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Mera Pruthvi</span>
          </div>
          <CardTitle data-testid="title-signup">Create Account</CardTitle>
          <CardDescription>Join the sustainability movement today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                data-testid="input-username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  data-testid="input-firstname"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  data-testid="input-lastname"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              data-testid="button-signup"
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                href="/login"
                data-testid="link-login"
                className="text-primary hover:underline"
              >
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
