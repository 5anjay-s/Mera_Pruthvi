import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from '@assets/generated_images/Sustainable_city_aerial_view_6479dcdc.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight" data-testid="text-hero-title">
          AI-Powered Intelligence for a <span className="text-primary">Sustainable Planet</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
          GaiaMind helps cities, organizations, and citizens predict, prevent, and reduce environmental impact with real-time insights on urban heat, pollution, waste, and carbon emissions.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button 
            size="lg" 
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary-border"
            data-testid="button-request-demo"
            onClick={() => console.log('Request Demo clicked')}
          >
            Request Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-background/20 backdrop-blur-lg border-white/30 text-white hover:bg-background/30"
            data-testid="button-explore-dashboard"
            onClick={() => console.log('Explore Dashboard clicked')}
          >
            <Play className="mr-2 h-4 w-4" />
            Explore Dashboard
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
          <div className="text-center" data-testid="stat-cities">
            <div className="text-3xl font-bold font-mono">250+</div>
            <div className="text-sm text-gray-300">Cities Monitored</div>
          </div>
          <div className="text-center" data-testid="stat-carbon">
            <div className="text-3xl font-bold font-mono">50K</div>
            <div className="text-sm text-gray-300">Tons CO₂ Reduced</div>
          </div>
          <div className="text-center" data-testid="stat-issues">
            <div className="text-3xl font-bold font-mono">1M+</div>
            <div className="text-sm text-gray-300">Issues Resolved</div>
          </div>
        </div>
      </div>
    </section>
  );
}