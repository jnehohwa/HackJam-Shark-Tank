import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleMicrosoftLogin = () => {
    // Mock login - redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      
      <Card className="relative w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-glow">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Shark Tank Mode
          </h1>
          <p className="text-muted-foreground">
            Sign in to start innovating
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleMicrosoftLogin}
            className="w-full bg-gradient-primary text-white hover:opacity-90 font-semibold py-6 text-lg shadow-card-hover"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H10.8V10.8H0V0Z" fill="white"/>
              <path d="M12.2 0H23V10.8H12.2V0Z" fill="white"/>
              <path d="M0 12.2H10.8V23H0V12.2Z" fill="white"/>
              <path d="M12.2 12.2H23V23H12.2V12.2Z" fill="white"/>
            </svg>
            Sign in with Microsoft
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue as guest
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={handleMicrosoftLogin}
              className="w-full"
            >
              Quick Demo Login
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate('/')}
              className="text-primary hover:underline font-medium"
            >
              Learn more
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
