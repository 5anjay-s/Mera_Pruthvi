import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-300 card-gradient" data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader>
        <div className="mb-4 inline-flex p-3 rounded-lg gradient-nature shadow-lg">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}