import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Mic, X, User } from "lucide-react";

// Custom ElectraBot icon (lightning bolt — matches app theme)
const BotIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hello! Ask me about electricity forecasting, peak loads, or appliance usage.",
      time: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const endRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-IN";
      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onresult = (event) => {
        setMsg(event.results[0][0].transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const sendMessage = async () => {
    if (!msg.trim()) return;
    const userMessage = msg;
    setChat((prev) => [
      ...prev,
      { sender: "user", text: userMessage, time: new Date() },
    ]);
    setMsg("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: userMessage,
      });
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: res.data.response, time: new Date() },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Try again.", time: new Date() },
      ]);
    }
    setLoading(false);
  };

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-300 hover:scale-105 transition-all flex items-center justify-center"
        title="ElectraBot"
      >
        <BotIcon size={22} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
        />
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[560px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-blue-100 flex flex-col overflow-hidden animate-fadeIn">

          {/* Header */}
          <div className="bg-blue-600 px-5 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Bot avatar with status dot */}
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <BotIcon size={18} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-600" />
              </div>

              <div>
                <p className="font-bold text-white text-sm leading-tight">ElectraBot</p>
                <p className="text-[11px] text-blue-200">AI Forecasting Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white/90">
                Live
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
              >
                <X size={13} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              backgroundColor: "#f0f6ff",
              backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            {chat.map((c, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${c.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    c.sender === "bot"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-slate-200"
                  }`}
                >
                  {c.sender === "bot" ? (
                    <BotIcon size={13} className="text-blue-600" />
                  ) : (
                    <User size={13} className="text-slate-500" />
                  )}
                </div>

                <div className={`max-w-[80%] ${c.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed ${
                      c.sender === "user"
                        ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                        : "bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {c.sender === "bot"
                        ? c.text.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                            part.startsWith("**") ? (
                              <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
                            ) : (
                              part
                            )
                          )
                        : c.text}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] mt-1 text-slate-400 ${
                      c.sender === "user" ? "text-right" : ""
                    }`}
                  >
                    {formatTime(c.time)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                  <BotIcon size={13} className="text-blue-600" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-slate-200 bg-white px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
            <button
              onClick={startListening}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                listening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Mic size={13} />
            </button>

            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your query…"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
            />

            <button
              onClick={sendMessage}
              disabled={!msg.trim()}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center flex-shrink-0 transition-all"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Send, Mic, X, User } from "lucide-react";

// /* ═══════════════════════════════════════════════════
//    ELECTRIC BOT — Canvas-drawn 3D figure
//    Small, professional, electric-energy themed
// ═══════════════════════════════════════════════════ */

// const STYLES = `
//   @keyframes slideUp {
//     from { opacity:0; transform:translateY(18px) scale(0.96); }
//     to   { opacity:1; transform:translateY(0) scale(1); }
//   }
//   .chat-in { animation: slideUp 0.26s cubic-bezier(.22,.68,0,1.18) both; }

//   .ebot-wrap {
//     position: relative;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     cursor: pointer;
//     filter: drop-shadow(0 8px 24px rgba(56,189,248,0.35));
//     transition: filter 0.3s ease;
//   }
//   .ebot-wrap:hover {
//     filter: drop-shadow(0 12px 32px rgba(56,189,248,0.6));
//   }
//   .ebot-wrap:hover .ebot-canvas {
//     transform: scale(1.04);
//   }
//   .ebot-canvas {
//     transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
//     display: block;
//   }
//   .ebot-label {
//     margin-top: 4px;
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.14em;
//     text-transform: uppercase;
//     color: #38bdf8;
//     opacity: 0.9;
//     text-shadow: 0 0 8px rgba(56,189,248,0.8);
//     pointer-events: none;
//   }
// `;

// /* ── Canvas ElectraBot ── */
// function useBotCanvas(canvasRef, open) {
//   const frameRef = useRef(0);
//   const tRef = useRef(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     const W = canvas.width;
//     const H = canvas.height;
//     const cx = W / 2;

//     /* ── Helpers ── */
//     const rad = (d) => (d * Math.PI) / 180;
//     const lerp = (a, b, t) => a + (b - a) * t;

//     /* ── Gradient factory ── */
//     const lg = (x0, y0, x1, y1, stops) => {
//       const g = ctx.createLinearGradient(x0, y0, x1, y1);
//       stops.forEach(([pos, col]) => g.addColorStop(pos, col));
//       return g;
//     };
//     const rg = (x, y, r0, r1, stops) => {
//       const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
//       stops.forEach(([pos, col]) => g.addColorStop(pos, col));
//       return g;
//     };

//     /* ── Rounded rect ── */
//     const rrect = (x, y, w, h, r) => {
//       ctx.beginPath();
//       ctx.moveTo(x + r, y);
//       ctx.lineTo(x + w - r, y);
//       ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//       ctx.lineTo(x + w, y + h - r);
//       ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//       ctx.lineTo(x + r, y + h);
//       ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//       ctx.lineTo(x, y + r);
//       ctx.quadraticCurveTo(x, y, x + r, y);
//       ctx.closePath();
//     };

//     /* ── Draw bolt ── */
//     const drawBolt = (x, y, size, alpha) => {
//       ctx.save();
//       ctx.globalAlpha = alpha;
//       ctx.fillStyle = "#fde68a";
//       ctx.shadowColor = "#fbbf24";
//       ctx.shadowBlur = 6;
//       ctx.beginPath();
//       ctx.moveTo(x + size * 0.4, y);
//       ctx.lineTo(x, y + size * 0.55);
//       ctx.lineTo(x + size * 0.38, y + size * 0.55);
//       ctx.lineTo(x - size * 0.05, y + size);
//       ctx.lineTo(x + size * 0.7, y + size * 0.42);
//       ctx.lineTo(x + size * 0.3, y + size * 0.42);
//       ctx.closePath();
//       ctx.fill();
//       ctx.restore();
//     };

//     /* ── Draw electric arc ── */
//     const drawArc = (x1, y1, x2, y2, t, alpha) => {
//       ctx.save();
//       ctx.globalAlpha = alpha;
//       ctx.strokeStyle = "#7dd3fc";
//       ctx.shadowColor = "#38bdf8";
//       ctx.shadowBlur = 8;
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.moveTo(x1, y1);
//       const pts = 6;
//       for (let i = 1; i <= pts; i++) {
//         const frac = i / (pts + 1);
//         const mx = lerp(x1, x2, frac) + (Math.sin(t * 4 + i * 1.5) * 5 * Math.sin(frac * Math.PI));
//         const my = lerp(y1, y2, frac) + (Math.cos(t * 3 + i * 2.1) * 3 * Math.sin(frac * Math.PI));
//         ctx.lineTo(mx, my);
//       }
//       ctx.lineTo(x2, y2);
//       ctx.stroke();
//       ctx.restore();
//     };

//     /* ── Draw glow ring ── */
//     const drawRing = (x, y, r, alpha, color) => {
//       ctx.save();
//       ctx.globalAlpha = alpha;
//       ctx.strokeStyle = color;
//       ctx.shadowColor = color;
//       ctx.shadowBlur = 12;
//       ctx.lineWidth = 1.2;
//       ctx.beginPath();
//       ctx.arc(x, y, r, 0, Math.PI * 2);
//       ctx.stroke();
//       ctx.restore();
//     };

//     /* ═══════════ MAIN DRAW ═══════════ */
//     const draw = (t) => {
//       ctx.clearRect(0, 0, W, H);

//       const float = Math.sin(t * 1.2) * 3;         // body float
//       const blink = Math.sin(t * 1.8);              // eye pulse
//       const eyeH = blink > 0.97 ? 0.5 : 1;         // blink
//       const eyeGlow = 0.7 + 0.3 * Math.sin(t * 2); // eye brightness
//       const antG = 0.5 + 0.5 * Math.sin(t * 3);    // antenna glow
//       const ring1 = ((t * 0.4) % 1);
//       const ring2 = ((t * 0.4 + 0.5) % 1);
//       const chestPulse = 0.6 + 0.4 * Math.sin(t * 2.5);

//       /* ─── Ground shadow ─── */
//       ctx.save();
//       const shadowAlpha = 0.18 - 0.06 * Math.abs(Math.sin(t * 1.2));
//       ctx.globalAlpha = shadowAlpha;
//       const sg = ctx.createRadialGradient(cx, H - 6, 2, cx, H - 6, 26);
//       sg.addColorStop(0, "#0ea5e9");
//       sg.addColorStop(1, "transparent");
//       ctx.fillStyle = sg;
//       ctx.beginPath();
//       ctx.ellipse(cx, H - 6, 26, 6, 0, 0, Math.PI * 2);
//       ctx.fill();
//       ctx.restore();

//       /* ─── Pulse rings ─── */
//       drawRing(cx, 68 + float, 28 + ring1 * 22, (1 - ring1) * 0.35, "#38bdf8");
//       drawRing(cx, 68 + float, 28 + ring2 * 22, (1 - ring2) * 0.22, "#7dd3fc");

//       /* ─── Electric arcs ─── */
//       if (Math.sin(t * 2.7) > 0.3) {
//         drawArc(cx - 22, 68 + float - 4, cx + 22, 68 + float - 4, t, 0.55);
//       }

//       /* ═══════ HEAD ═══════ */
//       ctx.save();
//       ctx.translate(0, float);

//       /* Antenna */
//       ctx.save();
//       ctx.strokeStyle = "#60a5fa";
//       ctx.lineWidth = 1.5;
//       ctx.shadowColor = "#38bdf8";
//       ctx.shadowBlur = 6;
//       ctx.beginPath();
//       ctx.moveTo(cx, 18);
//       ctx.lineTo(cx, 30);
//       ctx.stroke();

//       /* Antenna ball */
//       const ab = rg(cx, 16, 0, 6, [[0, "#ffffff"], [0.4, "#7dd3fc"], [1, "#0369a1"]]);
//       ctx.globalAlpha = 0.3 + 0.7 * antG;
//       ctx.shadowColor = "#38bdf8";
//       ctx.shadowBlur = 14 * antG;
//       ctx.fillStyle = ab;
//       ctx.beginPath();
//       ctx.arc(cx, 16, 5.5, 0, Math.PI * 2);
//       ctx.fill();
//       ctx.globalAlpha = 1;
//       ctx.shadowBlur = 0;
//       ctx.restore();

//       /* Head body */
//       const headGrad = lg(cx - 28, 30, cx + 28, 82,
//         [[0, "#dbeafe"], [0.3, "#60a5fa"], [0.7, "#1d4ed8"], [1, "#1e3a8a"]]);
//       rrect(cx - 28, 30, 56, 52, 12);
//       ctx.fillStyle = headGrad;
//       ctx.fill();

//       /* Head top sheen */
//       const sheen = lg(cx - 28, 30, cx, 46,
//         [[0, "rgba(255,255,255,0.28)"], [1, "rgba(255,255,255,0)"]]);
//       rrect(cx - 28, 30, 56, 22, 10);
//       ctx.fillStyle = sheen;
//       ctx.fill();

//       /* Head right depth */
//       ctx.save();
//       ctx.globalAlpha = 0.22;
//       rrect(cx + 12, 32, 14, 48, 8);
//       ctx.fillStyle = "#1e3a8a";
//       ctx.fill();
//       ctx.restore();

//       /* Ear-sensors */
//       const earGrad = lg(cx - 38, 46, cx - 28, 60,
//         [[0, "#93c5fd"], [1, "#1d4ed8"]]);
//       ctx.fillStyle = earGrad;
//       rrect(cx - 38, 46, 10, 18, 4);
//       ctx.fill();
//       ctx.fillStyle = lg(cx + 28, 46, cx + 38, 60,
//         [[0, "#1d4ed8"], [1, "#93c5fd"]]);
//       rrect(cx + 28, 46, 10, 18, 4);
//       ctx.fill();

//       /* Ear glow dots */
//       [cx - 33, cx + 33].forEach((ex) => {
//         ctx.save();
//         ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2.2 + (ex > cx ? 1 : 0));
//         ctx.fillStyle = "#38bdf8";
//         ctx.shadowColor = "#38bdf8";
//         ctx.shadowBlur = 8;
//         ctx.beginPath();
//         ctx.arc(ex, 55, 2.5, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();
//       });

//       /* Face panel */
//       const faceGrad = lg(cx - 22, 36, cx + 22, 76,
//         [[0, "#eff6ff"], [0.6, "#dbeafe"], [1, "#bfdbfe"]]);
//       rrect(cx - 22, 36, 44, 40, 8);
//       ctx.fillStyle = faceGrad;
//       ctx.fill();
//       ctx.strokeStyle = "rgba(147,197,253,0.6)";
//       ctx.lineWidth = 0.8;
//       rrect(cx - 22, 36, 44, 40, 8);
//       ctx.stroke();

//       /* Scan line */
//       const scanPos = ((t * 0.5) % 1) * 38;
//       ctx.save();
//       ctx.beginPath();
//       rrect(cx - 22, 36, 44, 40, 8);
//       ctx.clip();
//       ctx.globalAlpha = 0.5 * Math.sin((scanPos / 38) * Math.PI);
//       ctx.fillStyle = "#38bdf8";
//       ctx.shadowColor = "#38bdf8";
//       ctx.shadowBlur = 8;
//       ctx.fillRect(cx - 22, 36 + scanPos, 44, 1.5);
//       ctx.restore();

//       /* Eyes */
//       const eyeY = 50;
//       [-11, 11].forEach((ex, i) => {
//         const eyeX = cx + ex;
//         /* Socket */
//         rrect(eyeX - 7, eyeY - 5 * eyeH, 14, 10 * eyeH, 4 * eyeH);
//         ctx.fillStyle = "#0c4a6e";
//         ctx.fill();
//         /* Iris */
//         const iris = lg(eyeX - 6, eyeY - 4 * eyeH, eyeX + 6, eyeY + 4 * eyeH,
//           [[0, `rgba(125,211,252,${eyeGlow})`], [1, `rgba(3,105,161,${eyeGlow})`]]);
//         ctx.save();
//         ctx.globalAlpha = eyeGlow;
//         ctx.shadowColor = "#38bdf8";
//         ctx.shadowBlur = 10 * eyeGlow;
//         rrect(eyeX - 6, eyeY - 4 * eyeH, 12, 8 * eyeH, 3 * eyeH);
//         ctx.fillStyle = iris;
//         ctx.fill();
//         ctx.restore();
//         /* Specular */
//         ctx.save();
//         ctx.globalAlpha = 0.9;
//         ctx.fillStyle = "white";
//         ctx.beginPath();
//         ctx.arc(eyeX - 2, eyeY - 2 * eyeH, 2, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();
//       });

//       /* Nose dot */
//       ctx.save();
//       ctx.globalAlpha = 0.6;
//       ctx.fillStyle = "#93c5fd";
//       ctx.beginPath();
//       ctx.arc(cx, 63, 2, 0, Math.PI * 2);
//       ctx.fill();
//       ctx.restore();

//       /* Mouth — LED bar segments */
//       const mouthSegs = [5, 4, 6, 4, 5];
//       const mouthPulse = 0.6 + 0.4 * Math.sin(t * 3.5);
//       let mx = cx - 12;
//       mouthSegs.forEach((w, si) => {
//         const alpha = si === 2
//           ? mouthPulse
//           : 0.4 + 0.4 * Math.sin(t * 2 + si);
//         ctx.save();
//         ctx.globalAlpha = alpha;
//         ctx.fillStyle = si % 2 === 0 ? "#38bdf8" : "#7dd3fc";
//         ctx.shadowColor = "#38bdf8";
//         ctx.shadowBlur = 6;
//         rrect(mx, 69, w, 3.5, 1.2);
//         ctx.fill();
//         ctx.restore();
//         mx += w + 1.5;
//       });

//       ctx.restore(); /* end head float */

//       /* ═══════ NECK ═══════ */
//       const neckGrad = lg(cx - 8, 82, cx + 8, 96,
//         [[0, "#60a5fa"], [1, "#1d4ed8"]]);
//       ctx.fillStyle = neckGrad;
//       rrect(cx - 8, 82, 16, 14, 4);
//       ctx.fill();
//       ctx.save();
//       ctx.globalAlpha = 0.25;
//       ctx.fillStyle = "white";
//       rrect(cx - 8, 82, 16, 6, 4);
//       ctx.fill();
//       ctx.restore();

//       /* ═══════ TORSO ═══════ */
//       const torsoGrad = lg(cx - 30, 94, cx + 30, 148,
//         [[0, "#93c5fd"], [0.4, "#2563eb"], [1, "#1e3a8a"]]);
//       rrect(cx - 30, 94, 60, 52, 12);
//       ctx.fillStyle = torsoGrad;
//       ctx.fill();

//       /* Torso sheen */
//       const tSheen = lg(cx - 30, 94, cx, 112,
//         [[0, "rgba(255,255,255,0.2)"], [1, "rgba(255,255,255,0)"]]);
//       rrect(cx - 30, 94, 60, 24, 10);
//       ctx.fillStyle = tSheen;
//       ctx.fill();

//       /* Torso right shadow */
//       ctx.save();
//       ctx.globalAlpha = 0.28;
//       rrect(cx + 14, 96, 14, 48, 8);
//       ctx.fillStyle = "#1e3a8a";
//       ctx.fill();
//       ctx.restore();

//       /* Chest panel recess */
//       ctx.save();
//       ctx.globalAlpha = 0.5;
//       rrect(cx - 22, 102, 44, 36, 7);
//       ctx.fillStyle = "#0f172a";
//       ctx.fill();
//       ctx.restore();

//       /* Chest LED strip top */
//       [[cx - 18, 108, 12, "#38bdf8"],
//        [cx - 3,  108,  6, "#7dd3fc"],
//        [cx + 7,  108,  9, "#38bdf8"]].forEach(([lx, ly, lw, col]) => {
//         ctx.save();
//         ctx.globalAlpha = chestPulse;
//         ctx.fillStyle = col;
//         ctx.shadowColor = col;
//         ctx.shadowBlur = 10;
//         rrect(lx, ly, lw, 5, 2);
//         ctx.fill();
//         ctx.restore();
//       });

//       /* Chest arc meter */
//       ctx.save();
//       ctx.globalAlpha = 0.4;
//       ctx.fillStyle = "#0c4a6e";
//       rrect(cx - 18, 118, 36, 4, 2);
//       ctx.fill();
//       ctx.restore();
//       const meterW = 20 + 14 * (0.5 + 0.5 * Math.sin(t * 1.1));
//       ctx.save();
//       ctx.globalAlpha = 0.95;
//       ctx.fillStyle = "#38bdf8";
//       ctx.shadowColor = "#38bdf8";
//       ctx.shadowBlur = 8;
//       rrect(cx - 18, 118, meterW, 4, 2);
//       ctx.fill();
//       ctx.restore();

//       /* Chest bolt icon */
//       drawBolt(cx - 6, 126, 12, 0.85);

//       /* Chest vents */
//       [[cx - 18, 140], [cx - 8, 140], [cx + 4, 140]].forEach(([vx, vy]) => {
//         ctx.save();
//         ctx.globalAlpha = 0.4;
//         ctx.fillStyle = "#60a5fa";
//         rrect(vx, vy, 8, 2, 1);
//         ctx.fill();
//         ctx.restore();
//       });

//       /* ═══════ ARMS ═══════ */
//       const armGrad = (flip) =>
//         lg(flip ? cx + 30 : cx - 44, 97, flip ? cx + 44 : cx - 30, 97,
//           [[0, "#60a5fa"], [1, "#1d4ed8"]]);

//       /* Left arm */
//       ctx.fillStyle = armGrad(false);
//       rrect(cx - 44, 97, 14, 38, 6);
//       ctx.fill();
//       /* Left hand */
//       const lhg = rg(cx - 37, 138, 1, 9,
//         [[0, "#7dd3fc"], [1, "#1d4ed8"]]);
//       ctx.fillStyle = lhg;
//       ctx.beginPath();
//       ctx.ellipse(cx - 37, 138, 8, 6, 0, 0, Math.PI * 2);
//       ctx.fill();

//       /* Right arm */
//       ctx.fillStyle = armGrad(true);
//       rrect(cx + 30, 97, 14, 38, 6);
//       ctx.fill();
//       /* Right hand */
//       const rhg = rg(cx + 37, 138, 1, 9,
//         [[0, "#7dd3fc"], [1, "#1d4ed8"]]);
//       ctx.fillStyle = rhg;
//       ctx.beginPath();
//       ctx.ellipse(cx + 37, 138, 8, 6, 0, 0, Math.PI * 2);
//       ctx.fill();

//       /* Arm sheen */
//       [[cx - 44, true], [cx + 30, false]].forEach(([ax, isLeft]) => {
//         ctx.save();
//         ctx.globalAlpha = 0.18;
//         ctx.fillStyle = "white";
//         rrect(ax + (isLeft ? 0 : 0), 97, 6, 36, 4);
//         ctx.fill();
//         ctx.restore();
//       });

//       /* ═══════ LEGS ═══════ */
//       const legOffset = Math.sin(t * 1.2) * 1.5;
//       [[cx - 22, legOffset], [cx + 8, -legOffset]].forEach(([lx, lo], li) => {
//         const legG = lg(lx, 146, lx + 14, 176,
//           [[0, "#3b82f6"], [1, "#1e3a8a"]]);
//         ctx.fillStyle = legG;
//         rrect(lx, 146 + lo, 14, 30, 6);
//         ctx.fill();
//         /* Foot */
//         const footG = lg(lx - 4, 172, lx + 18, 180,
//           [[0, "#2563eb"], [1, "#1e3a8a"]]);
//         ctx.fillStyle = footG;
//         rrect(lx - 4, 172 + lo, 22, 9, 4);
//         ctx.fill();
//         /* Foot sheen */
//         ctx.save();
//         ctx.globalAlpha = 0.2;
//         ctx.fillStyle = "white";
//         rrect(lx - 4, 172 + lo, 22, 3, 3);
//         ctx.fill();
//         ctx.restore();
//       });
//     };

//     /* ── Animation loop ── */
//     let raf;
//     const loop = (ts) => {
//       tRef.current = ts / 1000;
//       draw(tRef.current);
//       raf = requestAnimationFrame(loop);
//     };
//     raf = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(raf);
//   }, [canvasRef]);
// }

// /* ── ElectraBot wrapper ── */
// const ElectraBot = ({ onClick, isOpen }) => {
//   const canvasRef = useRef(null);
//   useBotCanvas(canvasRef, isOpen);

//   return (
//     <div className="ebot-wrap" onClick={onClick} title="Chat with ElectraBot">
//       <canvas
//         ref={canvasRef}
//         width={110}
//         height={190}
//         className="ebot-canvas"
//       />
//       {!isOpen && <div className="ebot-label">ElectraBot</div>}
//     </div>
//   );
// };

// /* ── Small SVG avatar for header + bubbles ── */
// const BotAvatar = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <defs>
//       <linearGradient id="avB" x1="10" y1="18" x2="54" y2="58" gradientUnits="userSpaceOnUse">
//         <stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#1d4ed8" />
//       </linearGradient>
//       <linearGradient id="avE" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
//         <stop offset="0%" stopColor="#7dd3fc" /><stop offset="100%" stopColor="#0369a1" />
//       </linearGradient>
//     </defs>
//     <rect x="7"  y="30" width="7" height="12" rx="3" fill="#60a5fa" />
//     <rect x="50" y="30" width="7" height="12" rx="3" fill="#60a5fa" />
//     <line x1="32" y1="9" x2="32" y2="20" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
//     <circle cx="32" cy="7" r="3.5" fill="#38bdf8" />
//     <circle cx="32" cy="7" r="1.5" fill="white" opacity="0.9" />
//     <rect x="10" y="18" width="44" height="38" rx="11" fill="url(#avB)" />
//     <rect x="14" y="22" width="36" height="32" rx="8" fill="#dbeafe" />
//     <rect x="18" y="27" width="11" height="9"  rx="4" fill="#0c4a6e" />
//     <rect x="19" y="28" width="9"  height="7"  rx="3" fill="url(#avE)" />
//     <circle cx="22" cy="30" r="1.5" fill="white" opacity="0.9" />
//     <rect x="35" y="27" width="11" height="9"  rx="4" fill="#0c4a6e" />
//     <rect x="36" y="28" width="9"  height="7"  rx="3" fill="url(#avE)" />
//     <circle cx="39" cy="30" r="1.5" fill="white" opacity="0.9" />
//     <rect x="22" y="43" width="5" height="3" rx="1" fill="#38bdf8" />
//     <rect x="29" y="43" width="6" height="3" rx="1" fill="#60a5fa" />
//     <rect x="37" y="43" width="5" height="3" rx="1" fill="#38bdf8" />
//   </svg>
// );

// /* ═══════════════════════════════════════════════════
//    MAIN CHATBOT COMPONENT
// ═══════════════════════════════════════════════════ */
// export default function Chatbot() {
//   const [open, setOpen]       = useState(false);
//   const [msg, setMsg]         = useState("");
//   const [listening, setListening] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [chat, setChat]       = useState([
//     {
//       sender: "bot",
//       text: "Hello! Ask me about electricity forecasting, peak loads, or appliance usage.",
//       time: new Date(),
//     },
//   ]);

//   const endRef = useRef(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, loading]);

//   useEffect(() => {
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SR) return;
//     const rec = new SR();
//     rec.continuous = false;
//     rec.lang = "en-IN";
//     rec.onstart = () => setListening(true);
//     rec.onend   = () => setListening(false);
//     rec.onresult = (e) => setMsg(e.results[0][0].transcript);
//     recognitionRef.current = rec;
//   }, []);

//   const sendMessage = async () => {
//     if (!msg.trim()) return;
//     const text = msg;
//     setChat((p) => [...p, { sender: "user", text, time: new Date() }]);
//     setMsg("");
//     setLoading(true);
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/api/chat", { message: text });
//       setChat((p) => [...p, { sender: "bot", text: res.data.response, time: new Date() }]);
//     } catch {
//       setChat((p) => [...p, { sender: "bot", text: "Server error. Try again.", time: new Date() }]);
//     }
//     setLoading(false);
//   };

//   const fmt = (t) =>
//     new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   return (
//     <>
//       <style>{STYLES}</style>

//       {/* ── 3D ElectraBot figure: the floating trigger ── */}
//       <div className="fixed bottom-3 right-5 z-50 flex flex-col items-center">
//         <ElectraBot onClick={() => setOpen((v) => !v)} isOpen={open} />
//       </div>

//       {/* Backdrop */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-sm"
//         />
//       )}

//       {/* Chat window — positioned above bot */}
//       {open && (
//         <div className="fixed bottom-[205px] right-6 z-50 w-[375px] h-[530px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-blue-100 flex flex-col overflow-hidden chat-in">

//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3.5 flex items-center justify-between flex-shrink-0">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
//                   <BotAvatar size={26} />
//                 </div>
//                 <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-600" />
//               </div>
//               <div>
//                 <p className="font-bold text-white text-sm leading-tight">ElectraBot</p>
//                 <p className="text-[11px] text-blue-200">AI Forecasting Assistant</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white/90">
//                 Live
//               </span>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
//               >
//                 <X size={13} className="text-white" />
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div
//             className="flex-1 overflow-y-auto p-4 space-y-4"
//             style={{
//               backgroundColor: "#f0f6ff",
//               backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
//               backgroundSize: "22px 22px",
//             }}
//           >
//             {chat.map((c, i) => (
//               <div
//                 key={i}
//                 className={`flex items-end gap-2 ${c.sender === "user" ? "flex-row-reverse" : ""}`}
//               >
//                 <div
//                   className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
//                     c.sender === "bot" ? "bg-blue-50 border border-blue-200" : "bg-slate-200"
//                   }`}
//                 >
//                   {c.sender === "bot"
//                     ? <BotAvatar size={18} />
//                     : <User size={13} className="text-slate-500" />}
//                 </div>
//                 <div className={`max-w-[80%] flex flex-col ${c.sender === "user" ? "items-end" : "items-start"}`}>
//                   <div
//                     className={`px-4 py-2.5 text-sm leading-relaxed ${
//                       c.sender === "user"
//                         ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
//                         : "bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm"
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap">
//                       {c.sender === "bot"
//                         ? c.text.split(/(\*\*.*?\*\*)/g).map((part, j) =>
//                             part.startsWith("**")
//                               ? <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
//                               : part
//                           )
//                         : c.text}
//                     </p>
//                   </div>
//                   <span className={`text-[10px] mt-1 text-slate-400 ${c.sender === "user" ? "text-right" : ""}`}>
//                     {fmt(c.time)}
//                   </span>
//                 </div>
//               </div>
//             ))}

//             {loading && (
//               <div className="flex items-end gap-2">
//                 <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
//                   <BotAvatar size={18} />
//                 </div>
//                 <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
//                   <div className="flex gap-1.5 items-center">
//                     {[0, 150, 300].map((d) => (
//                       <span
//                         key={d}
//                         className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
//                         style={{ animationDelay: `${d}ms` }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={endRef} />
//           </div>

//           {/* Input */}
//           <div className="border-t border-slate-200 bg-white px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
//             <button
//               onClick={() => recognitionRef.current?.start()}
//               className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
//                 listening
//                   ? "bg-red-500 text-white animate-pulse"
//                   : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
//               }`}
//             >
//               <Mic size={13} />
//             </button>
//             <input
//               type="text"
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type your query…"
//               className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
//             />
//             <button
//               onClick={sendMessage}
//               disabled={!msg.trim()}
//               className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center flex-shrink-0 transition-all"
//             >
//               <Send size={13} className="text-white" />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }