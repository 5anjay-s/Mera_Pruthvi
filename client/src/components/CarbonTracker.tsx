import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf } from "lucide-react";

interface CarbonCategory {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export default function CarbonTracker() {
  const totalCarbon = 2.4;
  const categories: CarbonCategory[] = [
    { name: "Transportation", value: 1.2, percentage: 50, color: "bg-chart-1" },
    { name: "Energy", value: 0.8, percentage: 33, color: "bg-chart-2" },
    { name: "Waste", value: 0.4, percentage: 17, color: "bg-chart-3" }
  ];

  return (
    <Card data-testid="card-carbon-tracker">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Carbon Footprint</CardTitle>
            <CardDescription>Monthly carbon emissions breakdown</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-4xl font-bold font-mono mb-1" data-testid="text-total-carbon">
            {totalCarbon} <span className="text-lg font-normal text-muted-foreground">tons CO₂</span>
          </div>
          <p className="text-sm text-muted-foreground">12% reduction from last month</p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} data-testid={`category-${category.name.toLowerCase()}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {category.value} tons ({category.percentage}%)
                </span>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-primary font-medium">
            💡 Tip: Switching to public transport 2 days/week could save 0.3 tons CO₂/month
          </p>
        </div>
      </CardContent>
    </Card>
  );
}