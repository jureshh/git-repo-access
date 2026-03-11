import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, FileText, CheckCircle2, AlertCircle, Database, X } from "lucide-react";
import { extractLease, seedSyntheticData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type UploadState = "idle" | "selected" | "uploading" | "success" | "error";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setErrorMsg("Only PDF files are supported.");
      setState("error");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrorMsg("File must be under 20 MB.");
      setState("error");
      return;
    }
    setFile(f);
    setState("selected");
    setErrorMsg("");
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!file) return;
    setState("uploading");
    setProgress(0);

    // Simulate progress while waiting for extraction
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 400);

    try {
      await extractLease(file);
      clearInterval(interval);
      setProgress(100);
      setState("success");
      toast({ title: "Lease extracted successfully", description: `${file.name} has been processed.` });
    } catch (err) {
      clearInterval(interval);
      setErrorMsg(err instanceof Error ? err.message : "Extraction failed");
      setState("error");
    }
  };

  const handleSeed = async () => {
    try {
      await seedSyntheticData();
      toast({ title: "Synthetic data loaded", description: "Demo leases have been seeded." });
      navigate("/dashboard");
    } catch {
      toast({ title: "Seeding failed", description: "Could not load synthetic data. Using mock data instead.", variant: "destructive" });
      navigate("/dashboard");
    }
  };

  const reset = () => {
    setFile(null);
    setState("idle");
    setProgress(0);
    setErrorMsg("");
  };

  return (
    <div className="py-16 lg:py-24">
      <div className="container max-w-2xl space-y-8">
        <div className="text-center space-y-3" style={{ animation: "fade-up 0.6s ease-out forwards" }}>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Upload Lease Document</h1>
          <p className="text-muted-foreground text-lg">
            Drop a PDF lease and our AI extracts every key term in seconds.
          </p>
        </div>

        <Card
          className="relative overflow-hidden"
          style={{ animation: "fade-up 0.6s ease-out 0.1s forwards", opacity: 0 }}
        >
          <CardContent className="p-8">
            {(state === "idle" || state === "error") && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".pdf";
                  input.onchange = (e) => {
                    const f = (e.target as HTMLInputElement).files?.[0];
                    if (f) handleFile(f);
                  };
                  input.click();
                }}
              >
                <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Drag & drop your lease PDF here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse · PDF only · max 20 MB</p>
                {state === "error" && (
                  <p className="text-sm text-destructive mt-4 flex items-center justify-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> {errorMsg}
                  </p>
                )}
              </div>
            )}

            {state === "selected" && file && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <FileText className="h-10 w-10 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={reset}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleUpload} className="w-full h-12 text-base rounded-xl">
                  <UploadIcon className="mr-2 h-4 w-4" /> Extract Lease Data
                </Button>
              </div>
            )}

            {state === "uploading" && (
              <div className="space-y-6 text-center py-4">
                <div className="space-y-2">
                  <p className="font-medium">Extracting lease data…</p>
                  <p className="text-sm text-muted-foreground">AI is reading your document</p>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
              </div>
            )}

            {state === "success" && (
              <div className="text-center space-y-6 py-4">
                <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
                <div>
                  <p className="text-xl font-display font-semibold">Extraction Complete</p>
                  <p className="text-muted-foreground mt-1">All lease terms have been extracted.</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={reset}>Upload Another</Button>
                  <Button onClick={() => navigate("/dashboard")}>View Dashboard</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seed option */}
        <Card
          className="border-dashed"
          style={{ animation: "fade-up 0.6s ease-out 0.2s forwards", opacity: 0 }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-accent" />
              Demo Mode
            </CardTitle>
            <CardDescription>
              No PDF handy? Load synthetic lease data to explore the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" onClick={handleSeed} className="rounded-xl">
              Load Demo Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
