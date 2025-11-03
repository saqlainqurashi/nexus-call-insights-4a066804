import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, Phone, Clock, TrendingUp, Users } from "lucide-react";
import { CallsTable } from "@/components/CallsTable";

interface Profile {
  client_name: string;
  agency_name: string | null;
}

interface Call {
  id: string;
  call_summary: string;
  transcript: string;
  recording_url: string;
  duration_seconds: number;
  hung_up_by: string;
  call_timestamp: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch calls
      const { data: callsData, error: callsError } = await supabase
        .from("calls")
        .select("*")
        .eq("user_id", session.user.id)
        .order("call_timestamp", { ascending: false });

      if (callsError) throw callsError;
      setCalls(callsData || []);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };

  const totalCalls = calls.length;
  const totalMinutes = Math.round(calls.reduce((acc, call) => acc + call.duration_seconds, 0) / 60);
  const avgDuration = totalCalls > 0 
    ? Math.round(calls.reduce((acc, call) => acc + call.duration_seconds, 0) / totalCalls)
    : 0;
  const userHangups = calls.filter(call => call.hung_up_by === "user").length;
  const agentHangups = calls.filter(call => call.hung_up_by === "agent").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Growth Nexus
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {profile?.client_name}
              {profile?.agency_name && ` • ${profile.agency_name}`}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-[var(--shadow-elegant)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCalls}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-elegant)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMinutes}</div>
              <p className="text-xs text-muted-foreground mt-1">Call duration</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-elegant)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgDuration}s</div>
              <p className="text-xs text-muted-foreground mt-1">Per call</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-elegant)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hangup Stats</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userHangups}/{agentHangups}</div>
              <p className="text-xs text-muted-foreground mt-1">User / Agent</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-[var(--shadow-elegant)]">
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>
              View all your call recordings, transcripts, and summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CallsTable calls={calls} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
