import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Upload, Link, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Science", "Humanities", "Business", "IT", "Design"];

const SubmitIdea = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Idea Submitted!",
      description: "Your innovation has been submitted for review. The community will start voting soon!",
    });

    setTimeout(() => navigate('/dashboard'), 1500);
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
              <p className="text-sm text-muted-foreground">Share your innovation with the campus community</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary text-white font-semibold"
            >
              Submit Idea
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitIdea;
