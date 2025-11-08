import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function WasteClassifier() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ category: string; confidence: number; recyclable: boolean } | null>(null);

  const handleUpload = () => {
    setAnalyzing(true);
    setResult(null);
    
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        category: "Plastic Bottle",
        confidence: 94,
        recyclable: true
      });
    }, 2000);
  };

  return (
    <Card data-testid="card-waste-classifier">
      <CardHeader>
        <CardTitle>AI Waste Classifier</CardTitle>
        <CardDescription>Upload an image to classify waste type and recyclability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-colors cursor-pointer" data-testid="dropzone-upload">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Drop image here or click to upload</p>
              <p className="text-xs text-muted-foreground">Supports JPG, PNG up to 10MB</p>
            </div>
            <Button onClick={handleUpload} disabled={analyzing} data-testid="button-upload">
              <Upload className="mr-2 h-4 w-4" />
              {analyzing ? "Analyzing..." : "Upload Image"}
            </Button>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50" data-testid="result-classification">
            <div className="flex items-start gap-3">
              {result.recyclable ? (
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{result.category}</span>
                  <Badge variant={result.recyclable ? "default" : "destructive"}>
                    {result.recyclable ? "Recyclable" : "Non-recyclable"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: <span className="font-mono font-medium">{result.confidence}%</span>
                </div>
                <p className="text-sm mt-2">
                  {result.recyclable 
                    ? "♻️ Please dispose in the blue recycling bin." 
                    : "Place in general waste bin."}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}