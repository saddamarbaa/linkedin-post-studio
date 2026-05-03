'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { validateAndConvertToBase64 } from '@/lib/utils/file-upload';

export function ProfileUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const profileImage = useStudioStore((s) => s.author.profileImageDataUrl);
  const name = useStudioStore((s) => s.author.name);
  const setProfileImage = useStudioStore((s) => s.setProfileImage);

  const handleFile = async (file: File) => {
    const result = await validateAndConvertToBase64(file);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setProfileImage(result.dataUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile photo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt="Profile preview"
                className="size-full object-cover"
              />
            ) : (
              (name?.[0] ?? '?').toUpperCase()
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
              {profileImage ? 'Replace' : 'Upload'}
            </Button>
            {profileImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setProfileImage(undefined)}
              >
                <Trash2 />
                Remove
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
