'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStudioStore } from '@/lib/store/useStudioStore';

export function AuthorInfo() {
  const name = useStudioStore((s) => s.author.name);
  const tagline = useStudioStore((s) => s.author.tagline);
  const setAuthor = useStudioStore((s) => s.setAuthor);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Author</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="author-name">Name</Label>
          <Input
            id="author-name"
            value={name}
            onChange={(e) => setAuthor({ name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="author-tagline">Tagline</Label>
          <Input
            id="author-tagline"
            value={tagline}
            onChange={(e) => setAuthor({ tagline: e.target.value })}
            placeholder="What you do"
          />
        </div>
      </CardContent>
    </Card>
  );
}
