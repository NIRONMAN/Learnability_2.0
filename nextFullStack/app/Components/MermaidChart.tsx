import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useGesture } from "react-use-gesture";

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace',
});

interface MermaidComponentProps {
  chart: string;
}

const MermaidComponent: React.FC<MermaidComponentProps> = ({ chart }) => {
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1 // Default zoom
  });
  const mermaidRef = useRef<HTMLDivElement>(null);

  useGesture({
    onDrag: ({ movement: [mx, my], first, memo }) => {
      if (first) return [transform.x, transform.y];
      const [startX, startY] = memo || [0, 0];
      setTransform(prev => ({
        ...prev,
        x: startX + mx,
        y: startY + my
      }));
      return memo;
    },
    onPinch: ({ offset: [d] }) => {
      setTransform(prev => ({
        ...prev,
        scale: Math.max(1, Math.min(10, 1 + d / 200))
      }));
    }
  }, {
    domTarget: mermaidRef,
    eventOptions: { passive: false }
  });

  useEffect(() => {
    const initializeMermaid = async () => {
      if (mermaidRef.current) {
        const { svg, bindFunctions } = await mermaid.render(`mermaid-diagram-${1}`, chart);
        mermaidRef.current.innerHTML = svg;
        bindFunctions?.(mermaidRef.current);

        // Add event listeners for nodes
        const nodes = mermaidRef.current.querySelectorAll('g[class*="node"]');
        nodes.forEach((node) => {
          node.addEventListener('click', () => {
            // alert(`Node clicked: ${node.id}`);
          });
        });
      }
    };

    initializeMermaid();

    // Prevent default zoom behavior
    const preventDefault = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', preventDefault, { passive: false });

    // Clean up
    return () => {
      if (mermaidRef.current) {
        const nodes = mermaidRef.current.querySelectorAll('g[class*="node"]');
        nodes.forEach((node) => {
          node.removeEventListener('click', () => {
            alert(`Node clicked: ${node.id}`);
          });
        });
      }
      document.removeEventListener('wheel', preventDefault);
    };
  }, [chart]);

  return (
    <div
      id={'1'}
      ref={mermaidRef}
      style={{
        touchAction: "none",
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: '0 0',
        cursor: 'grab',
      }}
    ></div>
  );
};

export default MermaidComponent;