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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div 
            className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate transition-colors cursor-pointer" 
            data-testid="dropzone-upload"
            onClick={handleUploadClick}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-[400px] aspect-square flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                    data-testid="image-preview"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-6">
                      <ImageIcon className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Drop image here or click to upload</p>
                      <p className="text-xs text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleUploadClick} 
                disabled={analyzing} 
                data-testid="button-upload"
                className="w-full"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with Gemini...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {imagePreview ? "Upload Different Image" : "Upload Image"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-4" data-testid="result-classification">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-4">
                  {result.recyclable === 1 ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{result.category}</h3>
                    <Badge variant={result.recyclable === 1 ? "default" : "destructive"} className="mt-1">
                      {result.recyclable === 1 ? "Recyclable" : "Non-recyclable"}
                    </Badge>
                  </div>
                </div>

                {/* Confidence Level */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Confidence Level</span>
                    <span className="text-sm font-semibold" data-testid="text-confidence">
                      {result.confidence}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        result.confidence >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        result.confidence >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      }`}
                      style={{ width: `${result.confidence}%` }}
                      data-testid="confidence-bar"
                    />
                  </div>
                </div>

                {/* Recyclability Meter */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recyclability Status</span>
                    <span className={`text-sm font-semibold ${
                      result.recyclable === 1 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.recyclable === 1 ? '100% Recyclable' : 'Not Recyclable'}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        result.recyclable === 1 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${result.recyclable * 100}%` }}
                      data-testid="recyclability-bar"
                    />
                  </div>
                </div>

                {/* Disposal Instructions */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <span>💡</span>
                    Disposal Instructions:
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.suggestion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}