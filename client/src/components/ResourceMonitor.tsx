import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Zap, Droplets, Flame, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResourceEntry {
  id: string;
  resourceType: string;
  amount: number;
  unit: string;
  credits: number;
  date: string;
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
      setSuggestions(data.suggestions);
      setAmount("");
      toast({
        title: `+${data.entry.credits} Credits Earned!`,
        description: "Great job tracking your resources",
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

          {suggestions && (
            <div className="mt-6 p-4 rounded-lg gradient-overlay border border-primary/20" data-testid="ai-suggestions">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                AI Optimization Suggestions
              </h4>
              <p className="text-sm whitespace-pre-line">{suggestions}</p>
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