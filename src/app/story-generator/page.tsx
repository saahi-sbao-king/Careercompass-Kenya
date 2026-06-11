"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateStory } from '@/ai/flows/story-generator';
import { Sparkles, Wand2, Copy, History, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function StoryGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateStory({ prompt });
      setStory(result);
    } catch (err) {
      console.error('Story generation error:', err);
      toast({ 
        title: "Generation failed", 
        description: "The AI was unable to complete the request. Please try a different prompt.",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(story);
    toast({ title: "Story copied to clipboard!" });
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-headline font-bold">AI Career Storyteller</h1>
        <p className="text-muted-foreground text-lg">Enter a career or a scenario, and our AI will write an inspiring story for you.</p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Creative Prompt
            </CardTitle>
            <CardDescription>e.g. "A story about a girl from Kisumu who becomes a world-class AI researcher."</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              placeholder="Tell me a story about..." 
              className="min-h-[120px] resize-none"
            />
            <Button className="w-full" onClick={handleGenerate} disabled={isLoading || !prompt}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Writing your story...
                </>
              ) : "Generate Story"}
            </Button>
          </CardContent>
        </Card>

        {story && (
          <Card className="animate-in fade-in zoom-in-95 duration-500">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
              <CardTitle className="text-lg">Your Inspiring Story</CardTitle>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {story}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
