import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, TrendingUp, Lightbulb, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LEADERBOARD = [
  {
    rank: 1,
    name: "Sarah Chen",
    points: 1250,
    ideas: 8,
    votes: 342,
    badges: ["Top Pitcher", "Idea Refiner", "Community Hero"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    rank: 2,
    name: "Marcus Johnson",
    points: 1180,
    ideas: 12,
    votes: 298,
    badges: ["Top Pitcher", "Innovation Champion"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
  {
    rank: 3,
    name: "Emma Williams",
    points: 1050,
    ideas: 6,
    votes: 287,
    badges: ["Mentor Magnet", "Rising Star"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    rank: 4,
    name: "David Park",
    points: 920,
    ideas: 5,
    votes: 251,
    badges: ["Top Pitcher", "Community Hero"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    rank: 5,
    name: "Lisa Anderson",
    points: 875,
    ideas: 9,
    votes: 223,
    badges: ["Idea Refiner"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    rank: 6,
    name: "Ryan Thompson",
    points: 840,
    ideas: 7,
    votes: 209,
    badges: ["Rising Star"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan",
  },
];

const BADGES = [
  { name: "Top Pitcher", description: "Submit 5+ ideas with 10+ votes each", icon: Trophy, color: "bg-secondary" },
  { name: "Idea Refiner", description: "Receive 100+ total votes", icon: TrendingUp, color: "bg-primary" },
  { name: "Mentor Magnet", description: "Get 3+ mentor endorsements", icon: Award, color: "bg-accent" },
  { name: "Community Hero", description: "Help others with 50+ comments", icon: Lightbulb, color: "bg-primary-light" },
  { name: "Innovation Champion", description: "Top 3 for 3 consecutive weeks", icon: Medal, color: "bg-secondary" },
  { name: "Rising Star", description: "New member with exceptional ideas", icon: TrendingUp, color: "bg-accent" },
];

const Leaderboard = () => {
  const navigate = useNavigate();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-secondary" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-accent" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">#{rank}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
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
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">Celebrating campus innovation champions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* 2nd Place */}
          <div className="md:order-1 order-2">
            <PodiumCard user={LEADERBOARD[1]} />
          </div>
          {/* 1st Place */}
          <div className="md:order-2 order-1">
            <PodiumCard user={LEADERBOARD[0]} featured />
          </div>
          {/* 3rd Place */}
          <div className="md:order-3 order-3">
            <PodiumCard user={LEADERBOARD[2]} />
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Top Innovators</h2>
          <div className="space-y-3">
            {LEADERBOARD.slice(3).map(user => (
              <div
                key={user.rank}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-shrink-0">{getRankIcon(user.rank)}</div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{user.ideas} ideas</span>
                    <span>{user.votes} votes</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{user.points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Achievement Badges</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BADGES.map(badge => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg ${badge.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};

const PodiumCard = ({ user, featured }: { user: typeof LEADERBOARD[0]; featured?: boolean }) => {
  return (
    <Card
      className={`p-6 text-center ${
        featured ? "shadow-glow border-2 border-primary md:-translate-y-4" : "shadow-card"
      }`}
    >
      <div className="mb-4 relative">
        <img
          src={user.avatar}
          alt={user.name}
          className={`mx-auto rounded-full border-4 ${
            featured ? "w-24 h-24 border-primary" : "w-20 h-20 border-border"
          }`}
        />
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${
            featured ? "w-12 h-12" : "w-10 h-10"
          } rounded-full bg-card border-2 border-border flex items-center justify-center`}
        >
          {user.rank === 1 && <Trophy className="w-6 h-6 text-secondary" />}
          {user.rank === 2 && <Medal className="w-5 h-5 text-muted-foreground" />}
          {user.rank === 3 && <Award className="w-5 h-5 text-accent" />}
        </div>
      </div>

      <h3 className={`font-bold text-foreground mb-1 ${featured ? "text-xl" : "text-lg"}`}>
        {user.name}
      </h3>

      <div className={`font-bold mb-4 ${featured ? "text-3xl text-primary" : "text-2xl text-foreground"}`}>
        {user.points}
        <span className="text-sm text-muted-foreground ml-1">pts</span>
      </div>

      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div>
          <div className="font-semibold text-foreground">{user.ideas}</div>
          <div className="text-muted-foreground">Ideas</div>
        </div>
        <div>
          <div className="font-semibold text-foreground">{user.votes}</div>
          <div className="text-muted-foreground">Votes</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 justify-center">
        {user.badges.slice(0, 2).map(badge => (
          <Badge key={badge} variant="secondary" className="text-xs">
            {badge}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default Leaderboard;
