import MetricCard from '../MetricCard';
import { Droplets, Wind, Thermometer, Leaf } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <MetricCard 
        title="Air Quality Index"
        value="42"
        unit="AQI"
        trend={-12}
        status="good"
        icon={Wind}
        subtitle="Last updated 5 min ago"
      />
      <MetricCard 
        title="Urban Heat Index"
        value="28"
        unit="°C"
        trend={5}
        status="warning"
        icon={Thermometer}
        subtitle="Above average"
      />
      <MetricCard 
        title="Water Quality"
        value="8.2"
        unit="pH"
        status="good"
        icon={Droplets}
        subtitle="Optimal range"
      />
      <MetricCard 
        title="Carbon Offset"
        value="2.4"
        unit="tons"
        trend={18}
        status="good"
        icon={Leaf}
        subtitle="This month"
      />
    </div>
  );
}