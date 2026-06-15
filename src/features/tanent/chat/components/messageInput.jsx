// components/MessageInput.jsx
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { chatApi } from "../chatApi";
import { useTenantContext } from "../../tanatContextHook";
import { useWebSocket } from "../../../../contexts/websocket_context";
import { v4 as uuid } from "uuid";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  X,
  CornerUpRight,
  Image as ImageIcon,
  Film,
  Headphones,
  FileText,
  Trash2,
  Pause,
  Play,
  Square,
  Camera,
  Video,
  StopCircle,
} from "lucide-react";

// ============================================
// FILE PREVIEW COMPONENT (before sending)
// ============================================
const FilePreview = memo(({ file, onRemove, mediaUrl, recordingDuration, isRecording }) => {
  if (!file && !isRecording) return null;

  const isImage = file?.type?.startsWith("image/");
  const isVideo = file?.type?.startsWith("video/");
  const isAudio = file?.type?.startsWith("audio/");

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-2 bg-slate-50 rounded-xl p-3 border border-slate-100"
    >
      <div className="flex items-center gap-3">
        {/* Preview */}
        {isImage && mediaUrl && (
          <img
            src={mediaUrl}
            alt="Preview"
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        {isVideo && mediaUrl && (
          <video
            src={mediaUrl}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        {isAudio && (
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
            <Headphones className="w-6 h-6 text-amber-600" />
          </div>
        )}
        {isRecording && (
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center animate-pulse">
            <Mic className="w-6 h-6 text-red-500" />
          </div>
        )}
        {!isImage && !isVideo && !isAudio && !isRecording && (
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        )}

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-slate-700 truncate">
            {isRecording ? `Recording audio... ${formatDuration(recordingDuration)}` : (file?.name || "Unknown")}
          </p>
          <p className="text-[11px] text-slate-400">
            {isRecording 
              ? "Tap stop to finish recording" 
              : file?.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
          </p>
        </div>

        {/* Remove Button */}
        {!isRecording && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-full hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        )}
      </div>
    </motion.div>
  );
});
FilePreview.displayName = "FilePreview";

// ============================================
// AUDIO RECORDER VISUALIZER
// ============================================
const AudioVisualizer = memo(({ isRecording, isPaused }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isRecording || isPaused) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const bars = 20;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8 + canvas.height * 0.2;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, isPaused]);

  if (!isRecording) return null;

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={30}
      className="rounded-lg"
    />
  );
});
AudioVisualizer.displayName = "AudioVisualizer";

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ============================================
// MESSAGE INPUT — Refactored for Backend Truth
// ============================================
export default function MessageInput({ conversationId, replyTo, onClearReply }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const dispatch = useDispatch();
  const socketRef = useWebSocket();
  const { membership_id } = useTenantContext();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  }, [text]);

  const sendTypingStart = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!isTypingRef.current) {
      socket.send(JSON.stringify({
        type: "typing_start",
        room_id: conversationId,
      }));
      isTypingRef.current = true;
    }
  }, [socketRef, conversationId]);

  const sendTypingStop = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
      type: "typing_stop",
      room_id: conversationId,
    }));
    isTypingRef.current = false;
  }, [socketRef, conversationId]);

  const handleTyping = useCallback((value) => {
    setText(value);
    sendTypingStart();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStop();
    }, 2000);
  }, [sendTypingStart, sendTypingStop]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type?.startsWith("image/") || file.type?.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setMediaPreviewUrl(url);
    }
    e.target.value = "";
  }, []);

  const handleCameraCapture = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setMediaPreviewUrl(url);
    e.target.value = "";
  }, []);

  const handleVideoCapture = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setMediaPreviewUrl(url);
    e.target.value = "";
  }, []);

  const clearFile = useCallback(() => {
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setSelectedFile(null);
    setMediaPreviewUrl(null);
    setRecordedBlob(null);
    setRecordedChunks([]);
    setRecordingDuration(0);
  }, [mediaPreviewUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: "audio/webm" });
        setRecordedBlob(blob);
        setSelectedFile(file);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordedChunks(chunks);
      recordingStartTimeRef.current = Date.now();
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= 300) stopRecording();
          return newDuration;
        });
      }, 1000);
    } catch (err) {
      alert("Could not access microphone. Please check permissions.");
    }
  }, []);

  const pauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") return;
    recorder.pause();
    setIsPaused(true);
    if (recordingStartTimeRef.current) pausedTimeRef.current += Date.now() - recordingStartTimeRef.current;
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  }, []);

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "paused") return;
    recorder.resume();
    setIsPaused(false);
    recordingStartTimeRef.current = Date.now();
    recordingTimerRef.current = setInterval(() => { setRecordingDuration(prev => prev + 1); }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording" || recorder.state === "paused") recorder.stop();
    setIsRecording(false);
    setIsPaused(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && (recorder.state === "recording" || recorder.state === "paused")) {
      recorder.stop();
      recorder.onstop = () => recorder.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    setRecordedBlob(null);
    setRecordedChunks([]);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
      const recorder = mediaRecorderRef.current;
      if (recorder && (recorder.state === "recording" || recorder.state === "paused")) {
        recorder.stop();
        recorder.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaPreviewUrl]);

  // =========================
  // 1. UI-ONLY TYPE DETECTION
  // =========================
  const getPreviewType = (file) => {
    if (!file) return "text";
    if (!file.type) return "file"; // Defensive fallback
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "file";
  };

  // =========================
  // SEND MESSAGE
  // =========================

const handleSend = useCallback(async () => {
  if ((!text.trim() && !selectedFile) || !conversationId) return;
  if (isRecording) return;

  sendTypingStop();
  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

  const tempId = uuid();
  const previewType = getPreviewType(selectedFile);
  const hasFile = !!selectedFile;

  const optimisticMessage = {
    id: tempId,
    tempId,
    message: hasFile ? text.trim() || "" : text.trim(),
    message_type: previewType,
    sender: membership_id,
    created_at: new Date().toISOString(),
    status: "sending",
    _optimistic: true,
    file_url: hasFile ? (mediaPreviewUrl || URL.createObjectURL(selectedFile)) : null,
    file_name: hasFile ? selectedFile.name : null,
    duration: previewType === "audio" ? recordingDuration : null,
    reply: replyTo
      ? {
          id: replyTo.id,
          message: replyTo.message,
          sender: replyTo.sender,
          deleted: false,
          message_type: replyTo.message_type || "text",
        }
      : null,
  };

  dispatch(
    chatApi.util.updateQueryData("getMessages", { conversationId }, (draft) => {
      if (!draft?.data?.results) draft.data = { ...draft.data, results: [] };
      draft.data.results.push(optimisticMessage);
    })
  );

  const sentText = text.trim();

  setText("");
  setSelectedFile(null);
  setMediaPreviewUrl(null);
  setRecordedBlob(null);
  setRecordingDuration(0);
  if (textareaRef.current) textareaRef.current.style.height = "auto";
  if (onClearReply) onClearReply();

  setIsUploading(true);

  try {
    let payload;

    if (hasFile) {
      const formData = new FormData();
      formData.append("conversation_id", conversationId);
      formData.append("file", selectedFile);

      // ✅ FIXED (IMPORTANT)
      if (sentText) {
        formData.append("content", sentText);
      }

      if (replyTo?.id) {
        formData.append("reply_to_id", replyTo.id);
      }

      if (previewType === "audio" && recordingDuration > 0) {
        formData.append("duration", recordingDuration.toString());
      }

      payload = formData;
    } else {
      payload = {
        conversation_id: conversationId,
        type: "text",
        content: sentText,
      };

      if (replyTo?.id) {
        payload.reply_to_id = replyTo.id;
      }
    }

    await dispatch(chatApi.endpoints.sendMessage.initiate(payload)).unwrap();

  } catch (err) {
    console.error("Send failed:", err);

    dispatch(
      chatApi.util.updateQueryData("getMessages", { conversationId }, (draft) => {
        if (!draft?.data?.results) return;
        const msg = draft.data.results.find(m => m.id === tempId || m.tempId === tempId);
        if (msg) msg.status = "failed";
      })
    );
  } finally {
    setIsUploading(false);
  }
}, [
  text, selectedFile, conversationId, replyTo, dispatch, 
  membership_id, mediaPreviewUrl, recordingDuration, 
  sendTypingStop, onClearReply, isRecording
]);


  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const insertEmoji = useCallback((emoji) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  }, []);

  const quickEmojis = ["😊", "👍", "❤️", "😂", "🎉", "🔥", "👏", "🙏", "😍", "🤔"];
  const hasContent = text.trim().length > 0 || !!selectedFile;
  const showSendButton = hasContent && !isRecording;
  const showMicButton = !hasContent && !isRecording && !selectedFile;
  const showRecordingControls = isRecording;

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {(selectedFile || isRecording) && (
          <FilePreview 
            file={selectedFile} 
            onRemove={clearFile}
            mediaUrl={mediaPreviewUrl}
            recordingDuration={recordingDuration}
            isRecording={isRecording}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 px-3"
          >
            <AudioVisualizer isRecording={isRecording} isPaused={isPaused} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 z-50"
          >
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Quick reactions</span>
              <button onClick={() => setShowEmojiPicker(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {quickEmojis.map(e => (
                <button key={e} onClick={() => insertEmoji(e)} className="text-xl hover:bg-slate-100 rounded-lg p-1.5 transition-colors">
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`
        flex items-end gap-2 px-3 py-2.5 bg-white border rounded-2xl
        ${isFocused ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"}
        ${isRecording ? "border-red-300 ring-2 ring-red-100" : ""}
        transition-all duration-200
      `}>

        <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar,.xls,.xlsx,.ppt,.pptx" onChange={handleFileSelect} className="hidden" />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
        <input ref={videoInputRef} type="file" accept="video/*" capture="environment" onChange={handleVideoCapture} className="hidden" />

        {!isRecording && (
          <div className="relative group">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-xl transition-colors ${selectedFile ? "text-blue-500 bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-slate-50"}`}
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col gap-1 bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 min-w-[140px]">
              <button onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 rounded-lg"><Camera className="w-4 h-4" /> Take Photo</button>
              <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 rounded-lg"><Video className="w-4 h-4" /> Record Video</button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 rounded-lg"><ImageIcon className="w-4 h-4" /> Gallery</button>
            </div>
          </div>
        )}

        {isRecording ? (
          <div className="flex-1 flex items-center gap-3 py-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-400" : "bg-red-500 animate-pulse"}`} />
              <span className="text-[14px] font-medium text-slate-700">{isPaused ? "Paused" : "Recording..."} {formatDuration(recordingDuration)}</span>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
            rows={1}
            disabled={isUploading}
            className="flex-1 resize-none outline-none text-[14px] bg-transparent disabled:opacity-50 min-h-[20px] max-h-[120px]"
          />
        )}

        {!isRecording && (
          <button onClick={() => setShowEmojiPicker(p => !p)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-50 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
        )}

        {showRecordingControls ? (
          <div className="flex items-center gap-1.5">
            <button onClick={isPaused ? resumeRecording : pauseRecording} className={`p-2.5 rounded-xl ${isPaused ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
              {isPaused ? <Play className="w-5 h-5" fill="currentColor" /> : <Pause className="w-5 h-5" fill="currentColor" />}
            </button>
            <button onClick={stopRecording} className="p-2.5 rounded-xl bg-blue-100 text-blue-600"><Square className="w-5 h-5" fill="currentColor" /></button>
            <button onClick={cancelRecording} className="p-2.5 rounded-xl bg-rose-100 text-rose-600"><Trash2 className="w-5 h-5" /></button>
          </div>
        ) : showSendButton ? (
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend} disabled={isUploading} className="p-2.5 bg-blue-500 text-white rounded-xl shadow-md disabled:opacity-50">
            {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
        ) : showMicButton ? (
          <motion.button whileTap={{ scale: 0.9 }} onClick={startRecording} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <Mic className="w-5 h-5" />
          </motion.button>
        ) : null}
      </div>
    </div>
  );
}