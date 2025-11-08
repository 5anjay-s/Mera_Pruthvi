import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Zap, Droplets, Flame, Loader2, Check, CheckCircle, AlertTriangle, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResourceEntry {
  id: string;
  resourceType: string;
  amount: number;
  unit: string;
  credits: number;
  date: string;
}

interface Benchmark {
  good: number;
  normal: number;
  bad: number;
  unit: string;
}

interface Rating {
  level: "Good" | "Normal" | "Bad" | "Worst";
  color: string;
  benchmark: Benchmark;
  percentage: number;
}

const resourceTypes = [
  { value: "electricity", label: "Electricity", icon: Zap, unit: "kWh" },
  { value: "water", label: "Water", icon: Droplets, unit: "liters" },
  { value: "gas", label: "Natural Gas", icon: Flame, unit: "cubic meters" },
];

export default function ResourceMonitor() {
  const [resourceType, setResourceType] = useState("");
  const [amount, setAmount] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [rating, setRating] = useState<Rating | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const { toast } = useToast();

  const { data: entries = [] } = useQuery<ResourceEntry[]>({
    queryKey: ["/api/resources"],
  });

  const createEntry = useMutation({
    mutationFn: async (data: { resourceType: string; amount: number; unit: string }) => {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create resource entry");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      
      setSuggestions(data.suggestions || "");
      setRating(data.rating || null);
      setIsSuggestionsOpen(true);
      setAmount("");
      
      const bonusPoints = data.rating?.level === "Good" ? 10 : 0;
      const totalCredits = data.entry.credits + bonusPoints;
      
      toast({
        title: `+${totalCredits} Eco-Points Earned!`,
        description: data.rating?.level === "Good" 
          ? "Excellent! +10 bonus points for achieving Good rating!" 
          : "Great job tracking your resources",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceType || !amount) return;

    const selectedType = resourceTypes.find(t => t.value === resourceType);
    createEntry.mutate({
      resourceType,
      amount: parseFloat(amount),
      unit: selectedType?.unit || "units",
    });
  };

  const selectedTypeConfig = resourceTypes.find(t => t.value === resourceType);

  const getRatingBadgeColor = (level: string) => {
    switch (level) {
      case "Good":
        return "bg-green-500 text-white border-green-600";
      case "Normal":
        return "bg-yellow-500 text-white border-yellow-600";
      case "Bad":
        return "bg-orange-500 text-white border-orange-600";
      case "Worst":
        return "bg-red-500 text-white border-red-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getRatingIcon = (level: string) => {
    switch (level) {
      case "Good":
        return <CheckCircle className="h-4 w-4" />;
      case "Normal":
        return <Check className="h-4 w-4" />;
      case "Bad":
      case "Worst":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-gradient" data-testid="card-resource-monitor">
        <CardHeader>
          <CardTitle>Industry Resource Monitor</CardTitle>
          <CardDescription>Track your resource consumption and get AI-powered optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource-type">Resource Type</Label>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger id="resource-type" data-testid="select-resource-type">
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount {selectedTypeConfig && `(${selectedTypeConfig.unit})`}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  data-testid="input-amount"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-nature border-0" 
              disabled={createEntry.isPending || !resourceType || !amount}
              data-testid="button-submit-resource"
            >
              {createEntry.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Submit & Get AI Suggestions"
              )}
            </Button>
          </form>

          {rating && (
            <div className="mt-6 space-y-4">
              <Card className="card-gradient backdrop-blur-sm bg-card/50 border border-primary/10" data-testid="rating-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Usage Rating:</span>
                        <Badge 
                          className={`${getRatingBadgeColor(rating.level)} flex items-center gap-1 no-default-hover-elevate`}
                          data-testid="badge-rating"
                        >
                          {getRatingIcon(rating.level)}
                          {rating.level}
                        </Badge>
                      </div>
                      {rating.level === "Good" && (
                        <Badge 
                          className="bg-primary/20 text-primary border-primary/30"
                          data-testid="badge-bonus"
                        >
                          +10 Bonus Eco-Points!
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-3 rounded-md bg-muted/50">
                      <p className="text-sm text-muted-foreground" data-testid="text-benchmark">
                        <span className="font-medium text-foreground">Your usage:</span> {rating.percentage}% of normal benchmark
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Industry benchmarks: Good ≤ {rating.benchmark.good} {rating.benchmark.unit}, Normal ≤ {rating.benchmark.normal} {rating.benchmark.unit}, Bad ≤ {rating.benchmark.bad} {rating.benchmark.unit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {suggestions && (
                <Collapsible open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
                  <Card className="card-gradient backdrop-blur-sm bg-card/50 border border-primary/10">
                    <CardContent className="pt-6">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-between p-0 h-auto hover-elevate"
                          data-testid="button-toggle-suggestions"
                        >
                          <h4 className="font-semibold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            AI Enhancement Suggestions
                          </h4>
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isSuggestionsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 space-y-2 transition-all duration-300 ease-in-out">
                        <div className="p-4 rounded-md bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                          <p className="text-sm whitespace-pre-line leading-relaxed" data-testid="text-suggestions">
                            {suggestions}
                          </p>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Your resource tracking history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.slice(0, 5).map((entry) => {
                const typeConfig = resourceTypes.find(t => t.value === entry.resourceType);
                const Icon = typeConfig?.icon || Zap;
                
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                    data-testid={`entry-${entry.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{entry.resourceType}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.amount} {entry.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">+{entry.credits} credits</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}