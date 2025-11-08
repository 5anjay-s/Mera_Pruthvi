import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: number;
  status?: "good" | "warning" | "critical";
  icon?: LucideIcon;
  subtitle?: string;
}

const statusConfig = {
  good: { bg: "bg-primary/10", text: "text-primary", label: "Good" },
  warning: { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-500", label: "Warning" },
  critical: { bg: "bg-destructive/10", text: "text-destructive", label: "Critical" }
};

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  trend, 
  status = "good",
  icon: Icon,
  subtitle
}: MetricCardProps) {
  const config = statusConfig[status];
  
  return (
    <Card data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={`rounded-md p-2 ${config.bg}`}>
            <Icon className={`h-4 w-4 ${config.text}`} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold font-mono tracking-tight" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </div>
          {unit && (
            <span className="text-sm text-muted-foreground font-medium">{unit}</span>
          )}
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          {status && (
            <Badge variant="secondary" className={`${config.bg} ${config.text} border-0`} data-testid={`badge-status-${status}`}>
              {config.label}
            </Badge>
          )}
          
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {trend >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}