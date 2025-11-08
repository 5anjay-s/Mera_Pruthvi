import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { MapPin, Navigation, Leaf, Car, Bus, Bike, FootprintsIcon, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google: any;
  }
}

interface TransportMode {
  id: string;
  name: string;
  icon: any;
  carbonFactor: number;
  credits: number;
  color: string;
  routeColor: string;
  googleMode: string;
}

const transportModes: TransportMode[] = [
  { id: "walk", name: "Walking", icon: FootprintsIcon, carbonFactor: 0, credits: 20, color: "text-green-600", routeColor: "#10b981", googleMode: "WALKING" },
  { id: "cycle", name: "Cycling", icon: Bike, carbonFactor: 0, credits: 20, color: "text-green-600", routeColor: "#10b981", googleMode: "BICYCLING" },
  { id: "transit", name: "Transit", icon: Bus, carbonFactor: 0.05, credits: 15, color: "text-blue-600", routeColor: "#3b82f6", googleMode: "TRANSIT" },
  { id: "carpool", name: "Carpool", icon: Users, carbonFactor: 0.06, credits: 10, color: "text-yellow-600", routeColor: "#f59e0b", googleMode: "DRIVING" },
  { id: "car", name: "Solo Car", icon: Car, carbonFactor: 0.2, credits: 2, color: "text-red-600", routeColor: "#ef4444", googleMode: "DRIVING" },
];

export default function EcoNavigation() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const { toast } = useToast();

  // Google Maps refs
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const startAutocompleteRef = useRef<any>(null);
  const endAutocompleteRef = useRef<any>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const { data: routes = [] } = useQuery<any[]>({
    queryKey: ["/api/navigation"],
  });

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        
        if (!apiKey) {
          console.error('Google Maps API key not found');
          toast({
            title: "Maps Error",
            description: "Google Maps API key is not configured",
            variant: "destructive",
          });
          return;
        }
        
        // Load Google Maps dynamically with modern script loading
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          await new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max
            
            script.onload = () => {
              // Wait for google.maps to be fully initialized with timeout
              const checkReady = setInterval(() => {
                attempts++;
                if (window.google && window.google.maps && window.google.maps.Map) {
                  clearInterval(checkReady);
                  resolve(null);
                } else if (attempts >= maxAttempts) {
                  clearInterval(checkReady);
                  reject(new Error('Google Maps failed to initialize - timeout'));
                }
              }, 100);
            };
            script.onerror = () => reject(new Error('Failed to load Google Maps script'));
            document.head.appendChild(script);
          });
        }

        if (mapRef.current && !googleMapRef.current && window.google && window.google.maps) {
          // Default to user's location or fallback to a default location
          let initialCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi, India default

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                initialCenter = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                googleMapRef.current?.setCenter(initialCenter);
              },
              (error) => {
                console.log("Geolocation error:", error);
              }
            );
          }

          googleMapRef.current = new window.google.maps.Map(mapRef.current, {
            center: initialCenter,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            map: googleMapRef.current,
            suppressMarkers: false,
            polylineOptions: {
              strokeWeight: 5,
            },
          });

          // Initialize Places Autocomplete
          if (startInputRef.current) {
            startAutocompleteRef.current = new window.google.maps.places.Autocomplete(startInputRef.current, {
              fields: ['formatted_address', 'geometry', 'name'],
            });
            startAutocompleteRef.current.addListener('place_changed', () => {
              const place = startAutocompleteRef.current?.getPlace();
              if (place?.formatted_address) {
                setStartLocation(place.formatted_address);
              }
            });
          }

          if (endInputRef.current) {
            endAutocompleteRef.current = new window.google.maps.places.Autocomplete(endInputRef.current, {
              fields: ['formatted_address', 'geometry', 'name'],
            });
            endAutocompleteRef.current.addListener('place_changed', () => {
              const place = endAutocompleteRef.current?.getPlace();
              if (place?.formatted_address) {
                setEndLocation(place.formatted_address);
              }
            });
          }
        }
      } catch (error: any) {
        console.error("Error loading Google Maps:", error);
        toast({
          title: "Maps Error",
          description: error.message || "Failed to load Google Maps. Please check your API key.",
          variant: "destructive",
        });
      }
    };

    initMap();
  }, [toast]);

  // Fetch route when mode is selected
  const fetchRoute = async () => {
    if (!startLocation || !endLocation || !selectedMode || !window.google) return;

    setIsLoadingRoute(true);
    setRouteData(null);

    try {
      const response = await fetch('/api/navigation/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: startLocation,
          destination: endLocation,
          travelMode: selectedMode.googleMode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data = await response.json();
      setRouteData(data);

      // Display route on map
      if (googleMapRef.current && directionsRendererRef.current && window.google) {
        const directionsService = new window.google.maps.DirectionsService();
        
        directionsService.route(
          {
            origin: startLocation,
            destination: endLocation,
            travelMode: selectedMode.googleMode as any,
          },
          (result: any, status: any) => {
            if (status === 'OK' && result) {
              directionsRendererRef.current?.setOptions({
                polylineOptions: {
                  strokeColor: selectedMode.routeColor,
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                },
              });
              directionsRendererRef.current?.setDirections(result);
            }
          }
        );
      }
    } catch (error: any) {
      toast({
        title: "Route Error",
        description: error.message || "Failed to fetch route",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRoute(false);
    }
  };

  useEffect(() => {
    if (startLocation && endLocation && selectedMode) {
      fetchRoute();
    }
  }, [selectedMode]);

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
        description: `Great choice! You saved ${Math.max(0, (120 * (routeData?.distance || 0) / 1000 - data.carbonEmission) / 1000).toFixed(2)} kg CO₂`,
      });
      
      // Reset form
      setStartLocation("");
      setEndLocation("");
      setSelectedMode(null);
      setRouteData(null);
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setDirections({ routes: [] } as any);
      }
      if (startInputRef.current) startInputRef.current.value = "";
      if (endInputRef.current) endInputRef.current.value = "";
    },
  });

  const handleSaveJourney = () => {
    if (!routeData || !selectedMode) return;

    const distanceKm = routeData.distance / 1000;
    const carbonEmissionKg = routeData.carbonEmission / 1000;

    createRoute.mutate({
      startLocation: routeData.startAddress || startLocation,
      endLocation: routeData.endAddress || endLocation,
      transportMode: selectedMode.id,
      distance: distanceKm,
      carbonEmission: carbonEmissionKg,
      credits: selectedMode.credits,
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Reverse geocode to get address
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              setStartLocation(results[0].formatted_address);
              if (startInputRef.current) {
                startInputRef.current.value = results[0].formatted_address;
              }
              toast({
                title: "Current Location Set",
                description: results[0].formatted_address,
              });
            }
          });
        }
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Unable to get your current location. Please enable location services.",
          variant: "destructive",
        });
      }
    );
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
          {/* Interactive Map */}
          <div className="relative rounded-lg overflow-hidden border border-border">
            <div ref={mapRef} className="w-full h-[400px]" data-testid="google-map" />
            
            {/* Glassmorphism overlay for route info */}
            {routeData && (
              <div className="absolute top-4 right-4 p-4 rounded-lg backdrop-blur-lg bg-background/80 border border-border shadow-lg max-w-xs" data-testid="route-info-overlay">
                <h3 className="font-semibold text-sm mb-3">Route Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium" data-testid="text-route-distance">{(routeData.distance / 1000).toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium" data-testid="text-route-duration">{formatDuration(routeData.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CO₂ Emission:</span>
                    <span className="font-medium" data-testid="text-route-carbon">{(routeData.carbonEmission / 1000).toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Credits:</span>
                    <Badge variant="default" className="bg-primary/10 text-primary border-0" data-testid="badge-route-credits">
                      +{selectedMode?.credits} pts
                    </Badge>
                  </div>
                  <div className="pt-2 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Carbon saved vs. solo driving
                    </p>
                    {(() => {
                      const drivingEmission = 120 * routeData.distance / 1000;
                      const savedEmission = Math.max(0, drivingEmission - routeData.carbonEmission);
                      const percentage = Math.min(100, (savedEmission / drivingEmission) * 100);
                      
                      return (
                        <>
                          <div className="space-y-1">
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                                data-testid="carbon-impact-bar"
                              />
                            </div>
                            <p className="text-xs font-semibold text-green-600" data-testid="text-carbon-saved">
                              {(savedEmission / 1000).toFixed(2)} kg CO₂ saved ({percentage.toFixed(0)}%)
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Inputs with Places Autocomplete */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Starting Point</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    ref={startInputRef}
                    id="start"
                    placeholder="Enter start location"
                    className="pl-9"
                    defaultValue={startLocation}
                    data-testid="input-start-location"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={useCurrentLocation}
                  data-testid="button-use-current-location"
                  title="Use current location"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  ref={endInputRef}
                  id="end"
                  placeholder="Enter destination"
                  className="pl-9"
                  defaultValue={endLocation}
                  data-testid="input-end-location"
                />
              </div>
            </div>
          </div>

          {/* Transportation Mode Selection */}
          <div className="space-y-3">
            <Label>Choose Transportation Mode</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {transportModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode?.id === mode.id;
                
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    disabled={!startLocation || !endLocation || isLoadingRoute}
                    className={`p-4 rounded-lg border-2 transition-all hover-elevate disabled:opacity-50 disabled:cursor-not-allowed ${
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

          {/* Carbon Emissions Comparison Table */}
          {routeData && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Carbon Emissions Comparison</CardTitle>
                <CardDescription>See how different transport modes impact the environment for this route</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transportModes.map((mode) => {
                    const Icon = mode.icon;
                    const distanceKm = routeData.distance / 1000;
                    const modeEmission = (mode.carbonFactor * distanceKm).toFixed(2);
                    const isCurrentMode = selectedMode?.id === mode.id;
                    
                    return (
                      <div
                        key={mode.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          isCurrentMode ? 'bg-primary/10 border border-primary/20' : 'bg-card'
                        }`}
                        data-testid={`carbon-comparison-${mode.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${isCurrentMode ? 'text-primary' : mode.color}`} />
                          <div>
                            <p className={`font-medium text-sm ${isCurrentMode ? 'text-primary' : ''}`}>
                              {mode.name}
                              {isCurrentMode && <span className="ml-2 text-xs">(Selected)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {mode.carbonFactor === 0 ? 'Zero emissions' : `${mode.carbonFactor}g CO₂/km`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            parseFloat(modeEmission) === 0 ? 'text-green-600' : 
                            parseFloat(modeEmission) < 50 ? 'text-blue-600' :
                            parseFloat(modeEmission) < 100 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {modeEmission} kg CO₂
                          </p>
                          <p className="text-xs text-muted-foreground">
                            +{mode.credits} credits
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoadingRoute && (
            <div className="flex items-center justify-center p-4" data-testid="loading-route">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Calculating route...</span>
            </div>
          )}

          {/* Save Journey Button */}
          <Button 
            onClick={handleSaveJourney}
            className="w-full gradient-nature border-0"
            disabled={!routeData || !selectedMode || createRoute.isPending}
            data-testid="button-save-journey"
          >
            <Leaf className="mr-2 h-4 w-4" />
            {createRoute.isPending ? "Saving..." : "Save Journey"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Journeys */}
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
                    data-testid={`route-${route.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{route.startLocation} → {route.endLocation}</p>
                        <p className="text-xs text-muted-foreground">
                          {route.distance.toFixed(1)} km • {route.carbonEmission.toFixed(2)} kg CO₂
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