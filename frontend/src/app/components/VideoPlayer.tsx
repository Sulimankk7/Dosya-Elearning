import { useState } from "react";
import { Lock, Play, AlertCircle } from "lucide-react";
import { DosyaCard } from "./DosyaCard";

interface VideoPlayerProps {
  locked?: boolean;
  thumbnail?: string;
  videoUrl?: string;
}

export function VideoPlayer({ locked = false, thumbnail, videoUrl }: VideoPlayerProps) {
  const [error, setError] = useState(false);

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

  // ── Real video (Azure MP4 URL) ────────────────────────────────
  if (videoUrl && !error) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
        <video
          key={videoUrl}           // re-mount player when lesson changes
          src={videoUrl}
          controls
          autoPlay={false}
          className="w-full h-full"
          poster={thumbnail || undefined}
          onError={() => setError(true)}
        >
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
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