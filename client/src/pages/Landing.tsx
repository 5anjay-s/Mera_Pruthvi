import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Cloud, Trash2, BarChart3, Users, Bot, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";
import dashboardImage from '@assets/generated_images/Environmental_monitoring_dashboard_3a9b8185.png';
import wasteImage from '@assets/generated_images/Modern_recycling_facility_e5597a0d.png';
import citizensImage from '@assets/generated_images/Citizens_using_environmental_app_bd3b390e.png';

export default function Landing() {
  const [, setLocation] = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md gradient-nature flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">MP</span>
              </div>
              <span className="font-bold text-lg">Mera Pruthvi</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" data-testid="link-features" onClick={() => scrollToSection('features')}>Features</Button>
              <Button variant="ghost" size="sm" data-testid="link-solutions" onClick={() => scrollToSection('solutions')}>Solutions</Button>
              <Button variant="ghost" size="sm" data-testid="link-about" onClick={() => scrollToSection('about')}>About</Button>
              <ThemeToggle />
              <Button variant="default" size="sm" className="gradient-nature border-0" data-testid="button-get-started" onClick={() => setLocation('/dashboard')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <HeroSection />

      <section className="py-20 bg-muted/30" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Sustainability Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four powerful modules working together to create measurable environmental impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Cloud}
              title="AI Climate Dashboard"
              description="Real-time monitoring and forecasting of environmental risks including heat, air quality, and flood predictions."
            />
            <FeatureCard 
              icon={Trash2}
              title="Smart Waste Management"
              description="Computer vision and ML optimize waste collection routes and improve recycling rates across cities."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Carbon Tracker"
              description="Measure and reduce your carbon footprint with AI-powered insights and actionable recommendations."
            />
            <FeatureCard 
              icon={Users}
              title="Citizen Engagement"
              description="Empower communities to report issues, earn eco-points, and participate in building a greener future."
            />
          </div>
        </div>
      </section>

      <section className="py-20" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                AI-Powered Environmental Intelligence
              </h3>
              <p className="text-muted-foreground mb-6">
                Our climate dashboard provides city planners and decision-makers with real-time insights into environmental conditions. Predict heat waves, monitor air quality, and prevent flooding with AI-driven analytics.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Predictive Analytics</div>
                    <div className="text-sm text-muted-foreground">Forecast environmental risks 7 days ahead</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Cloud className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Live Monitoring</div>
                    <div className="text-sm text-muted-foreground">Real-time satellite and IoT sensor data</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">AI Recommendations</div>
                    <div className="text-sm text-muted-foreground">Actionable insights for impact reduction</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src={dashboardImage} 
                alt="AI Climate Dashboard" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 relative">
              <img 
                src={wasteImage} 
                alt="Smart Waste Management" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-bold mb-4">
                Optimize Waste Collection with Computer Vision
              </h3>
              <p className="text-muted-foreground mb-6">
                Our smart waste management system uses AI to classify waste types, predict bin overflow, and optimize collection routes. Reduce costs while increasing recycling rates.
              </p>
              <div className="flex flex-wrap gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">35%</div>
                    <div className="text-xs text-muted-foreground">Cost Reduction</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">60%</div>
                    <div className="text-xs text-muted-foreground">Recycling Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Monitoring</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Engage Citizens, Build Community
              </h3>
              <p className="text-muted-foreground mb-6">
                GreenPulse empowers every citizen to become an environmental guardian. Report issues, track your impact, and earn rewards for sustainable actions.
              </p>
              <Button size="lg" className="mt-4" data-testid="button-download-app">
                Download GreenPulse App
              </Button>
            </div>
            <div className="relative">
              <img 
                src={citizensImage} 
                alt="Citizen Engagement" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Making Every City and Citizen Count
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Turn complex environmental data into simple, actionable intelligence for a low-carbon, sustainable future.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold font-mono text-primary mb-2">250+</div>
                <div className="text-sm text-muted-foreground">Cities Using GaiaMind</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold font-mono text-primary mb-2">50K</div>
                <div className="text-sm text-muted-foreground">Tons CO₂ Reduced</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold font-mono text-primary mb-2">1M+</div>
                <div className="text-sm text-muted-foreground">Active Citizens</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold font-mono text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="default" data-testid="button-request-demo-footer">
              Request a Demo
            </Button>
            <Button size="lg" variant="outline" data-testid="button-contact-sales">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Climate Dashboard</li>
                <li>Waste Management</li>
                <li>Carbon Tracker</li>
                <li>GreenPulse App</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Case Studies</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Partners</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Mera Pruthvi (GaiaMind). Building a sustainable future with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}