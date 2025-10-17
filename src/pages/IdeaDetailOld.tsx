import { useState } from "react";
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
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";

// Mock data for ideas
const MOCK_IDEAS: Record<string, any> = {
  "1": {
    id: "1",
    title: "AI-Powered Study Assistant",
    description: "A personalized AI tutor that adapts to each student's learning style and provides 24/7 homework help. This innovative platform uses machine learning to understand how students learn best and adjusts its teaching methods accordingly.\n\nThe assistant would integrate with existing learning management systems and provide real-time feedback on assignments, suggest study materials based on individual progress, and even predict areas where students might struggle before they encounter difficulties.",
    category: "IT",
    author: {
      id: "u1",
      name: "Sarah Chen",
      email: "sarah.chen@university.edu",
      points: 420,
      badges: ["Top Pitcher", "Innovation Champion"]
    },
    voteCount: 42,
    commentCount: 8,
    aiScore: 85,
    clarityScore: 88,
    innovationScore: 90,
    feasibilityScore: 75,
    impactScore: 87,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tags: ["AI", "Education", "Mobile App"],
    mentorPick: true,
    status: "APPROVED",
    aiProcessed: true,
    aiAnalysis: "This idea demonstrates strong potential with clear benefits for students. The AI adaptation to learning styles is innovative and addresses a real need. Consider partnerships with existing education technology providers for faster implementation. Focus on data privacy and ensuring the AI doesn't replace human interaction entirely.",
    videoLink: "https://onedrive.live.com/example",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: "c1",
        content: "This is exactly what our campus needs! Would love to be part of the beta testing.",
        user: { id: "u2", name: "Marcus Johnson" },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "c2",
        content: "Have you considered accessibility features for students with different learning disabilities?",
        user: { id: "u3", name: "Emma Williams" },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "c3",
        content: "Great idea! How would this integrate with our current LMS?",
        user: { id: "u4", name: "David Park" },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  "2": {
    id: "2",
    title: "Sustainable Campus Cafeteria",
    description: "Transform campus dining with locally sourced ingredients, zero-waste packaging, and composting programs. This initiative aims to reduce our campus's carbon footprint while supporting local farmers and educating students about sustainable food systems.",
    category: "Science",
    author: {
      id: "u2",
      name: "Marcus Johnson",
      email: "marcus.j@university.edu",
      points: 380,
      badges: ["Community Hero"]
    },
    voteCount: 38,
    commentCount: 12,
    aiScore: 78,
    clarityScore: 82,
    innovationScore: 70,
    feasibilityScore: 85,
    impactScore: 75,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    tags: ["Sustainability", "Food", "Environment"],
    mentorPick: false,
    status: "UNDER_REVIEW",
    aiProcessed: true,
    aiAnalysis: "Solid sustainability initiative with clear implementation path. The focus on local sourcing and composting is practical. Consider cost analysis and phased rollout. Strong community impact potential.",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: "c4",
        content: "Love this! Can we start with one cafeteria as a pilot?",
        user: { id: "u1", name: "Sarah Chen" },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  "3": {
    id: "3",
    title: "Virtual Career Fair Platform",
    description: "An immersive VR platform connecting students with employers for networking and interviews. Break down geographical barriers and make career opportunities accessible to all students regardless of location.",
    category: "Business",
    author: {
      id: "u3",
      name: "Emma Williams",
      email: "emma.w@university.edu",
      points: 350,
      badges: ["Rising Star"]
    },
    voteCount: 35,
    commentCount: 6,
    aiScore: 72,
    clarityScore: 75,
    innovationScore: 85,
    feasibilityScore: 60,
    impactScore: 72,
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    tags: ["VR", "Careers", "Networking"],
    mentorPick: false,
    status: "UNDER_REVIEW",
    aiProcessed: true,
    aiAnalysis: "Innovative approach to career fairs. VR technology adds value but may limit accessibility. Consider hybrid approach with traditional and VR options. High innovation score.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  "4": {
    id: "4",
    title: "Mental Health Chatbot",
    description: "Anonymous peer support chatbot providing resources and connecting students with counseling services. Available 24/7 to help students in their time of need.",
    category: "Humanities",
    author: {
      id: "u4",
      name: "David Park",
      email: "david.p@university.edu",
      points: 510,
      badges: ["Top Pitcher", "Mentor Magnet", "Community Hero"]
    },
    voteCount: 51,
    commentCount: 15,
    aiScore: 88,
    clarityScore: 90,
    innovationScore: 85,
    feasibilityScore: 88,
    impactScore: 92,
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    tags: ["Mental Health", "AI", "Wellbeing"],
    mentorPick: true,
    status: "APPROVED",
    aiProcessed: true,
    aiAnalysis: "Excellent idea addressing critical student need. Strong feasibility and impact scores. Ensure proper privacy measures and professional oversight. Consider partnering with campus counseling center.",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: "c5",
        content: "This could save lives. Really important work.",
        user: { id: "u1", name: "Sarah Chen" },
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "c6",
        content: "Have you reached out to the counseling center yet?",
        user: { id: "u5", name: "Lisa Anderson" },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  "5": {
    id: "5",
    title: "Campus Innovation Lab",
    description: "A physical makerspace with 3D printers, laser cutters, and tools for students to prototype their ideas. Democratize access to advanced manufacturing tools.",
    category: "Design",
    author: {
      id: "u5",
      name: "Lisa Anderson",
      email: "lisa.a@university.edu",
      points: 290,
      badges: ["First Idea", "Engaged Voter"]
    },
    voteCount: 29,
    commentCount: 9,
    aiScore: 81,
    clarityScore: 85,
    innovationScore: 75,
    feasibilityScore: 80,
    impactScore: 84,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    tags: ["Makerspace", "Prototyping", "Hardware"],
    mentorPick: false,
    status: "UNDER_REVIEW",
    aiProcessed: true,
    aiAnalysis: "Well-thought-out proposal with clear space and equipment needs. Consider funding models and student training programs. Strong potential for cross-disciplinary collaboration.",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  "6": {
    id: "6",
    title: "Smart Parking System",
    description: "IoT sensors and mobile app to find available parking spots in real-time across campus. Save time and reduce traffic congestion.",
    category: "IT",
    author: {
      id: "u6",
      name: "Ryan Thompson",
      email: "ryan.t@university.edu",
      points: 440,
      badges: ["Top Pitcher", "Innovation Champion"]
    },
    voteCount: 44,
    commentCount: 11,
    aiScore: 76,
    clarityScore: 80,
    innovationScore: 65,
    feasibilityScore: 88,
    impactScore: 70,
    imageUrl: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80",
    tags: ["IoT", "Mobile", "Transportation"],
    mentorPick: false,
    status: "UNDER_REVIEW",
    aiProcessed: true,
    aiAnalysis: "Practical solution to common campus problem. Technology is proven and feasible. Consider integration with campus card system and visitor access. Good ROI potential.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  }
};

const IdeaDetailOld = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [idea, setIdea] = useState(() => MOCK_IDEAS[id || "1"] || MOCK_IDEAS["1"]);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(idea.comments);

  if (!idea) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Idea not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleVote = () => {
    if (hasVoted) {
      setIdea({ ...idea, voteCount: idea.voteCount - 1 });
      setHasVoted(false);
    } else {
      setIdea({ ...idea, voteCount: idea.voteCount + 1 });
      setHasVoted(true);
    }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: `c${Date.now()}`,
      content: commentText,
      user: { id: "current", name: "You" },
      createdAt: new Date().toISOString()
    };
    
    setComments([newComment, ...comments]);
    setIdea({ ...idea, commentCount: idea.commentCount + 1 });
    setCommentText("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "UNDER_REVIEW":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "UNDER_REVIEW":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
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
                Discussion ({comments.length})
              </h2>

              {/* Comment Form */}
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
                  disabled={!commentText.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  comments.map((comment: any) => (
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

export default IdeaDetailOld;

