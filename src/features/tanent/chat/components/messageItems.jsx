// components/messageItems.jsx
import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Trash2,
  Edit3,
  X,
  Check as SaveIcon,
  Timer,
  MoreVertical,
  Undo2,
  Reply,
  CornerUpRight,
  Play,
  Pause,
  Download,
  FileText,
  Image as ImageIcon,
  Film,
  Headphones,
  Maximize2,
  Volume2,
  VolumeX,
  ZoomIn,
  Eye,
  File,
  Info,
  Bell,
} from "lucide-react";

import {
  useDeleteMessageMutation,
  useEditMessageMutation,
  useLazyGetMessageInfoQuery,
} from "../chatApi";

// ============================================
// UTILITY: Format file size
// ============================================
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// ============================================
// UTILITY: Format time mm:ss
// ============================================
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ============================================
// SYSTEM MESSAGE — Timeline event renderer
// ============================================
const SystemMessage = memo(({ message }) => {
  const formatTime = useCallback(
    (d) => (d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex justify-center my-3 px-4"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 border border-slate-200/60 shadow-sm">
        <Bell className="w-3 h-3 text-slate-400 flex-shrink-0" strokeWidth={2.5} />
        <span className="text-[12px] font-medium text-slate-500 leading-snug">
          {message.message}
        </span>
        <span className="text-[10px] text-slate-400 font-medium tracking-wide">
          {formatTime(message.created_at)}
        </span>
      </div>
    </motion.div>
  );
});
SystemMessage.displayName = "SystemMessage";

// ============================================
// AUDIO PLAYER COMPONENT — Full Featured
// ============================================
const AudioPlayer = memo(({ src, isMe, duration: initialDuration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };
    const onError = () => {
      setError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || error) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying, error]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleProgressClick = useCallback((e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !audio.duration || error) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = percent * audio.duration;
  }, [error]);

  if (error) {
    return (
      <div className={`flex items-center gap-2 px-2 py-1 ${isMe ? "text-white/60" : "text-slate-400"}`}>
        <Headphones className="w-4 h-4" />
        <span className="text-[13px]">Audio unavailable</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 w-full max-w-[300px] min-w-[200px] ${isMe ? "text-white" : "text-slate-700"}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        disabled={error}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
          transition-all duration-200 active:scale-90
          ${isMe ? "bg-white/20 hover:bg-white/30" : "bg-slate-200 hover:bg-slate-300"}
          disabled:opacity-50
        `}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" fill="currentColor" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className={`
            h-1.5 rounded-full cursor-pointer overflow-hidden
            ${isMe ? "bg-white/20" : "bg-slate-200"}
          `}
        >
          <div
            className={`h-full rounded-full transition-all duration-100 ${isMe ? "bg-white" : "bg-slate-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-[10px] ${isMe ? "text-white/60" : "text-slate-400"}`}>
            {formatDuration(currentTime)}
          </span>
          <span className={`text-[10px] ${isMe ? "text-white/60" : "text-slate-400"}`}>
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      <button
        onClick={toggleMute}
        className={`p-1.5 rounded-full transition-colors ${isMe ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
      >
        {isMuted ? (
          <VolumeX className={`w-3.5 h-3.5 ${isMe ? "text-white/60" : "text-slate-400"}`} />
        ) : (
          <Volume2 className={`w-3.5 h-3.5 ${isMe ? "text-white/60" : "text-slate-400"}`} />
        )}
      </button>
    </div>
  );
});
AudioPlayer.displayName = "AudioPlayer";

// ============================================
// RESPONSIVE IMAGE VIEWER — Zoom + Download
// ============================================
const ImageViewer = memo(({ src, isMe, fileName, onDownload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isOpen) setScale(1);
  }, [isOpen]);

  const handleZoomIn = useCallback((e) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 3));
  }, []);

  const handleZoomOut = useCallback((e) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 0.5));
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        style={{ maxWidth: "min(280px, 70vw)", maxHeight: "min(350px, 50vh)" }}
        onClick={() => !error && setIsOpen(true)}
      >
        {!loaded && !error && (
          <div className={`w-full h-40 rounded-xl animate-pulse ${isMe ? "bg-white/10" : "bg-slate-100"}`} />
        )}
        {error ? (
          <div className={`w-full h-40 rounded-xl flex items-center justify-center ${isMe ? "bg-white/10" : "bg-slate-100"}`}>
            <ImageIcon className={`w-8 h-8 ${isMe ? "text-white/40" : "text-slate-300"}`} />
          </div>
        ) : (
          <img
            src={src}
            alt={fileName || "Shared image"}
            className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ maxHeight: "350px" }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
          />
        )}

        {!error && loaded && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 rounded-xl flex items-center justify-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm"
              title="Download"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm"
              title="View full size"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
            onClick={() => setIsOpen(false)}
            onWheel={handleWheel}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm">
              <span className="text-white/80 text-sm font-medium truncate max-w-[60vw]">
                {fileName || "Image"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomOut(e); }}
                  className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                  <span className="text-lg font-bold">−</span>
                </button>
                <span className="text-white/60 text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomIn(e); }}
                  className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
                  className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 text-white transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={src}
                alt={fileName || "Full image"}
                className="max-w-full max-h-full object-contain rounded-lg cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />
            </div>

            <div className="text-center py-2 bg-black/50">
              <span className="text-white/40 text-xs">Scroll to zoom · Click outside to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
ImageViewer.displayName = "ImageViewer";

// ============================================
// RESPONSIVE VIDEO PLAYER — Play + Download + Fullscreen
// ============================================
const VideoPlayer = memo(({ src, isMe, fileName, onDownload }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const fullscreenVideoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      if (!isNaN(video.duration)) setDuration(video.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const onError = () => setError(true);

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || error) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      video.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused) {
          setShowControls(false);
        }
      }, 3000);
    }
  }, [isPlaying, error]);

  const handleProgressClick = useCallback((e) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar || !video.duration || error) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = percent * video.duration;
  }, [error]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    const wasPlaying = isPlaying;
    const currentTimeValue = video?.currentTime || 0;

    setIsFullscreen(prev => !prev);
    setIsPlaying(false);
    if (video) {
      video.pause();
    }

    requestAnimationFrame(() => {
      const fsVideo = fullscreenVideoRef.current;
      if (fsVideo) {
        fsVideo.currentTime = currentTimeValue;
        fsVideo.muted = isMuted;
        if (wasPlaying) {
          fsVideo.play().catch(() => {});
        }
      }
    });
  }, [isPlaying, isMuted]);

  if (error) {
    return (
      <div className={`flex items-center gap-2 px-2 py-1 ${isMe ? "text-white/60" : "text-slate-400"}`}>
        <Film className="w-4 h-4" />
        <span className="text-[13px]">Video unavailable</span>
      </div>
    );
  }

  return (
    <>
      <div 
        className="relative rounded-xl overflow-hidden group"
        style={{ maxWidth: "min(280px, 70vw)", maxHeight: "min(350px, 50vh)" }}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover rounded-xl"
          style={{ maxHeight: "350px" }}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="metadata"
          muted={isMuted}
          playsInline
        />

        {!isPlaying && (
          <div
            className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer rounded-xl"
            onClick={togglePlay}
          >
            <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
              <Play className="w-7 h-7 text-slate-800 ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {isPlaying && showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl flex flex-col justify-end p-3"
              onClick={togglePlay}
            >
              <div
                ref={progressRef}
                onClick={(e) => { e.stopPropagation(); handleProgressClick(e); }}
                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-2 overflow-hidden"
              >
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Pause className="w-4 h-4 text-white" fill="currentColor" />
                  </button>
                  <span className="text-[11px] text-white/90 font-medium">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/80" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white/80" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-black/50">
              <span className="text-white/80 text-sm font-medium truncate max-w-[60vw]">
                {fileName || "Video"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
                  className="p-2 rounded-full hover:bg-white/20 text-white"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <video
                ref={fullscreenVideoRef}
                src={src}
                controls
                className="max-w-full max-h-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
VideoPlayer.displayName = "VideoPlayer";

// ============================================
// FILE MESSAGE — Download + View (STRICT: only for message_type === "file")
// ============================================
const FileMessage = memo(({ fileName, fileUrl, isMe, fileSize, message_type }) => {
  const displayName = fileName || "File";
  const fileExt = displayName.split(".").pop()?.toUpperCase() || "";
  const [isDownloading, setIsDownloading] = useState(false);

  const isPDF = displayName.toLowerCase().endsWith(".pdf");
  const isViewable = isPDF;

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = displayName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(fileUrl, "_blank");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  }, [fileUrl, displayName]);

  const handleView = useCallback(() => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }, [fileUrl]);

  return (
    <div className={`flex flex-col gap-2 min-w-[220px] max-w-[320px]`}>
      <div className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl
        transition-all duration-200
        ${isMe
          ? "bg-white/15 hover:bg-white/20 text-white"
          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
        }
      `}>
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
          ${isMe ? "bg-white/20" : "bg-slate-200"}
        `}>
          {isDownloading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPDF ? (
            <FileText className="w-5 h-5 text-red-400" />
          ) : (
            <File className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium truncate">{displayName}</p>
          <p className={`text-[10px] ${isMe ? "text-white/50" : "text-slate-400"}`}>
            {fileExt}{fileSize ? ` · ${formatFileSize(fileSize)}` : ""}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`
            flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg
            text-[12px] font-medium transition-all active:scale-95
            ${isMe
              ? "bg-white/10 hover:bg-white/20 text-white/80"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }
            disabled:opacity-50
          `}
        >
          {isDownloading ? (
            <>
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Download
            </>
          )}
        </button>

        {isViewable && (
          <button
            onClick={handleView}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg
              text-[12px] font-medium transition-all active:scale-95
              ${isMe
                ? "bg-white/10 hover:bg-white/20 text-white/80"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }
            `}
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        )}
      </div>
    </div>
  );
});
FileMessage.displayName = "FileMessage";

// ============================================
// MESSAGE TYPE ICON (for reply preview)
// ============================================
const MessageTypeIcon = memo(({ type, isMe }) => {
  const className = `w-3.5 h-3.5 ${isMe ? "text-white/60" : "text-slate-400"}`;
  switch (type) {
    case "image": return <ImageIcon className={className} />;
    case "video": return <Film className={className} />;
    case "audio": return <Headphones className={className} />;
    case "file": return <FileText className={className} />;
    default: return null;
  }
});
MessageTypeIcon.displayName = "MessageTypeIcon";

// ============================================
// EDITING TEXTAREA
// ============================================
const EditField = memo(({ initialText, onSave, onCancel, isMe }) => {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = text.trim();
      if (trimmed && trimmed !== initialText) {
        onSave(trimmed);
      } else {
        onCancel();
      }
    }
    if (e.key === "Escape") {
      onCancel();
    }
  }, [text, initialText, onSave, onCancel]);

  const handleSaveClick = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== initialText) {
      onSave(trimmed);
    } else {
      onCancel();
    }
  }, [text, initialText, onSave, onCancel]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`
          w-full text-[14px] p-3 rounded-xl outline-none resize-none
          min-h-[60px] max-h-[200px]
          ${isMe
            ? "bg-white/15 border border-white/25 text-white placeholder-white/40 focus:border-white/50"
            : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400"
          }
          transition-colors duration-200
        `}
        placeholder="Edit your message..."
        rows={2}
      />
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${isMe ? "text-white/50" : "text-slate-400"}`}>
          Enter to save · Esc to cancel
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={onCancel}
            className={`p-1.5 rounded-lg transition-colors ${isMe ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
          >
            <X className={`w-4 h-4 ${isMe ? "text-white/70" : "text-slate-500"}`} />
          </button>
          <button
            onClick={handleSaveClick}
            className={`p-1.5 rounded-lg transition-colors ${isMe ? "bg-white/20 hover:bg-white/30" : "bg-slate-200 hover:bg-slate-300"}`}
          >
            <SaveIcon className={`w-4 h-4 ${isMe ? "text-white" : "text-slate-700"}`} />
          </button>
        </div>
      </div>
    </div>
  );
});
EditField.displayName = "EditField";

// ============================================
// STATUS ICON
// ============================================
const StatusIcon = memo(({ status, isMe, isDeleted, isOptimistic }) => {
  if (!isMe || isDeleted || isOptimistic) return null;
  const s = status || "sent";

  if (s === "read")
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
      </motion.div>
    );

  if (s === "delivered")
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <CheckCheck className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
      </motion.div>
    );

  if (s === "sending")
    return (
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
        <Clock className="w-3.5 h-3.5 text-amber-400" />
      </motion.div>
    );

  if (s === "failed")
    return (
      <motion.div animate={{ x: [-3, 3, -3, 3, 0] }} transition={{ duration: 0.4 }}>
        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
      </motion.div>
    );

  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
      <Check className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
    </motion.div>
  );
});
StatusIcon.displayName = "StatusIcon";

// ============================================
// DELETE MODAL
// ============================================
const DeleteModal = memo(({ onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-[320px] w-full mx-4 border border-slate-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-rose-500" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-800">Delete Message</h3>
          <p className="text-[12px] text-slate-500 mt-0.5">This cannot be undone</p>
        </div>
      </div>
      <p className="text-[13px] text-slate-600 mb-5 leading-relaxed">
        Are you sure you want to delete this message? It will be removed for everyone in this chat.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
        >
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
));
DeleteModal.displayName = "DeleteModal";

// ============================================
// MESSAGE INFO MODAL — WhatsApp-style delivery/read receipts
// ============================================
const MessageInfoModal = memo(({ messageId, isOpen, onClose }) => {
  const [trigger, { data, isLoading, error }] = useLazyGetMessageInfoQuery();

  useEffect(() => {
    if (isOpen && messageId) {
      trigger(messageId);
    }
  }, [isOpen, messageId, trigger]);

  const readUsers = data?.data?.read_users || [];
  const deliveredUsers = data?.data?.delivered_users || [];

  const formatReceiptTime = useCallback((isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 w-full max-w-[380px] max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <Info className="w-4.5 h-4.5 text-slate-500" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800">Message Info</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Delivery & read status</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Summary Counts */}
            <div className="grid grid-cols-2 gap-px bg-slate-100 border-b border-slate-100">
              <div className="bg-white px-4 py-3 flex flex-col items-center">
                <span className="text-[22px] font-bold text-emerald-500">{readUsers.length}</span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Read</span>
              </div>
              <div className="bg-white px-4 py-3 flex flex-col items-center">
                <span className="text-[22px] font-bold text-sky-500">{deliveredUsers.length}</span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Delivered</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                  <span className="text-[13px] text-slate-400 font-medium">Loading info...</span>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center py-10 gap-2 px-6">
                  <AlertCircle className="w-8 h-8 text-rose-300" />
                  <span className="text-[13px] text-slate-500 text-center">Failed to load message info.</span>
                  <button
                    onClick={() => trigger(messageId)}
                    className="mt-1 px-4 py-1.5 rounded-lg text-[12px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isLoading && !error && (
                <>
                  {/* Read Section */}
                  <div className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCheck className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
                      <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">
                        Read by
                      </span>
                      <span className="ml-auto text-[11px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {readUsers.length}
                      </span>
                    </div>

                    {readUsers.length === 0 ? (
                      <div className="flex items-center gap-2 py-3 px-3 rounded-xl bg-slate-50">
                        <Clock className="w-4 h-4 text-slate-300" />
                        <span className="text-[13px] text-slate-400">Nobody has read this message yet</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {readUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                              {user.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-slate-700 truncate">{user.name || "User"}</p>
                              <p className="text-[11px] text-emerald-500 font-medium">
                                {formatReceiptTime(user.read_at)}
                              </p>
                            </div>
                            <CheckCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-slate-100 mx-5" />

                  {/* Delivered Section */}
                  <div className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCheck className="w-4 h-4 text-sky-500" strokeWidth={2.5} />
                      <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">
                        Delivered to
                      </span>
                      <span className="ml-auto text-[11px] font-semibold text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full">
                        {deliveredUsers.length}
                      </span>
                    </div>

                    {deliveredUsers.length === 0 ? (
                      <div className="flex items-center gap-2 py-3 px-3 rounded-xl bg-slate-50">
                        <Clock className="w-4 h-4 text-slate-300" />
                        <span className="text-[13px] text-slate-400">Nobody has received this message yet</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {deliveredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                              {user.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-slate-700 truncate">{user.name || "User"}</p>
                              <p className="text-[11px] text-sky-500 font-medium">
                                {formatReceiptTime(user.delivered_at)}
                              </p>
                            </div>
                            <CheckCheck className="w-4 h-4 text-sky-400 flex-shrink-0" strokeWidth={2.5} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
MessageInfoModal.displayName = "MessageInfoModal";

// ============================================
// REPLY PREVIEW INSIDE BUBBLE
// ============================================
const ReplyPreview = memo(({ reply, isMe, currentUserId }) => {
  if (!reply) return null;

  const isReplyFromMe = String(reply.sender) === String(currentUserId);
  const replySenderLabel = isReplyFromMe ? "You" : "User";
  let replyText = reply.message || "";
  if (reply.deleted) replyText = "This message was deleted";
  const isMedia = ["image", "video", "audio", "file"].includes(reply.message_type);

  return (
    <div
      className={`
        mb-2 pl-3 pr-2 py-2 rounded-lg cursor-pointer
        ${isMe ? "bg-white/10 border-l-2 border-white/40" : "bg-slate-100/80 border-l-2 border-slate-300"}
      `}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <CornerUpRight className={`w-3 h-3 ${isMe ? "text-white/60" : "text-slate-400"}`} />
        <span className={`text-[11px] font-semibold ${isMe ? "text-white/70" : "text-slate-500"}`}>
          {replySenderLabel}
        </span>
        {isMedia && <MessageTypeIcon type={reply.message_type} isMe={isMe} />}
      </div>
      <p className={`text-[12px] line-clamp-2 ${isMe ? "text-white/60" : "text-slate-500"} ${reply.deleted ? "italic" : ""}`}>
        {replyText.length > 60 ? replyText.slice(0, 60) + "..." : replyText}
      </p>
    </div>
  );
});
ReplyPreview.displayName = "ReplyPreview";

// ============================================
// ACTION MENU
// ============================================
const ActionMenu = memo(({
  isOpen, isMe, modifiable, onReply, onInfo, onEdit, onDelete, menuRef,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.85, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -6 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className={`
          absolute z-30 min-w-[150px] rounded-xl overflow-hidden
          bg-white shadow-2xl shadow-slate-900/10 border border-slate-100
          ${isMe ? "right-0 bottom-full mb-1.5" : "left-0 bottom-full mb-1.5"}
        `}
      >
        <button
          onClick={onReply}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <Reply className="w-4 h-4" strokeWidth={2} />
          <span>Reply</span>
        </button>

        {isMe && (
          <>
            <div className="h-px bg-slate-100 mx-3" />
            <button
              onClick={onInfo}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Info className="w-4 h-4" strokeWidth={2} />
              <span>Info</span>
            </button>
          </>
        )}

        {isMe && (
          <>
            <div className="h-px bg-slate-100 mx-3" />
            <button
              onClick={() => modifiable && onEdit()}
              disabled={!modifiable}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium transition-colors ${modifiable ? "text-slate-700 hover:bg-slate-50 cursor-pointer" : "text-slate-300 cursor-not-allowed"}`}
            >
              <Edit3 className="w-4 h-4" strokeWidth={2} />
              <span>Edit</span>
              {!modifiable && <Timer className="w-3 h-3 ml-auto text-slate-300" />}
            </button>
          </>
        )}

        {isMe && (
          <>
            <div className="h-px bg-slate-100 mx-3" />
            <button
              onClick={() => modifiable && onDelete()}
              disabled={!modifiable}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium transition-colors ${modifiable ? "text-rose-500 hover:bg-rose-50 cursor-pointer" : "text-rose-200 cursor-not-allowed"}`}
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
              <span>Delete</span>
              {!modifiable && <Timer className="w-3 h-3 ml-auto text-slate-300" />}
            </button>
          </>
        )}
      </motion.div>
    )}
  </AnimatePresence>
));
ActionMenu.displayName = "ActionMenu";

// ============================================
// DOWNLOAD HANDLER UTILITY
// ============================================
const useDownload = () => {
  return useCallback(async (url, fileName) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      return true;
    } catch (err) {
      console.error("Download failed:", err);
      window.open(url, "_blank", "noopener,noreferrer");
      return false;
    }
  }, []);
};

// ============================================
// CAPTION COMPONENT (for media messages)
// ============================================
const Caption = memo(({ text, isMe, isDeleted }) => {
  if (!text || isDeleted) return null;
  return (
    <p className={`text-[14px] leading-relaxed mt-2 ${isMe ? "text-white/90" : "text-slate-700"}`}>
      {text}
    </p>
  );
});
Caption.displayName = "Caption";

// ============================================
// MAIN MESSAGE CONTENT RENDERER — STRICT TYPE ROUTING
// ============================================
const MessageContent = memo(({ message, isMe, isEditing, isDeleted, editProps }) => {
  const type = message.message_type || "text";
  const download = useDownload();

  const handleDownload = useCallback(() => {
    if (message.file_url) {
      download(message.file_url, message.file_name || "download");
    }
  }, [download, message.file_url, message.file_name]);

  if (isDeleted) {
    return (
      <div className="flex items-center gap-2 opacity-50">
        <Undo2 className="w-3.5 h-3.5" />
        <span className="italic text-[13px]">This message was deleted</span>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditField
        initialText={message.message || ""}
        onSave={editProps.onSave}
        onCancel={editProps.onCancel}
        isMe={isMe}
      />
    );
  }

  switch (type) {
    case "image":
      return (
        <div className="flex flex-col">
          {message.file_url ? (
            <ImageViewer 
              src={message.file_url} 
              isMe={isMe} 
              fileName={message.file_name}
              onDownload={handleDownload}
            />
          ) : (
            <div className={`flex items-center gap-2 ${isMe ? "text-white/60" : "text-slate-400"}`}>
              <ImageIcon className="w-5 h-5" />
              <span className="text-[13px]">Photo unavailable</span>
            </div>
          )}
          <Caption text={message.message} isMe={isMe} isDeleted={isDeleted} />
        </div>
      );

    case "video":
      return (
        <div className="flex flex-col">
          {message.file_url ? (
            <VideoPlayer 
              src={message.file_url} 
              isMe={isMe} 
              fileName={message.file_name}
              onDownload={handleDownload}
            />
          ) : (
            <div className={`flex items-center gap-2 ${isMe ? "text-white/60" : "text-slate-400"}`}>
              <Film className="w-5 h-5" />
              <span className="text-[13px]">Video unavailable</span>
            </div>
          )}
          <Caption text={message.message} isMe={isMe} isDeleted={isDeleted} />
        </div>
      );

    case "audio":
      return (
        <div className="flex flex-col">
          {message.file_url ? (
            <AudioPlayer src={message.file_url} isMe={isMe} duration={message.duration} />
          ) : (
            <div className={`flex items-center gap-2 ${isMe ? "text-white/60" : "text-slate-400"}`}>
              <Headphones className="w-5 h-5" />
              <span className="text-[13px]">Audio unavailable</span>
            </div>
          )}
          <Caption text={message.message} isMe={isMe} isDeleted={isDeleted} />
        </div>
      );

    case "file":
      return (
        <FileMessage
          fileName={message.file_name}
          fileUrl={message.file_url}
          isMe={isMe}
          fileSize={message.file_size}
          message_type={message.message_type}
        />
      );

    case "text":
    default:
      return (
        <div className="min-w-0">
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
            {message.message}
          </p>
          {message.edited && (
            <span className="text-[10px] opacity-50 ml-1 font-medium">(edited)</span>
          )}
        </div>
      );
  }
});
MessageContent.displayName = "MessageContent";

// ============================================
// MAIN MESSAGE ITEM
// ============================================
function MessageItem({ message, isMe, showAvatar, showSender, currentUserId, onReply }) {
  // ✅ SYSTEM MESSAGE: Early return — completely bypasses all normal message logic
  if (message.message_type === "system") {
    return <SystemMessage message={message} />;
  }

  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const menuButtonRef = useRef(null);
  const menuDropdownRef = useRef(null);

  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();

  const isDeleted = message.deleted;
  const isOptimistic = message._optimistic;
  const hasReply = !!message.reply;

  const canModify = useCallback(() => {
    if (!message.created_at || isOptimistic) return false;
    const diff = Date.now() - new Date(message.created_at).getTime();
    return diff < 15 * 60 * 1000;
  }, [message.created_at, isOptimistic]);

  const modifiable = canModify();

  const formatTime = useCallback(
    (d) => (d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""),
    []
  );

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      const clickedMenuBtn = menuButtonRef.current?.contains(e.target);
      const clickedDropdown = menuDropdownRef.current?.contains(e.target);
      if (!clickedMenuBtn && !clickedDropdown) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMessage(message.id).unwrap();
      setShowDeleteConfirm(false);
      setMenuOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  }, [deleteMessage, message.id]);

  const handleSaveEdit = useCallback(
    async (newText) => {
      try {
        await editMessage({ messageId: message.id, content: newText }).unwrap();
        setIsEditing(false);
        setMenuOpen(false);
      } catch (err) {
        console.error("Edit failed", err);
      }
    },
    [editMessage, message.id]
  );

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setMenuOpen(false);
  }, []);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setMenuOpen(false);
  }, []);

  const startDelete = useCallback(() => {
    setShowDeleteConfirm(true);
    setMenuOpen(false);
  }, []);

  const handleReply = useCallback(() => {
    if (onReply) {
      onReply({
        id: message.id,
        message: isDeleted ? "This message was deleted" : message.message,
        sender: message.sender,
        isMe: isMe,
        message_type: message.message_type || "text",
      });
    }
    setMenuOpen(false);
  }, [onReply, message, isMe, isDeleted]);

  const openInfoModal = useCallback(() => {
    setInfoModalOpen(true);
    setMenuOpen(false);
  }, []);

  const editProps = useMemo(
    () => ({ onSave: handleSaveEdit, onCancel: cancelEdit }),
    [handleSaveEdit, cancelEdit]
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`flex items-end gap-2 max-w-[min(420px,85vw)] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          {!isMe && showAvatar && (
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-[11px] font-bold text-white shadow-md ring-2 ring-white flex-shrink-0"
            >
              {message.sender_name?.charAt(0).toUpperCase() || "?"}
            </motion.div>
          )}
          {!isMe && !showAvatar && <div className="w-8 flex-shrink-0" />}

          <div className="flex flex-col relative min-w-0">
            {!isMe && showSender && message.sender_name && (
              <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">
                {message.sender_name}
              </span>
            )}

            <div className="relative group">
              <div
                className={`
                  relative px-3.5 py-2.5 rounded-2xl
                  ${isMe
                    ? "bg-gradient-to-br from-slate-700 to-slate-600 text-white shadow-lg shadow-slate-700/15 rounded-br-md"
                    : "bg-white text-slate-800 shadow-md shadow-slate-200/40 border border-slate-100 rounded-bl-md"
                  }
                  ${isOptimistic ? "opacity-50" : ""}
                  ${message.status === "failed" ? "ring-2 ring-rose-300/40" : ""}
                  transition-all duration-200
                `}
              >
                <div className={`absolute top-0 left-5 right-5 h-[1px] rounded-full opacity-30 ${isMe ? "bg-white/30" : "bg-white"}`} />

                {hasReply && (
                  <ReplyPreview reply={message.reply} isMe={isMe} currentUserId={currentUserId} />
                )}

                <MessageContent
                  message={message}
                  isMe={isMe}
                  isEditing={isEditing}
                  isDeleted={isDeleted}
                  editProps={editProps}
                />

                {!isEditing && (
                  <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? "text-white/60" : "text-slate-400"}`}>
                    <span className="text-[11px] font-medium tracking-wide">
                      {formatTime(message.created_at)}
                    </span>
                    <StatusIcon
                      status={message.status}
                      isMe={isMe}
                      isDeleted={isDeleted}
                      isOptimistic={isOptimistic}
                    />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {hovered && !isEditing && (
                  <motion.button
                    ref={menuButtonRef}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen((prev) => !prev);
                    }}
                    className={`
                      absolute -top-2 p-1.5 rounded-full
                      bg-white shadow-lg shadow-slate-300/30 border border-slate-100
                      hover:bg-slate-50 active:scale-90 transition-all duration-150 z-20
                      ${isMe ? "-right-2" : "-left-2"}
                    `}
                  >
                    <MoreVertical className="w-3 h-3 text-slate-400" strokeWidth={2.5} />
                  </motion.button>
                )}
              </AnimatePresence>

              <ActionMenu
                isOpen={menuOpen}
                isMe={isMe}
                modifiable={modifiable}
                onReply={handleReply}
                onInfo={openInfoModal}
                onEdit={startEdit}
                onDelete={startDelete}
                menuRef={menuDropdownRef}
              />

              <AnimatePresence>
                {isMe && hovered && !modifiable && !isEditing && !menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className={`absolute -top-2 p-1.5 rounded-full bg-white shadow-md border border-slate-100 ${isMe ? "-right-2" : "-left-2"}`}
                    title="Edit/delete expired (15 min)"
                  >
                    <Timer className="w-3 h-3 text-slate-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />
        )}
      </AnimatePresence>

      <MessageInfoModal
        messageId={message.id}
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />
    </>
  );
}

export default memo(MessageItem);