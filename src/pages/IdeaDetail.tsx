import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  Award,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ideas as ideasAPI, votes as votesAPI, comments as commentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const response = await ideasAPI.getById(id!);
      setIdea(response.data);
      setHasVoted(response.data.hasVoted);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.error || "Failed to load idea",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to vote",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      if (hasVoted) {
        await votesAPI.unvote(id!);
        setHasVoted(false);
        setIdea({ ...idea, voteCount: idea.voteCount - 1 });
        toast({
          title: "Vote Removed",
          description: "Your vote has been removed",
        });
      } else {
        const response = await votesAPI.vote(id!);
        setHasVoted(true);
        setIdea({ ...idea, voteCount: response.data.voteCount });
        toast({
          title: "Vote Recorded!",
          description: response.message,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.error || "Failed to vote",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await commentsAPI.create(id!, commentText);
      setIdea({
        ...idea,
        comments: [response.data, ...idea.comments],
        commentCount: idea.commentCount + 1,
      });
      setCommentText("");
      toast({
        title: "Comment Added!",
        description: "Your feedback has been posted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.error || "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (user?.role !== "mentor" && user?.role !== "admin") return;

    try {
      await ideasAPI.updateStatus(id!, newStatus);
      setIdea({ ...idea, status: newStatus });
      toast({
        title: "Status Updated",
        description: `Idea status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.error || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleMentorPick = async () => {
    if (user?.role !== "mentor" && user?.role !== "admin") return;

    try {
      await ideasAPI.updateStatus(id!, idea.status, !idea.mentorPick);
      setIdea({ ...idea, mentorPick: !idea.mentorPick });
      toast({
        title: idea.mentorPick ? "Removed from Picks" : "Mentor's Pick! 🌟",
        description: idea.mentorPick
          ? "This idea is no longer a mentor's pick"
          : "This idea has been marked as a mentor's pick!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.error || "Failed to update mentor pick",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "UNDER_REVIEW":
        return <Clock className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "UNDER_REVIEW":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "REJECTED":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "DRAFT":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const isMentor = user?.role === "mentor" || user?.role === "admin";
  const isAuthor = user?.id === idea.author.id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm backdrop-blur-sm bg-card/95">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Image */}
        {idea.imageUrl && (
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={idea.imageUrl}
              alt={idea.title}
              className="w-full h-full object-cover"
            />
            {idea.mentorPick && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-lg">
                <Award className="w-4 h-4 mr-1" />
                Mentor's Pick
              </Badge>
            )}
          </div>
        )}

        {/* Title & Metadata */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-3">{idea.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{idea.category}</Badge>
                <Badge className={getStatusColor(idea.status)}>
                  {getStatusIcon(idea.status)}
                  <span className="ml-1">{idea.status.replace("_", " ")}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  by <span className="font-semibold text-foreground">{idea.author.name}</span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleVote}
              variant={hasVoted ? "default" : "outline"}
              className={hasVoted ? "bg-primary" : ""}
            >
              <ThumbsUp className={`w-4 h-4 mr-2 ${hasVoted ? "fill-white" : ""}`} />
              {idea.voteCount} {hasVoted ? "Voted" : "Vote"}
            </Button>
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              {idea.commentCount} Comments
            </Button>

            {/* Mentor Controls */}
            {isMentor && (
              <>
                <Button onClick={handleMentorPick} variant="outline" className="ml-auto">
                  <Award className="w-4 h-4 mr-2" />
                  {idea.mentorPick ? "Remove Pick" : "Mentor's Pick"}
                </Button>
                <Button onClick={() => handleStatusChange("APPROVED")} variant="default">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button onClick={() => handleStatusChange("REJECTED")} variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {idea.description}
              </p>
              {idea.videoLink && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Video Pitch</h3>
                  <a
                    href={idea.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on OneDrive →
                  </a>
                </div>
              )}
            </Card>

            {/* Comments */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                Discussion ({idea.comments.length})
              </h2>

              {/* Comment Form */}
              {user && (
                <div className="mb-6">
                  <Textarea
                    placeholder="Share your thoughts or feedback..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="mb-3"
                    rows={3}
                  />
                  <Button
                    onClick={handleComment}
                    disabled={submittingComment || !commentText.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              )}

              <Separator className="my-6" />

              {/* Comments List */}
              <div className="space-y-4">
                {idea.comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  idea.comments.map((comment: any) => (
                    <div key={comment.id} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-semibold text-foreground">
                            {comment.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-foreground">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Analysis */}
            {idea.aiProcessed && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">AI Analysis</h3>
                </div>

                <div className="space-y-4">
                  {/* Overall Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(idea.aiScore)}`}>
                        {idea.aiScore}
                      </span>
                    </div>
                    <Progress value={idea.aiScore} className="h-2" />
                  </div>

                  <Separator />

                  {/* Breakdown */}
                  <div className="space-y-3">
                    <ScoreItem label="Clarity" score={idea.clarityScore} />
                    <ScoreItem label="Innovation" score={idea.innovationScore} />
                    <ScoreItem label="Feasibility" score={idea.feasibilityScore} />
                    <ScoreItem label="Impact" score={idea.impactScore} />
                  </div>

                  {idea.aiAnalysis && (
                    <>
                      <Separator />
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {idea.aiAnalysis}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Author Info */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">About the Author</h3>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">{idea.author.name}</p>
                <p className="text-sm text-muted-foreground">{idea.author.email}</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">{idea.author.points} points</Badge>
                  <Badge variant="secondary">
                    {idea.author.badges.length} badges
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const ScoreItem = ({ label, score }: { label: string; score: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 60) return "bg-blue-500";
    if (s >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{score}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default IdeaDetail;

