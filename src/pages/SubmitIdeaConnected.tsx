import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Upload, Link, X, ArrowLeft, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ideas as ideasAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Science", "Humanities", "Business", "IT", "Design"];

const SubmitIdea = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const [showAiResults, setShowAiResults] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit an idea",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await ideasAPI.create({
        title,
        description,
        category,
        videoLink: videoLink || undefined,
        imageUrl: imagePreview || undefined,
        tags,
      });

      setAiResults(response.data.idea);
      setShowAiResults(true);

      toast({
        title: "🎉 Idea Submitted!",
        description: response.data.message,
      });

      // Scroll to AI results
      setTimeout(() => {
        document.getElementById("ai-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.error || "Failed to submit idea. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    if (status === "UNDER_REVIEW") {
      return <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">✅ Under Review - On Leaderboard!</Badge>;
    } else if (status === "DRAFT") {
      return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">⚠️ Draft - Needs Refinement</Badge>;
    } else if (status === "APPROVED") {
      return <Badge className="bg-green-500/10 text-green-700 border-green-200">🎉 Approved!</Badge>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Submit Your Idea</h1>
              <p className="text-sm text-muted-foreground">AI will analyze and score your innovation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {!showAiResults ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Card className="p-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold">
                  Idea Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., AI-Powered Study Assistant"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your idea, its impact, and how it will benefit the campus community..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  {description.length}/1000 characters
                </p>
              </div>
            </Card>

            {/* Category */}
            <Card className="p-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Category <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <Badge
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      className={`cursor-pointer text-sm py-2 px-4 ${
                        category === cat
                          ? "bg-gradient-primary text-white"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Hero Image */}
            <Card className="p-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Hero Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">Click to upload an image</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                    </label>
                  )}
                </div>
              </div>
            </Card>

            {/* Video Pitch */}
            <Card className="p-6">
              <div className="space-y-3">
                <Label htmlFor="video" className="text-base font-semibold">
                  Video Pitch (OneDrive Link)
                </Label>
                <div className="flex gap-2">
                  <Link className="w-5 h-5 text-muted-foreground mt-3" />
                  <Input
                    id="video"
                    placeholder="https://onedrive.live.com/..."
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    className="h-12"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Optional: Add a link to your video pitch on OneDrive
                </p>
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <div className="space-y-3">
                <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="h-10"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="py-1 px-3">
                        {tag}
                        <X
                          className="w-3 h-3 ml-2 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary text-white font-semibold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Submit & Analyze
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* AI Results Display */
          <div id="ai-results" className="space-y-6 animate-in fade-in duration-500">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
              <div className="text-center mb-6">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">AI Analysis Complete!</h2>
                <p className="text-muted-foreground">Your idea has been evaluated and scored</p>
              </div>

              {/* Status */}
              <div className="flex justify-center mb-6">
                {getStatusBadge(aiResults.status)}
              </div>

              {/* Overall Score */}
              <div className="mb-8">
                <div className="text-center mb-4">
                  <div className={`text-6xl font-bold ${getScoreColor(aiResults.aiScore)}`}>
                    {aiResults.aiScore}
                  </div>
                  <div className="text-muted-foreground">Overall AI Score</div>
                </div>
                <Progress value={aiResults.aiScore} className="h-3" />
              </div>

              {/* Score Breakdown */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ScoreCard label="Clarity" score={aiResults.clarityScore} />
                <ScoreCard label="Innovation" score={aiResults.innovationScore} />
                <ScoreCard label="Feasibility" score={aiResults.feasibilityScore} />
                <ScoreCard label="Impact" score={aiResults.impactScore} />
              </div>

              {/* AI Feedback */}
              {aiResults.aiAnalysis && (
                <Card className="p-6 bg-white/50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    AI Feedback
                  </h3>
                  <p className="text-sm whitespace-pre-wrap text-foreground">
                    {aiResults.aiAnalysis}
                  </p>
                </Card>
              )}
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gradient-primary"
              >
                View on Dashboard
              </Button>
              <Button
                onClick={() => navigate(`/idea/${aiResults.id}`)}
                variant="outline"
                className="flex-1"
              >
                View Full Details
              </Button>
            </div>

            <Button
              onClick={() => {
                setShowAiResults(false);
                setSubmitting(false);
                setTitle("");
                setDescription("");
                setCategory("");
                setVideoLink("");
                setTags([]);
                setImagePreview(null);
                setAiResults(null);
              }}
              variant="ghost"
              className="w-full"
            >
              Submit Another Idea
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

const ScoreCard = ({ label, score }: { label: string; score: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 60) return "bg-blue-500";
    if (s >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </Card>
  );
};

export default SubmitIdea;

