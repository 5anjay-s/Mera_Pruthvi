import FeatureCard from '../FeatureCard';
import { Cloud, Trash2, BarChart3, Users } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
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
  );
}