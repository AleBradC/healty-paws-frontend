import { useEffect, useState, useRef, type FC } from "react";
import "./styles.css";

interface LoadingProps {
  isLoading: boolean;
  message?: string;
  variant?: "fullscreen" | "overlay" | "inline";
  minDuration?: number;
}

export const Loading: FC<LoadingProps> = ({
  isLoading,
  message = "Loading...",
  variant = "inline",
  minDuration = 500,
}) => {
  const [isVisible, setIsVisible] = useState(isLoading);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      startTime.current = Date.now();
    } else {
      if (!startTime.current) {
        setIsVisible(false);
        return;
      }

      const elapsed = Date.now() - startTime.current;
      const remaining = minDuration - elapsed;

      if (remaining > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          startTime.current = null;
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        setIsVisible(false);
        startTime.current = null;
      }
    }
  }, [isLoading, minDuration]);

  if (!isVisible) return null;

  return (
    <div className={`loading-container ${variant}`}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-text">{message}</p>}
    </div>
  );
};
