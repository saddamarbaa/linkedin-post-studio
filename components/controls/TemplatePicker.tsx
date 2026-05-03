'use client';

import { Brain, Layers, Zap } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  TEMPLATES,
  type TemplateGroup,
  type TemplateMeta,
} from '@/lib/constants/templates';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { cn } from '@/lib/utils';
import type { TemplateId } from '@/types/studio';

const ALL = Object.values(TEMPLATES);

// SPEC §10.2 — three groups, all visible at once. Per-group accent so the eye
// can quickly find the section it wants (matches Old-code.ts:1599 treatment).
const GROUPS: {
  id: TemplateGroup;
  label: string;
  Icon: typeof Zap;
  // Tailwind classes for the section heading + the active button background.
  headingClass: string;
  activeClass: string;
  idleClass: string;
}[] = [
  {
    id: 'quick',
    label: 'Quick AI · type your idea',
    Icon: Zap,
    headingClass: 'text-amber-600',
    activeClass:
      'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md',
    idleClass:
      'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200',
  },
  {
    id: 'ml',
    label: 'ML & AI templates',
    Icon: Brain,
    headingClass: 'text-purple-600',
    activeClass:
      'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md',
    idleClass: 'bg-slate-50 text-slate-700 hover:bg-slate-100',
  },
  {
    id: 'basic',
    label: 'Basic templates',
    Icon: Layers,
    headingClass: 'text-slate-500',
    activeClass: 'bg-slate-900 text-white shadow-md',
    idleClass: 'bg-slate-50 text-slate-700 hover:bg-slate-100',
  },
];

export function TemplatePicker() {
  const templateId = useStudioStore((s) => s.templateId);
  const setTemplate = useStudioStore((s) => s.setTemplate);

  return (
    <Card>
      <CardContent className="space-y-5">
        {GROUPS.map((g) => {
          const items = ALL.filter((t) => t.group === g.id);
          if (g.id === 'quick') {
            return (
              <QuickGroup
                key={g.id}
                heading={g.label}
                HeadingIcon={g.Icon}
                headingClass={g.headingClass}
                items={items}
                activeId={templateId}
                onPick={setTemplate}
              />
            );
          }
          return (
            <Group
              key={g.id}
              heading={g.label}
              HeadingIcon={g.Icon}
              headingClass={g.headingClass}
              activeClass={g.activeClass}
              idleClass={g.idleClass}
              items={items}
              activeId={templateId}
              onPick={setTemplate}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

function QuickGroup({
  heading,
  HeadingIcon,
  headingClass,
  items,
  activeId,
  onPick,
}: {
  heading: string;
  HeadingIcon: typeof Zap;
  headingClass: string;
  items: TemplateMeta[];
  activeId: TemplateId;
  onPick: (id: TemplateId) => void;
}) {
  return (
    <section>
      <h3
        className={cn(
          'text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5',
          headingClass,
        )}
      >
        <HeadingIcon className="size-3.5" />
        {heading}
      </h3>
      <div className="grid gap-2">
        {items.map((t) => {
          const Icon = t.Icon;
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onPick(t.id)}
              aria-pressed={active}
              title={t.description}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold text-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500',
                active
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {t.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Group({
  heading,
  HeadingIcon,
  headingClass,
  activeClass,
  idleClass,
  items,
  activeId,
  onPick,
}: {
  heading: string;
  HeadingIcon: typeof Zap;
  headingClass: string;
  activeClass: string;
  idleClass: string;
  items: TemplateMeta[];
  activeId: TemplateId;
  onPick: (id: TemplateId) => void;
}) {
  return (
    <section>
      <h3
        className={cn(
          'text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5',
          headingClass,
        )}
      >
        <HeadingIcon className="size-3.5" />
        {heading}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {items.map((t) => {
          const Icon = t.Icon;
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onPick(t.id)}
              aria-pressed={active}
              title={t.description}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
                active ? activeClass : idleClass,
              )}
            >
              <Icon className="size-4" aria-hidden />
              <span className="text-[11px] font-semibold leading-tight text-center">
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { TemplateGroup };
