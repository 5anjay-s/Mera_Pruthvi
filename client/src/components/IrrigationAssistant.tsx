import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Droplets, MapPin, Sprout, Loader2, CloudRain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const cropTypes = [
  "Rice", "Wheat", "Corn", "Tomatoes", "Lettuce", "Carrots", 
  "Potatoes", "Cotton", "Sugarcane", "Vegetables"
];

const soilMoisturelevels = [
  { value: "dry", label: "Dry", color: "text-red-600" },
  { value: "moist", label: "Moist", color: "text-yellow-600" },
  { value: "wet", label: "Wet", color: "text-blue-600" },
];

export default function IrrigationAssistant() {
  const [cropType, setCropType] = useState("");
  const [location, setLocation] = useState("");
  const [soilMoisture, setSoilMoisture] = useState("");
  const { toast } = useToast();

  const { data: schedules = [] } = useQuery({
    queryKey: ["/api/irrigation"],
  });

  const createSchedule = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/irrigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create irrigation schedule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/irrigation"] });
      toast({
        title: "Irrigation Schedule Created",
        description: "AI-powered watering recommendations generated",
      });
      setCropType("");
      setLocation("");
      setSoilMoisture("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropType || !location || !soilMoisture) return;

    createSchedule.mutate({
      cropType,
      location,
      soilMoisture,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="card-gradient" data-testid="card-irrigation-assistant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            Smart Irrigation Assistant
          </CardTitle>
          <CardDescription>Get AI-powered watering recommendations based on weather and soil conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crop-type">Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger id="crop-type" data-testid="select-crop-type">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop.toLowerCase()}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter farm location"
                    className="pl-9"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    data-testid="input-location"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current Soil Moisture Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {soilMoisturelevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setSoilMoisture(level.value)}
                    className={`p-3 rounded-lg border-2 transition-all hover-elevate ${
                      soilMoisture === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card'
                    }`}
                    data-testid={`moisture-${level.value}`}
                  >
                    <Droplets className={`h-6 w-6 mx-auto mb-1 ${soilMoisture === level.value ? 'text-primary' : level.color}`} />
                    <p className="text-sm font-medium">{level.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-nature border-0" 
              disabled={createSchedule.isPending || !cropType || !location || !soilMoisture}
              data-testid="button-generate-schedule"
            >
              {createSchedule.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Schedule...
                </>
              ) : (
                <>
                  <CloudRain className="mr-2 h-4 w-4" />
                  Generate AI Irrigation Schedule
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {schedules.length > 0 && (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Recent Schedules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedules.slice(0, 3).map((schedule: any) => (
              <div
                key={schedule.id}
                className="p-4 rounded-lg bg-muted/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold capitalize">{schedule.cropType}</p>
                    <p className="text-sm text-muted-foreground">{schedule.location}</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {schedule.waterAmount} L
                  </Badge>
                </div>
                
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm whitespace-pre-line">{schedule.recommendation}</p>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(schedule.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}