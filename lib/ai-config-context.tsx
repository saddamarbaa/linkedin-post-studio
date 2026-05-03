'use client';

import { createContext, useContext } from 'react';

const AiConfigContext = createContext(false);

export function AiConfigProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <AiConfigContext.Provider value={enabled}>
      {children}
    </AiConfigContext.Provider>
  );
}

/** True if ANTHROPIC_API_KEY is set on the server. SPEC §12. */
export function useAiEnabled(): boolean {
  return useContext(AiConfigContext);
}
