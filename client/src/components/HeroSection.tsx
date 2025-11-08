import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from '@assets/generated_images/Sustainable_city_aerial_view_6479dcdc.png';

export default function HeroSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
        <div className="glass-strong rounded-2xl p-12 max-w-4xl text-center shadow-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight" data-testid="text-hero-title">
            AI-Powered Sustainability Intelligence
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Transform environmental data into actionable insights. Mera Pruthvi helps cities, organizations, and citizens predict, prevent, and reduce environmental impact with real-time AI-powered intelligence.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="default"
              className="gradient-nature border-0 text-white text-lg px-8 py-6 h-auto"
              data-testid="button-get-started-hero"
              onClick={() => setLocation('/login')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}