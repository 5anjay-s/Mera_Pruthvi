import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MapPin, Navigation, Leaf, Car, Bus, Bike, FootprintsIcon, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransportMode {
  id: string;
  name: string;
  icon: any;
  carbonFactor: number;
  credits: number;
  color: string;
}

const transportModes: TransportMode[] = [
  { id: "walk", name: "Walking", icon: FootprintsIcon, carbonFactor: 0, credits: 20, color: "text-green-600" },
  { id: "cycle", name: "Cycling", icon: Bike, carbonFactor: 0, credits: 20, color: "text-green-600" },
  { id: "bus", name: "Public Bus", icon: Bus, carbonFactor: 0.05, credits: 15, color: "text-blue-600" },
  { id: "metro", name: "Metro", icon: Navigation, carbonFactor: 0.03, credits: 15, color: "text-blue-600" },
  { id: "carpool", name: "Carpool", icon: Users, carbonFactor: 0.06, credits: 10, color: "text-yellow-600" },
  { id: "car", name: "Solo Car", icon: Car, carbonFactor: 0.2, credits: 2, color: "text-red-600" },
];

export default function EcoNavigation() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [distance, setDistance] = useState(10);
  const { toast } = useToast();

  const { data: routes = [] } = useQuery({
    queryKey: ["/api/navigation"],
  });

  const createRoute = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create navigation route");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/navigation"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: `+${data.credits} Eco-Credits Earned!`,
        description: `Great choice! You saved ${(10 - data.carbonEmission).toFixed(2)} kg CO₂`,
      });
      setStartLocation("");
      setEndLocation("");
      setSelectedMode(null);
    },
  });

  const handleSubmit = () => {
    if (!startLocation || !endLocation || !selectedMode) return;

    const carbonEmission = distance * selectedMode.carbonFactor;
    
    createRoute.mutate({
      startLocation,
      endLocation,
      transportMode: selectedMode.id,
      distance,
      carbonEmission,
      credits: selectedMode.credits,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="card-gradient" data-testid="card-eco-navigation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Eco-Navigation Planner
          </CardTitle>
          <CardDescription>Plan sustainable routes and earn credits for eco-friendly travel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Starting Point</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start"
                  placeholder="Enter start location"
                  className="pl-9"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  data-testid="input-start-location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end"
                  placeholder="Enter destination"
                  className="pl-9"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  data-testid="input-end-location"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Choose Transportation Mode</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {transportModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode?.id === mode.id;
                
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card'
                    }`}
                    data-testid={`mode-${mode.id}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className={`h-8 w-8 ${isSelected ? 'text-primary' : mode.color}`} />
                      <span className="text-sm font-medium">{mode.name}</span>
                      <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                        +{mode.credits} pts
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedMode && (
            <div className="p-4 rounded-lg gradient-overlay border border-primary/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{distance} km</p>
                  <p className="text-xs text-muted-foreground">Distance</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {(distance * selectedMode.carbonFactor).toFixed(2)} kg
                  </p>
                  <p className="text-xs text-muted-foreground">CO₂ Emission</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">+{selectedMode.credits}</p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSubmit}
            className="w-full gradient-nature border-0"
            disabled={!startLocation || !endLocation || !selectedMode || createRoute.isPending}
            data-testid="button-start-navigation"
          >
            <Leaf className="mr-2 h-4 w-4" />
            Start Eco-Friendly Route
          </Button>
        </CardContent>
      </Card>

      {routes.length > 0 && (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Recent Journeys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {routes.slice(0, 5).map((route: any) => {
                const modeConfig = transportModes.find(m => m.id === route.transportMode);
                const Icon = modeConfig?.icon || Car;
                
                return (
                  <div
                    key={route.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{route.startLocation} → {route.endLocation}</p>
                        <p className="text-xs text-muted-foreground">
                          {route.distance} km • {route.carbonEmission.toFixed(2)} kg CO₂
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-primary/10 text-primary border-0">
                      +{route.credits} pts
                    </Badge>
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