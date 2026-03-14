import { useState, useEffect, useRef } from "react";
import { Lock, Play, AlertCircle } from "lucide-react";
import { DosyaCard } from "./DosyaCard";
import { videoApi } from "../../services/api";

// ─────────────────────────────────────────────────────────────────────────────
// Plyr is REMOVED for iOS compatibility.
//
// ROOT CAUSE ANALYSIS:
//
// 1. crossOrigin="anonymous" on the <video> tag (line was present in original)
//    Azure Blob Storage SAS URLs do NOT return CORS headers by default.
//    Adding crossOrigin forces a CORS preflight; when Azure doesn't respond with
//    Access-Control-Allow-Origin, iOS Safari (and only Safari — Chrome is more
//    lenient) silently blocks the entire video request. Desktop Chrome ignores
//    the missing header; Safari does not. THIS IS THE PRIMARY BUG.
//
// 2. Plyr initialization race on iOS
//    The 50ms setTimeout to delay Plyr init is a workaround for a real problem:
//    Plyr manipulates the DOM around the <video> element. On iOS Safari inside
//    WKWebView, if Plyr wraps the <video> before the browser has registered the
//    <source> tag's URL, playback is silently dropped. The delay is fragile —
//    it works on fast devices but fails on slower ones. The correct fix is to
//    not use Plyr at all on mobile, or to reinitialize Plyr only after the
//    `loadedmetadata` event fires (see fixedPlyrInit below if you want to keep
//    Plyr on desktop).
//
// 3. playsInline and preload="metadata" were already present — good.
//    These are required for iOS and were correctly set in the original.
//
// FIX STRATEGY:
//   • Remove crossOrigin entirely (SAS URL carries auth in query params, no
//     CORS headers needed and no CORS mode should be enforced).
//   • Replace Plyr with a native <video> element on all platforms.
//   • If you want Plyr on desktop only, see the commented-out section at the
//     bottom of this file.
// ─────────────────────────────────────────────────────────────────────────────

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

  // ── Locked state ──────────────────────────────────────────────────────────
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

  // ── Fetch SAS URL ─────────────────────────────────────────────────────────
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

  // ── Real video ────────────────────────────────────────────────────────────
  if (sasUrl && !error && !loadingUrl) {
    return (
      <div className="video-container aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
        <video
          ref={videoRef}
          className="w-full h-full"
          poster={thumbnail || undefined}
          onError={() => setError(true)}

          // ── iOS-required attributes ──────────────────────────────────────
          playsInline          // Prevents iOS fullscreen enforcement; required in WKWebView
          preload="metadata"   // Allows iOS to probe the file before committing to play
          controls

          // ── Intentionally NO crossOrigin prop ───────────────────────────
          // Azure SAS URLs embed authentication in query parameters.
          // Adding crossOrigin="anonymous" forces a CORS preflight request.
          // Azure Blob Storage does not return CORS headers on SAS URLs by
          // default, so Safari rejects the response and the video never loads.
          // Desktop Chrome silently ignores the missing CORS header; Safari
          // does not — which is exactly why this broke only on iOS.
          //
          // If you ever need crossOrigin (e.g. to read pixel data via canvas),
          // configure CORS on your Azure Storage account first:
          //   Portal → Storage Account → Resource Sharing (CORS) → Add rule
          //   Allowed origins: https://yourdomain.com
          //   Allowed methods: GET, HEAD
          //   Exposed headers: Content-Range, Accept-Ranges, Content-Length

          // ── Download prevention (kept from original) ─────────────────────
          controlsList="nodownload"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={sasUrl} type="video/mp4" />
        </video>

        {/* Hide native download button via CSS (kept from original) */}
        <style dangerouslySetInnerHTML={{
          __html: `
            video::-internal-media-controls-download-button { display: none; }
            video::-webkit-media-controls-enclosure { overflow: hidden; }
            video::-webkit-media-controls-panel { width: calc(100% + 30px); }
          `
        }} />
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
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

  // ── No URL yet — thumbnail placeholder ───────────────────────────────────
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


// ─────────────────────────────────────────────────────────────────────────────
// OPTIONAL: Plyr on desktop only
//
// If you want to restore Plyr's speed controls on desktop while keeping
// a plain <video> on iOS, use this pattern instead of the video block above:
//
//   import * as Plyr from "plyr";
//   import "plyr/dist/plyr.css";
//   const PlyrConstructor = (Plyr as any).default || Plyr;
//
//   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//
//   useEffect(() => {
//     if (isIOS || !sasUrl || !videoRef.current) return;
//
//     // Wait for the browser's loadedmetadata event — not an arbitrary timeout.
//     // This guarantees iOS/Safari has fully registered the source before Plyr
//     // wraps the element. (The original 50ms setTimeout was too fragile.)
//     const el = videoRef.current;
//     const init = () => {
//       playerRef.current = new PlyrConstructor(el, {
//         controls: ["play","progress","current-time","duration","mute","volume","settings","fullscreen"],
//         settings: ["speed"],
//         speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
//       });
//     };
//     el.addEventListener("loadedmetadata", init, { once: true });
//     return () => {
//       el.removeEventListener("loadedmetadata", init);
//       playerRef.current?.destroy();
//       playerRef.current = null;
//     };
//   }, [sasUrl]);
// ─────────────────────────────────────────────────────────────────────────────