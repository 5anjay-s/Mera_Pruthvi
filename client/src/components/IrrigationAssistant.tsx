import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Droplets, MapPin, Sprout, Loader2, CloudRain, Sun, Cloud, Wind, Thermometer } from "lucide-react";
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

// Default coordinates for common agricultural regions
const defaultLocations: Record<string, { lat: number; lon: number }> = {
  default: { lat: 28.6139, lon: 77.2090 }, // Delhi, India
  delhi: { lat: 28.6139, lon: 77.2090 },
  mumbai: { lat: 19.0760, lon: 72.8777 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  pune: { lat: 18.5204, lon: 73.8567 },
  hyderabad: { lat: 17.3850, lon: 78.4867 },
};

export default function IrrigationAssistant() {
  const [cropType, setCropType] = useState("");
  const [location, setLocation] = useState("");
  const [soilMoisture, setSoilMoisture] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const { toast } = useToast();
  
  // Use refs to track abort controller and debounce timer
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLocationRef = useRef<string>("");

  const { data: schedules = [] } = useQuery<any[]>({
    queryKey: ["/api/irrigation"],
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchWeather = async (locationName: string): Promise<any | null> => {
    // Abort any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    currentLocationRef.current = locationName;
    setIsLoadingWeather(true);
    
    try {
      const locationKey = locationName.toLowerCase().trim();
      const coords = defaultLocations[locationKey] || defaultLocations.default;
      
      const response = await fetch(
        `/api/weather?latitude=${coords.lat}&longitude=${coords.lon}`,
        { signal: abortController.signal }
      );
      
      if (!response.ok) throw new Error("Failed to fetch weather");
      
      const data = await response.json();
      
      // Only update if this request wasn't aborted, location ref matches, AND current location state matches
      // This prevents stale data if user changed location during the fetch
      if (!abortController.signal.aborted && 
          currentLocationRef.current === locationName &&
          location === locationName) {
        setWeatherData(data);
        setIsLoadingWeather(false);
        return data;
      }
      
      // If checks failed, still clear loading state
      setIsLoadingWeather(false);
      return null;
    } catch (error: any) {
      // Ignore abort errors (they're expected when cancelling)
      if (error.name === 'AbortError') {
        setIsLoadingWeather(false);
        return null;
      }
      
      // Only show error if this request is still current
      if (!abortController.signal.aborted && currentLocationRef.current === locationName) {
        console.error("Weather fetch error:", error);
        toast({
          title: "Weather Unavailable",
          description: "Could not fetch weather data for this location",
          variant: "destructive",
        });
      }
      setIsLoadingWeather(false);
      return null;
    }
  };

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
        description: "AI-powered watering recommendations generated with real weather data",
      });
      setCropType("");
      setLocation("");
      setSoilMoisture("");
      setWeatherData(null);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropType || !location || !soilMoisture) return;

    // Fetch weather data first if not already loaded or if location changed
    let currentWeatherData = weatherData;
    if (!weatherData || currentLocationRef.current !== location) {
      const freshWeatherData = await fetchWeather(location);
      currentWeatherData = freshWeatherData;
    }

    // Only submit if we have weather data
    if (currentWeatherData) {
      createSchedule.mutate({
        cropType,
        location,
        soilMoisture,
        weatherData: currentWeatherData,
      });
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Clear weather data when user starts typing
    setWeatherData(null);
    
    // Only fetch weather if location is long enough
    if (value.length > 2) {
      setIsLoadingWeather(true);
      
      // Debounce: wait 500ms after user stops typing
      debounceTimerRef.current = setTimeout(() => {
        fetchWeather(value);
      }, 500);
    } else {
      setIsLoadingWeather(false);
    }
  };

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case "Sun":
        return <Sun className="h-8 w-8" />;
      case "Cloud":
        return <Cloud className="h-8 w-8" />;
      case "CloudRain":
        return <CloudRain className="h-8 w-8" />;
      default:
        return <Sun className="h-8 w-8" />;
    }
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
                    placeholder="Enter city (e.g., Delhi, Mumbai, Pune)"
                    className="pl-9"
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    data-testid="input-location"
                  />
                </div>
              </div>
            </div>

            {weatherData && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 backdrop-blur-sm">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-primary" />
                  Current Weather Conditions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 backdrop-blur">
                    <div className="text-primary mb-1">
                      {getWeatherIcon(weatherData.icon)}
                    </div>
                    <p className="text-xs text-muted-foreground">Condition</p>
                    <p className="text-sm font-semibold">{weatherData.condition}</p>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 backdrop-blur">
                    <Thermometer className="h-8 w-8 text-orange-500 mb-1" />
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="text-sm font-semibold">{weatherData.temperature}°C</p>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 backdrop-blur">
                    <Droplets className="h-8 w-8 text-blue-500 mb-1" />
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="text-sm font-semibold">{weatherData.humidity}%</p>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 backdrop-blur">
                    <Wind className="h-8 w-8 text-sky-500 mb-1" />
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                    <p className="text-sm font-semibold">{weatherData.windSpeed} km/h</p>
                  </div>
                </div>
                {weatherData.precipitation > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <CloudRain className="h-4 w-4" />
                      Rain detected: {weatherData.precipitation}mm - Consider skipping irrigation today
                    </p>
                  </div>
                )}
              </div>
            )}

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
              disabled={createSchedule.isPending || isLoadingWeather || !cropType || !location || !soilMoisture}
              data-testid="button-generate-schedule"
            >
              {createSchedule.isPending || isLoadingWeather ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoadingWeather ? "Loading Weather..." : "Generating Schedule..."}
                </>
              ) : (
                <>
                  <CloudRain className="mr-2 h-4 w-4" />
                  Generate Weather-Aware Schedule
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
                className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border backdrop-blur-sm space-y-3"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold capitalize">{schedule.cropType}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {schedule.location}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {schedule.waterAmount} L
                  </Badge>
                </div>
                
                {schedule.weatherForecast && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground p-2 rounded bg-background/50">
                    <span className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      {schedule.weatherForecast.temp || schedule.weatherForecast.temperature}°C
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {schedule.weatherForecast.humidity}%
                    </span>
                    {schedule.weatherForecast.precipitation > 0 && (
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <CloudRain className="h-3 w-3" />
                        {schedule.weatherForecast.precipitation}mm
                      </span>
                    )}
                  </div>
                )}
                
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