import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";
import { Zap, Recycle, MapPin, Droplets, TrendingUp, Leaf } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Zap,
      title: "Resource Monitor",
      description: "Track electricity, water, and gas usage with AI-powered insights and industry benchmarks."
    },
    {
      icon: MapPin,
      title: "Eco-Navigation",
      description: "Get sustainable route recommendations with real-time carbon impact tracking."
    },
    {
      icon: Recycle,
      title: "Waste Classifier",
      description: "AI-powered waste sorting with instant recommendations and recycling guidance."
    },
    {
      icon: Droplets,
      title: "Smart Irrigation",
      description: "Weather-aware irrigation scheduling powered by real-time environmental data."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md gradient-nature flex items-center justify-center shadow-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Mera Pruthvi</div>
                <div className="text-[10px] text-muted-foreground -mt-1">AI Sustainability Platform</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                variant="default" 
                className="gradient-nature border-0" 
                data-testid="button-get-started"
                onClick={() => setLocation('/dashboard')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Build a Sustainable Future with AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your environmental impact, optimize resource usage, and make data-driven decisions for a greener tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="gradient-nature border-0 text-base"
              onClick={() => setLocation('/dashboard')}
              data-testid="button-hero-cta"
            >
              Start Tracking Impact
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">Real-time</div>
              <div className="text-sm text-muted-foreground">AI Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">Zero Setup</div>
              <div className="text-sm text-muted-foreground">Instant Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">100% Free</div>
              <div className="text-sm text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Everything You Need in One Platform
            </h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive sustainability tools powered by Google Gemini AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="card-gradient hover-elevate border-primary/20">
                  <CardContent className="p-6">
                    <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="card-gradient border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full gradient-nature flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">
                    Track Your Impact Today
                  </h2>
                  <p className="text-muted-foreground">
                    Join the sustainability revolution with AI-powered tools
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Monitor resources with industry baseline comparisons</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Calculate carbon savings from eco-friendly travel choices</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Classify waste and get AI-powered recycling guidance</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Optimize irrigation with real-time weather data</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                className="w-full gradient-nature border-0"
                onClick={() => setLocation('/dashboard')}
                data-testid="button-cta-card"
              >
                Launch Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md gradient-nature flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Mera Pruthvi</span>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              © 2025 Mera Pruthvi. Building a sustainable future with AI.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Privacy</button>
              <button className="hover:text-foreground transition-colors">Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
