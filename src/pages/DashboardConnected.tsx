import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IdeaCard } from "@/components/IdeaCard";
import { Lightbulb, Search, TrendingUp, Plus, Trophy, Filter, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ideas as ideasAPI, analytics as analyticsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["All", "Science", "Humanities", "Business", "IT", "Design"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [ideas, setIdeas] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      const [analyticsRes] = await Promise.all([
        analyticsAPI.getOverview(),
      ]);
      setAnalytics(analyticsRes.data.overview);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await ideasAPI.getAll({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sortBy: "createdAt",
        order: "desc",
      });
      setIdeas(response.data.ideas);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.error || "Failed to load ideas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Shark Tank Mode</h1>
                <p className="text-xs text-muted-foreground">
                  {user ? `Welcome, ${user.name}` : "Innovation Hub"}
                </p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Browse
              </Button>
              <Button variant="ghost" onClick={() => navigate('/leaderboard')}>
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
              {user && (
                <Button onClick={() => navigate('/submit')} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Idea
                </Button>
              )}
              {user ? (
                <Button variant="ghost" onClick={handleLogout} size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
                  Login
                </Button>
              )}
            </nav>

            <Button 
              onClick={() => navigate('/submit')}
              className="md:hidden bg-gradient-primary"
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Stats */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Ideas" value={analytics.totalIdeas.toString()} icon={<Lightbulb className="w-5 h-5" />} />
            <StatCard title="This Week" value={`+${analytics.ideasThisWeek}`} icon={<TrendingUp className="w-5 h-5" />} trending />
            <StatCard title="Active Users" value={analytics.totalUsers.toString()} icon={<Lightbulb className="w-5 h-5" />} />
            <StatCard title="Avg AI Score" value={analytics.averageAiScore.toString()} icon={<Trophy className="w-5 h-5" />} />
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search ideas, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {CATEGORIES.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-primary text-white hover:opacity-90"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Ideas Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map(idea => (
                <IdeaCard key={idea.id} idea={{
                  ...idea,
                  author: idea.author?.name || "Unknown",
                  votes: idea.voteCount || 0,
                  comments: idea.commentCount || 0,
                }} />
              ))}
            </div>

            {ideas.length === 0 && (
              <div className="text-center py-16">
                <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No ideas found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedCategory !== "All" 
                    ? "Try adjusting your search or filters" 
                    : "Be the first to submit an innovative idea!"}
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, trending }: { title: string; value: string; icon: React.ReactNode; trending?: boolean }) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="text-muted-foreground">{icon}</div>
        {trending && (
          <Badge className="bg-accent text-accent-foreground">
            <TrendingUp className="w-3 h-3 mr-1" />
            Hot
          </Badge>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
};

export default Dashboard;

