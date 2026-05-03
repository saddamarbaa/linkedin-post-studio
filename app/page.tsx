import { StudioLayout } from '@/components/studio/StudioLayout';

// Server component — reads ANTHROPIC_API_KEY at render time so the client
// can hide AI affordances when the key is missing (SPEC §12). The key
// itself never crosses the network.
export default function Page() {
  const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);
  return <StudioLayout aiEnabled={aiEnabled} />;
}
