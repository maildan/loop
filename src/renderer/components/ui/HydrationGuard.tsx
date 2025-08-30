'use client';

import { useEffect, useState } from 'react';

// 🔥 기가차드 하이드레이션 보호 컴포넌트
interface HydrationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationGuard({ children, fallback = null }: HydrationGuardProps): React.ReactElement {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return <>{isHydrated ? children : fallback}</>;
}

export default HydrationGuard;
