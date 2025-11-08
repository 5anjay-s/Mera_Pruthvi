import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from "lucide-react";

interface MapMarker {
  id: string;
  type: 'pollution' | 'heat' | 'waste';
  location: string;
  severity: 'low' | 'medium' | 'high';
  lat: number;
  lng: number;
}

export default function EnvironmentalMap() {
  const markers: MapMarker[] = [
    { id: '1', type: 'pollution', location: 'Downtown Area', severity: 'high', lat: 40.7, lng: -74.0 },
    { id: '2', type: 'heat', location: 'Industrial Zone', severity: 'medium', lat: 40.8, lng: -73.9 },
    { id: '3', type: 'waste', location: 'Park Avenue', severity: 'low', lat: 40.6, lng: -74.1 }
  ];

  const severityConfig = {
    low: { color: 'bg-primary/10 text-primary', label: 'Low' },
    medium: { color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500', label: 'Medium' },
    high: { color: 'bg-destructive/10 text-destructive', label: 'High' }
  };

  return (
    <Card data-testid="card-environmental-map">
      <CardHeader>
        <CardTitle>Environmental Monitoring Map</CardTitle>
        <CardDescription>Real-time environmental alerts across the city</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video rounded-lg bg-muted/30 border overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interactive map view</p>
              <p className="text-xs text-muted-foreground">Google Maps integration</p>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="bg-destructive/10 text-destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              3 Active Alerts
            </Badge>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold">Active Incidents</h4>
          {markers.map((marker) => {
            const config = severityConfig[marker.severity];
            return (
              <div
                key={marker.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                data-testid={`marker-${marker.id}`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium capitalize">{marker.type}</p>
                    <p className="text-xs text-muted-foreground">{marker.location}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={config.color}>
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}