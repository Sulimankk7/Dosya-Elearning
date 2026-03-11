import { useState, useEffect, useRef } from "react";
import { Lock, Play, AlertCircle } from "lucide-react";
import { DosyaCard } from "./DosyaCard";
import { videoApi } from "../../services/api";
import * as Plyr from "plyr";
import "plyr/dist/plyr.css";

// We have to extract the default export inside the commonjs/esm environment for plyr sometimes
const PlyrConstructor = (Plyr as any).default || Plyr;

interface VideoPlayerProps {
  lessonId?: string;
  locked?: boolean;
  thumbnail?: string;
}

export function VideoPlayer({ lessonId, locked = false, thumbnail }: VideoPlayerProps) {
  const [error, setError] = useState(false);
  const [sasUrl, setSasUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  // ── Locked state ─────────────────────────────────────────────
  if (locked) {
    return (
      <DosyaCard className="aspect-video flex items-center justify-center bg-secondary/50">
        <div className="text-center">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl mb-2">هذا الدرس مقفل</h3>
          <p className="text-muted-foreground">يجب شراء الكورس لمشاهدة هذا الدرس</p>
        </div>
      </DosyaCard>
    );
  }

  // ── Fetch SAS URL ───────────────────────────────────────────
  useEffect(() => {
    if (locked || !lessonId) {
      setSasUrl(null);
      return;
    }

    let isMounted = true;
    setLoadingUrl(true);
    setError(false);

    videoApi.getSasUrl(lessonId)
      .then(res => {
        if (isMounted) setSasUrl(res.url);
      })
      .catch(err => {
        console.error("Failed to load video:", err);
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoadingUrl(false);
      });

    return () => { isMounted = false; };
  }, [lessonId, locked]);

  // ── Initialize Plyr ───────────────────────────────────────────
  useEffect(() => {
    if (!sasUrl || !videoRef.current) return;

    // Destroy existing player if present
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new PlyrConstructor(videoRef.current, {
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "fullscreen"
      ],
      settings: ["speed"],
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 2]
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [sasUrl]);

  // ── Real video (Azure MP4 URL) ────────────────────────────────
  if (sasUrl && !error && !loadingUrl) {
    return (
      <div className="video-container aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
        <video
          ref={videoRef}
          src={sasUrl}
          className="w-full h-full"
          poster={thumbnail || undefined}
          onError={() => setError(true)}
          controlsList="nodownload"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          playsInline
        />
        {/* CSS workaround to ensure download button is hidden even in sketchy browsers */}
        <style dangerouslySetInnerHTML={{
          __html: `
          video::-internal-media-controls-download-button {
            display:none;
          }
          video::-webkit-media-controls-enclosure {
            overflow:hidden;
          }
          video::-webkit-media-controls-panel {
            width: calc(100% + 30px);
          }
        `}} />
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (error) {
    return (
      <DosyaCard className="aspect-video flex items-center justify-center bg-secondary/50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h3 className="text-xl mb-2">تعذّر تحميل الفيديو</h3>
          <p className="text-muted-foreground text-sm">تحقق من اتصالك أو حاول مرة أخرى</p>
        </div>
      </DosyaCard>
    );
  }

  // ── No URL yet — thumbnail placeholder ───────────────────────
  return (
    <DosyaCard className="aspect-video p-0 overflow-hidden relative">
      {thumbnail ? (
        <img src={thumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-primary mr-1" />
            </div>
            <p className="text-muted-foreground">جاري تحميل الفيديو...</p>
          </div>
        </div>
      )}
    </DosyaCard>
  );
}