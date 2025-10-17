import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Users, Award, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Deep Cocoa Brown Background */}
      <section
        className="relative overflow-hidden py-20 px-6"
        style={{ backgroundColor: "#654321" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZCRkJGNiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border-2"
            style={{
              backgroundColor: "rgba(251, 251, 246, 0.15)",
              borderColor: "#FFB366",
            }}
          >
            <Award className="w-4 h-4" style={{ color: "#FBFBF6" }} />
            <span className="text-sm font-medium" style={{ color: "#FBFBF6" }}>
              Campus Innovation Platform
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ color: "#FBFBF6" }}
          >
            Welcome to
            <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r"
              style={{
                backgroundImage: "linear-gradient(to right, #FFB366, #FF6B35)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Shark Tank Mode
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
            style={{ color: "rgba(251, 251, 246, 0.95)" }}
          >
            Where student ideas meet peer power and mentor wisdom. Transform
            your campus into an innovation hub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="shadow-glow font-semibold px-8 py-6 text-lg rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: "#FF6B35", color: "#ffffff" }}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="backdrop-blur-sm px-8 py-6 text-lg rounded-xl transition-all border-2 hover:bg-[#FBFBF6]"
              style={{
                borderColor: "#FFB366",
                color: "#FBFBF6",
                backgroundColor: "rgba(251, 251, 246, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FBFBF6";
                e.currentTarget.style.color = "#8B4513";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(251, 251, 246, 0.05)";
                e.currentTarget.style.color = "#FBFBF6";
              }}
            >
              Browse Ideas
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Soft Beige Background */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FBFBF6" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#8B4513" }}
            >
              Empowering Innovation Across Campus
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "#654321" }}
            >
              A mini Shark Tank for students and staff to pitch, validate, and
              bring ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Lightbulb className="w-8 h-8" />}
              title="Pitch Ideas"
              description="Share your vision with text, images, and video pitches"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Get Validated"
              description="Receive real-time votes, comments, and mentor feedback"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Engage Community"
              description="Discover, discuss, and support fellow innovators"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8" />}
              title="Earn Recognition"
              description="Unlock badges, climb leaderboards, and get rewarded"
            />
          </div>
        </div>
      </section>

      {/* Microsoft Integration Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "#F5F5EE" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border-2"
              style={{
                backgroundColor: "rgba(255, 107, 53, 0.1)",
                borderColor: "#FFB366",
              }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: "#FF6B35" }}
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0H10.8V10.8H0V0Z" fill="currentColor" />
                <path d="M12.2 0H23V10.8H12.2V0Z" fill="currentColor" />
                <path d="M0 12.2H10.8V23H0V12.2Z" fill="currentColor" />
                <path d="M12.2 12.2H23V23H12.2V12.2Z" fill="currentColor" />
              </svg>
              <span
                className="text-sm font-medium"
                style={{ color: "#FF6B35" }}
              >
                Seamless Microsoft Integration
              </span>
            </div>

            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#8B4513" }}
            >
              Built for Your Microsoft Ecosystem
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "#654321" }}
            >
              Shark Tank Mode integrates seamlessly with your existing Microsoft
              tools, making innovation effortless
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <IntegrationCard
              title="Microsoft Login"
              description="Single sign-on with your campus Microsoft account - no new passwords needed"
              features={[
                "Instant access",
                "Secure authentication",
                "Unified identity",
              ]}
            />
            <IntegrationCard
              title="OneDrive Compatible"
              description="Store and share video pitches directly from your OneDrive storage"
              features={[
                "Seamless file sharing",
                "Unlimited storage",
                "Easy collaboration",
              ]}
            />
            <IntegrationCard
              title="Teams Integration"
              description="Get notifications and collaborate on ideas right within Microsoft Teams"
              features={[
                "Real-time updates",
                "Channel integration",
                "Group discussions",
              ]}
            />
          </div>

          <div
            className="mt-16 rounded-2xl p-8 md:p-12 text-center shadow-lg"
            style={{ backgroundColor: "#FF6B35" }}
          >
            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: "#ffffff" }}
            >
              No Extra Setup Required
            </h3>
            <p
              className="text-xl max-w-2xl mx-auto mb-6"
              style={{ color: "rgba(255, 255, 255, 0.95)" }}
            >
              Your campus already uses Microsoft - Shark Tank Mode simply plugs
              right in. One login, infinite possibilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-base rounded-lg border-2"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  borderColor: "#FFB366",
                }}
              >
                📧 Microsoft Email
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-base rounded-lg border-2"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  borderColor: "#FFB366",
                }}
              >
                ☁️ OneDrive Storage
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-base rounded-lg border-2"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  borderColor: "#FFB366",
                }}
              >
                💬 Teams Notifications
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-base rounded-lg border-2"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  borderColor: "#FFB366",
                }}
              >
                🔐 Azure Security
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "#654321" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#FBFBF6" }}>
            Ready to Make an Impact?
          </h2>
          <p
            className="text-xl mb-8"
            style={{ color: "rgba(251, 251, 246, 0.9)" }}
          >
            Join your peers in shaping the future of your campus
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="shadow-glow font-semibold px-8 py-6 text-lg rounded-xl hover:opacity-90 transition-all"
            style={{ backgroundColor: "#FF6B35", color: "#ffffff" }}
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div
      className="rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border-2 hover:-translate-y-1"
      style={{ backgroundColor: "#ffffff", borderColor: "#E8D7C3" }}
    >
      <div
        className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
        style={{
          background: "linear-gradient(135deg, #FF6B35, #FFB366)",
          color: "#ffffff",
        }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: "#8B4513" }}>
        {title}
      </h3>
      <p style={{ color: "#654321" }}>{description}</p>
    </div>
  );
};

const IntegrationCard = ({
  title,
  description,
  features,
}: {
  title: string;
  description: string;
  features: string[];
}) => {
  return (
    <div
      className="rounded-xl p-6 shadow-card border-2"
      style={{ backgroundColor: "#ffffff", borderColor: "#E8D7C3" }}
    >
      <h3 className="text-xl font-semibold mb-3" style={{ color: "#8B4513" }}>
        {title}
      </h3>
      <p className="mb-4" style={{ color: "#654321" }}>
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm"
            style={{ color: "#654321" }}
          >
            <CheckCircle
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#FF6B35" }}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
