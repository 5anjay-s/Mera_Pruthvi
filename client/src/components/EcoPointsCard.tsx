import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award } from "lucide-react";

interface Achievement {
  name: string;
  icon: typeof Trophy;
  unlocked: boolean;
}

export default function EcoPointsCard() {
  const points = 450;
  const level = 5;
  const nextLevelPoints = 500;
  const progress = (points / nextLevelPoints) * 100;

  const achievements: Achievement[] = [
    { name: "First Report", icon: Star, unlocked: true },
    { name: "Eco Warrior", icon: Trophy, unlocked: true },
    { name: "Champion", icon: Award, unlocked: false }
  ];

  return (
    <Card data-testid="card-eco-points">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Eco-Points</CardTitle>
            <CardDescription>Keep up the great work!</CardDescription>
          </div>
          <Badge variant="default" className="text-lg px-3 py-1">
            Level {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold font-mono text-primary" data-testid="text-points">
                {points}
              </span>
              <span className="text-muted-foreground text-sm">/ {nextLevelPoints} points</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {nextLevelPoints - points} points to Level {level + 1}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Achievements</h4>
            <div className="flex gap-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.name}
                    className={`flex flex-col items-center gap-1 ${
                      achievement.unlocked ? 'opacity-100' : 'opacity-30'
                    }`}
                    data-testid={`achievement-${achievement.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className={`rounded-full p-3 ${
                      achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <span className="text-xs text-center">{achievement.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reported waste overflow</span>
                <span className="text-primary font-medium">+10 pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed survey</span>
                <span className="text-primary font-medium">+5 pts</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}