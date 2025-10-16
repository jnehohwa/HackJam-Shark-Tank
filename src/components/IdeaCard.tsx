import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, TrendingUp, Award } from "lucide-react";
import { useState } from "react";

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
  };
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const [votes, setVotes] = useState(idea.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(prev => prev + 1);
      setHasVoted(true);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <Card className="group overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border">
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
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {idea.category}
          </Badge>
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
          {idea.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* AI Score */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
          <TrendingUp className={`w-4 h-4 ${getScoreColor(idea.aiScore)}`} />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">AI Score</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    idea.aiScore >= 80
                      ? "bg-accent"
                      : idea.aiScore >= 60
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                  style={{ width: `${idea.aiScore}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${getScoreColor(idea.aiScore)}`}>
                {idea.aiScore}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            by <span className="font-medium text-foreground">{idea.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVote}
              className={`h-8 ${hasVoted ? "text-primary" : ""}`}
            >
              <ThumbsUp className={`w-4 h-4 mr-1 ${hasVoted ? "fill-primary" : ""}`} />
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
