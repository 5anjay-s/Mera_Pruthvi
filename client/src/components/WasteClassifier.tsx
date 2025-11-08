import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ClassificationResult {
  category: string;
  confidence: number;
  recyclable: number;
  suggestion: string;
}

export default function WasteClassifier() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const classifyMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await fetch("/api/waste/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });
      if (!response.ok) throw new Error("Classification failed");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      setResult(data.classification);
      setAnalyzing(false);
      toast({
        title: "Waste Classified!",
        description: `Identified as ${data.classification.category}`,
      });
    },
    onError: (error: any) => {
      setAnalyzing(false);
      toast({
        title: "Classification Failed",
        description: error.message || "Unable to analyze image",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setAnalyzing(true);
      setResult(null);
      classifyMutation.mutate(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card data-testid="card-waste-classifier">
      <CardHeader>
        <CardTitle>AI Waste Classifier</CardTitle>
        <CardDescription>Upload an image to classify waste type and recyclability using Gemini Vision</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-colors cursor-pointer" 
          data-testid="dropzone-upload"
          onClick={handleUploadClick}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
              ) : (
                <ImageIcon className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Drop image here or click to upload</p>
              <p className="text-xs text-muted-foreground">Supports JPG, PNG up to 10MB</p>
            </div>
            <Button onClick={handleUploadClick} disabled={analyzing} data-testid="button-upload">
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50" data-testid="result-classification">
            <div className="flex items-start gap-3">
              {result.recyclable === 1 ? (
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{result.category}</span>
                  <Badge variant={result.recyclable === 1 ? "default" : "destructive"}>
                    {result.recyclable === 1 ? "Recyclable" : "Non-recyclable"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Confidence: <span className="font-mono font-medium">{result.confidence}%</span>
                </div>
                <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
                  <p className="text-sm font-medium mb-1">AI Suggestion:</p>
                  <p className="text-sm text-muted-foreground">{result.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}