import { useState, useCallback } from 'react';
import { ProductScene } from './components/scene/ProductScene';
import { OverlayUI } from './components/ui/OverlayUI';

export function App() {
  const [isActive, setIsActive] = useState(false);
  const [key, setKey] = useState(0);

  const handleToggleState = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setKey((prev) => prev + 1);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030708]">
      <ProductScene
        key={key}
        isActive={isActive}
        setIsActive={setIsActive}
      />
      <OverlayUI
        isActive={isActive}
        onToggleState={handleToggleState}
        onReset={handleReset}
      />
    </main>
  );
}

export default App;
