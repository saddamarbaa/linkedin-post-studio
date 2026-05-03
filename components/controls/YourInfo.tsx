'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { THEMES } from '@/lib/constants/themes';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { validateAndConvertToBase64 } from '@/lib/utils/file-upload';

// Combined "Your Info" card — profile photo + name + tagline in one container
// (Old-code.ts:1988). Profile fallback is a gradient circle that uses the
// active theme's bgGradient stops, so the avatar always feels in-theme.
export function YourInfo() {
  const inputRef = useRef<HTMLInputElement>(null);

  const themeId = useStudioStore((s) => s.themeId);
  const author = useStudioStore((s) => s.author);
  const profileImage = useStudioStore((s) => s.author.profileImageDataUrl);
  const setAuthor = useStudioStore((s) => s.setAuthor);
  const setProfileImage = useStudioStore((s) => s.setProfileImage);

  const theme = THEMES[themeId];
  const initial = (author.name?.[0] ?? '?').toUpperCase();

  const fallbackGradient = `linear-gradient(135deg, ${
    theme.bgGradient[0]
  }, ${theme.bgGradient[theme.bgGradient.length - 1]})`;

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
      <CardContent className="space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Your info
        </h3>

        <div>
          <Label className="block text-xs font-semibold text-slate-600 mb-2">
            Profile photo
          </Label>

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

          <div className="flex items-center gap-3">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt="Profile preview"
                className="size-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
            ) : (
              <div
                aria-hidden
                className="size-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-sm"
                style={{ background: fallbackGradient }}
              >
                {initial}
              </div>
            )}

            <div className="flex-1 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Upload className="size-3" />
                {profileImage ? 'Change photo' : 'Upload photo'}
              </button>
              {profileImage && (
                <button
                  type="button"
                  onClick={() => setProfileImage(undefined)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <X className="size-3" />
                  Remove
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Square photos work best · Max 5 MB
          </p>
        </div>

        <Field
          id="info-name"
          label="Name"
          value={author.name}
          onChange={(name) => setAuthor({ name })}
        />
        <Field
          id="info-tagline"
          label="Title / Tagline"
          value={author.tagline}
          onChange={(tagline) => setAuthor({ tagline })}
        />
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-600 mb-1.5"
      >
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border-slate-200"
      />
    </div>
  );
}
