import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  Lightbulb,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl, getInitials } from "@/lib/avatars";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    votes: number;
    comments: number;
    aiScore: number;
    imageUrl: string;
    tags: string[];
    mentorPick: boolean;
    status?: string;
    aiProcessed?: boolean;
    createdAt?: string;
  };
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState(idea.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (!hasVoted) {
      setVotes((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/idea/${idea.id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-3 h-3" />;
      case "UNDER_REVIEW":
        return <Clock className="w-3 h-3" />;
      case "REJECTED":
        return <XCircle className="w-3 h-3" />;
      case "DRAFT":
        return <Lightbulb className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
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

  return (
    <Card
      onClick={handleCardClick}
      className="group overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={idea.imageUrl}
          alt={idea.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {idea.mentorPick && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground shadow-lg">
            <Award className="w-3 h-3 mr-1" />
            Mentor's Pick
          </Badge>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {idea.category}
          </Badge>
          {idea.status && (
            <Badge
              className={`${getStatusColor(idea.status)} backdrop-blur-sm`}
            >
              {getStatusIcon(idea.status)}
              <span className="ml-1 text-xs">
                {idea.status.replace("_", " ")}
              </span>
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {idea.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {idea.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* AI Score - Enhanced */}
        <div className="mb-4 p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {idea.aiProcessed ? (
                <TrendingUp
                  className={`w-4 h-4 ${getScoreColor(idea.aiScore)}`}
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse" />
              )}
              <span className="text-xs font-medium text-muted-foreground">
                {idea.aiProcessed ? "AI Analysis" : "Analyzing..."}
              </span>
            </div>
            <div className="ml-auto">
              <span
                className={`text-lg font-bold ${getScoreColor(idea.aiScore)}`}
              >
                {idea.aiScore}
              </span>
              <span className="text-xs text-muted-foreground ml-1">/100</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${getScoreBgColor(
                  idea.aiScore
                )}`}
                style={{ width: `${idea.aiScore}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {idea.aiScore >= 80
                ? "Excellent"
                : idea.aiScore >= 60
                ? "Good"
                : idea.aiScore >= 40
                ? "Fair"
                : "Needs Work"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              className="w-6 h-6 border"
              style={{ borderColor: "#E8D7C3" }}
            >
              <AvatarImage src={getAvatarUrl(idea.author)} alt={idea.author} />
              <AvatarFallback
                className="text-white text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #FF6B35, #FFB366)",
                }}
              >
                {getInitials(idea.author)}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-muted-foreground">
              by{" "}
              <span className="font-medium text-foreground">{idea.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVote}
              className={`h-8 ${hasVoted ? "text-primary" : ""}`}
            >
              <ThumbsUp
                className={`w-4 h-4 mr-1 ${hasVoted ? "fill-primary" : ""}`}
              />
              {votes}
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <MessageCircle className="w-4 h-4 mr-1" />
              {idea.comments}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
