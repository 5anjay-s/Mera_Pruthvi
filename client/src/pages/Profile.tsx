import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Award, TrendingUp, Leaf, Zap, Trophy, Medal, Star } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        setLocation('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-pulse text-lg text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-destructive text-lg font-semibold" data-testid="text-unauthorized">
                Unauthorized Access
              </div>
              <p className="text-muted-foreground">
                You need to be logged in to view this page.
              </p>
              <Button 
                onClick={() => setLocation('/')} 
                className="w-full"
                data-testid="button-back-home"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typedUser = user as User;
  const displayName = typedUser.firstName && typedUser.lastName
    ? `${typedUser.firstName} ${typedUser.lastName}`
    : typedUser.firstName || typedUser.email || 'User';
  
  const userInitials = typedUser.firstName && typedUser.lastName
    ? `${typedUser.firstName[0]}${typedUser.lastName[0]}`.toUpperCase()
    : typedUser.email?.substring(0, 2).toUpperCase() || 'U';

  const achievements = [
    { id: 1, name: "First Steps", description: "Joined Mera Pruthvi", icon: Star, earned: true },
    { id: 2, name: "Eco Warrior", description: "Earned 100 eco-points", icon: Leaf, earned: true },
    { id: 3, name: "Climate Champion", description: "Reduced 50kg CO₂", icon: TrendingUp, earned: true },
    { id: 4, name: "Community Leader", description: "Reported 10 issues", icon: Award, earned: false },
    { id: 5, name: "Recycling Master", description: "Classified 100 items", icon: Trophy, earned: false },
    { id: 6, name: "Sustainability Pro", description: "30 days streak", icon: Medal, earned: false },
  ];

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-profile-title">My Profile</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24" data-testid="img-avatar">
                  <AvatarImage src={typedUser.profileImageUrl || undefined} alt={displayName} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold" data-testid="text-username">
                    {displayName}
                  </h2>
                  <p className="text-sm text-muted-foreground" data-testid="text-email">
                    {typedUser.email}
                  </p>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eco-Points</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-primary" data-testid="text-eco-points">
                  {typedUser.ecoPoints?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total earned
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Level</CardTitle>
                <Trophy className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-primary" data-testid="text-level">
                  {typedUser.level || 1}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {typedUser.level >= 10 ? 'Sustainability Master' : typedUser.level >= 5 ? 'Eco Warrior' : 'Getting Started'}
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
                <Leaf className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-primary" data-testid="text-carbon-footprint">
                  {typedUser.carbonFootprint?.toFixed(0) || 0}kg
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  CO₂ reduced
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle data-testid="text-achievements-title">Achievements</CardTitle>
              <Badge variant="outline" data-testid="badge-achievement-count">
                {earnedCount}/{achievements.length} Earned
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.earned
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted/30 border-muted opacity-60'
                    }`}
                    data-testid={`achievement-${achievement.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-md ${
                          achievement.earned
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {achievement.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
