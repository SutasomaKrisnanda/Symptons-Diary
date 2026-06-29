import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import Onboarding from './components/layout/Onboarding';
import AppLayout from './components/layout/AppLayout';

function App() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent hydration mismatch / flash on load
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-app w-full bg-bgapp flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex font-sans text-gray-800 h-app overflow-hidden bg-bgapp">
      {!hasOnboarded ? <Onboarding /> : <AppLayout />}
    </div>
  );
}

export default App;
