'use client';

import { Card, CardContent } from '@/components/ui/card';
import { THEME_LIST, THEMES } from '@/lib/constants/themes';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { cn } from '@/lib/utils';
import type { Theme } from '@/types/studio';

export function ThemePicker() {
  const themeId = useStudioStore((s) => s.themeId);
  const setTheme = useStudioStore((s) => s.setTheme);
  const active = THEMES[themeId];

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Color theme
          </h3>
          <span className="text-xs text-slate-500">{active.name}</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {THEME_LIST.map((theme) => (
            <ThemeSwatch
              key={theme.id}
              theme={theme}
              active={theme.id === themeId}
              onClick={() => setTheme(theme.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ThemeSwatch({
  theme,
  active,
  onClick,
}: {
  theme: Theme;
  active: boolean;
  onClick: () => void;
}) {
  const gradient = `linear-gradient(135deg, ${theme.bgGradient.join(', ')})`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={theme.name}
      className={cn(
        'group relative aspect-square rounded-xl overflow-hidden transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
        active
          ? 'ring-2 ring-slate-900 ring-offset-2 scale-105'
          : 'hover:scale-105',
      )}
      style={{ background: gradient }}
    >
      <span
        className="absolute top-1 right-1 size-2 rounded-full ring-1 ring-white/70"
        style={{ background: theme.accent }}
      />
    </button>
  );
}
