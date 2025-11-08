import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI sustainability assistant. How can I help you reduce environmental impact today?'
    }
  ]);
  const [input, setInput] = useState('');

  const suggestedQuestions = [
    "How can we reduce air pollution?",
    "Show waste collection efficiency",
    "Carbon reduction strategies"
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, 
      { role: 'user', content: input },
      { 
        role: 'assistant', 
        content: 'Based on current data analysis, I recommend implementing smart traffic management in high-pollution zones. This could reduce emissions by 15-20% within 3 months.' 
      }
    ]);
    setInput('');
  };

  return (
    <Card className="flex flex-col h-[600px]" data-testid="card-ai-copilot">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              AI Sustainability Copilot
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by Gemini
              </Badge>
            </CardTitle>
            <CardDescription>Get AI-powered sustainability insights</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4" data-testid="chat-messages">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
                data-testid={`message-${message.role}`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <Badge
              key={question}
              variant="outline"
              className="cursor-pointer hover-elevate active-elevate-2"
              onClick={() => setInput(question)}
              data-testid="badge-suggestion"
            >
              {question}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about sustainability actions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            data-testid="input-chat"
          />
          <Button onClick={handleSend} size="icon" data-testid="button-send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}