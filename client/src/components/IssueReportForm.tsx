import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Send } from "lucide-react";
import { useState } from "react";

const categories = [
  "Waste Overflow",
  "Air Pollution",
  "Water Pollution",
  "Illegal Dumping",
  "Other"
];

export default function IssueReportForm() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Issue reported');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Card data-testid="card-issue-report">
      <CardHeader>
        <CardTitle>Report Environmental Issue</CardTitle>
        <CardDescription>Help us keep your community clean and sustainable</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Issue Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter location or use GPS"
                className="pl-9"
                data-testid="input-location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              rows={4}
              data-testid="textarea-description"
            />
          </div>

          <div className="space-y-2">
            <Label>Add Photos</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover-elevate cursor-pointer">
              <Camera className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload photos</p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={submitted}
            data-testid="button-submit-report"
          >
            {submitted ? (
              "Submitted! +10 Eco-Points"
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}