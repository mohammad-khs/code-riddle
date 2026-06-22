import { useCallback, useRef, useState } from "react";

interface UseAudioControlProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function useAudioControl(props?: UseAudioControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          props?.onPlayStateChange?.(true);
        })
        .catch(() => {
          setIsPlaying(false);
          props?.onPlayStateChange?.(false);
        });
    }
  }, [isPlaying, props]);

  const setSrc = useCallback((src: string) => {
    if (audioRef.current) {
      audioRef.current.src = src;
    }
  }, []);

  const play = useCallback(
    (src?: string) => {
      if (!audioRef.current) return Promise.reject();

      if (src) {
        audioRef.current.src = src;
      }

      return audioRef.current.play().then(
        () => {
          setIsPlaying(true);
          props?.onPlayStateChange?.(true);
        },
        () => {
          setIsPlaying(false);
          props?.onPlayStateChange?.(false);
        },
      );
    },
    [props],
  );

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      props?.onPlayStateChange?.(false);
    }
  }, [props]);

  return {
    audioRef,
    isPlaying,
    togglePlay,
    play,
    pause,
    setSrc,
  };
}
