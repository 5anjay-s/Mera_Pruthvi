import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  initials: string;
}

export default function Leaderboard() {
  const entries: LeaderboardEntry[] = [
    { rank: 1, name: "Sarah Chen", points: 1250, initials: "SC" },
    { rank: 2, name: "Michael Kumar", points: 1180, initials: "MK" },
    { rank: 3, name: "Emma Wilson", points: 950, initials: "EW" },
    { rank: 4, name: "James Rodriguez", points: 820, initials: "JR" },
    { rank: 5, name: "Lisa Patel", points: 760, initials: "LP" }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card data-testid="card-leaderboard">
      <CardHeader>
        <CardTitle>Community Leaderboard</CardTitle>
        <CardDescription>Top eco-warriors this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                entry.rank <= 3 ? 'bg-muted/50' : ''
              } hover-elevate`}
              data-testid={`leaderboard-entry-${entry.rank}`}
            >
              <div className="w-8 text-center font-bold text-muted-foreground">
                {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {entry.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium text-sm">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.points} eco-points
                </p>
              </div>
              
              {entry.rank === 1 && (
                <Badge variant="default" className="bg-primary/10 text-primary border-0">
                  Champion
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}