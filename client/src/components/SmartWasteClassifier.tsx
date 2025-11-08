import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, CheckCircle2, XCircle, Lightbulb, Recycle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SmartWasteClassifier() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const classifyWaste = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await fetch("/api/waste/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });
      if (!response.ok) throw new Error("Failed to classify waste");
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data.classification);
      toast({
        title: "Waste Classified!",
        description: "+5 Eco-Points earned",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Classification Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setAnalyzing(false);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      classifyWaste.mutate(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="card-gradient" data-testid="card-smart-waste-classifier">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-primary" />
          AI Waste Classifier
        </CardTitle>
        <CardDescription>Upload waste images for AI-powered classification and recycling guidance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-colors">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Upload waste item image</p>
              <p className="text-xs text-muted-foreground">Supports JPG, PNG up to 10MB</p>
            </div>
            <label htmlFor="waste-upload">
              <Button 
                type="button" 
                disabled={analyzing}
                onClick={() => document.getElementById('waste-upload')?.click()}
                data-testid="button-upload-waste"
              >
                <Upload className="mr-2 h-4 w-4" />
                {analyzing ? "Analyzing with AI..." : "Select Image"}
              </Button>
              <input
                id="waste-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50" data-testid="result-classification">
              <div className="flex items-start gap-3 mb-4">
                {result.recyclable ? (
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-lg">{result.category}</span>
                    <Badge variant={result.recyclable ? "default" : "destructive"}>
                      {result.recyclable ? "Recyclable" : "Non-recyclable"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Confidence: <span className="font-mono font-medium">{result.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Recycling & Upcycling Suggestion</p>
                    <p className="text-sm text-muted-foreground">{result.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">+5</p>
                  <p className="text-xs text-muted-foreground">Eco-Points Earned</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">{result.recyclable ? "✓" : "✗"}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.recyclable ? "Recycle Now" : "General Waste"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}