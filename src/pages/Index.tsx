import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Phone, TrendingUp, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Growth Nexus
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              AI Calling Agent Analytics Dashboard
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="p-6 rounded-lg border border-border bg-card shadow-[var(--shadow-elegant)]">
              <Phone className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Call Analytics</h3>
              <p className="text-muted-foreground">
                Track all your AI calling agent conversations in one place
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card shadow-[var(--shadow-elegant)]">
              <TrendingUp className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
              <p className="text-muted-foreground">
                Monitor call duration, outcomes, and engagement rates
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card shadow-[var(--shadow-elegant)]">
              <BarChart3 className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Access transcripts, recordings, and AI-generated summaries
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
