import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatCircleDots, PaperPlaneTilt, X, Sparkle } from "@phosphor-icons/react";
import { api } from "@/lib/api";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Namaste! I'm the TFA Assistant. Ask me anything about admissions, fees, facilities or academics." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const sessionId = useRef(`s_${Math.random().toString(36).slice(2)}_${Date.now()}`);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    try {
      const { data } = await api.post("/chat/send", { session_id: sessionId.current, message: text });
      setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I'm having trouble right now. Please call 8986233963 or fill the contact form." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        data-testid="chat-widget-toggle"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#0f1e5c] text-white shadow-2xl shadow-blue-900/40 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open assistant"
      >
        {open ? <X size={22} weight="bold" /> : <ChatCircleDots size={24} weight="duotone" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-96 h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white flex flex-col"
            data-testid="chat-widget-panel"
          >
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0f1e5c] px-5 py-4 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Sparkle size={20} weight="fill" className="text-[#1E3A8A]" />
              </div>
              <div>
                <div className="font-display text-lg leading-none">TFA Assistant</div>
                <div className="text-xs text-amber-300 mt-1">Online • Powered by AI</div>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    data-testid={`chat-msg-${m.role}-${i}`}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#1E3A8A] text-white rounded-br-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 flex gap-2 bg-white">
              <input
                data-testid="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about admissions, fees, hostel…"
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
              <button
                data-testid="chat-send-btn"
                onClick={send}
                disabled={busy}
                className="w-11 h-11 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center hover:bg-[#0f1e5c] disabled:opacity-50"
              >
                <PaperPlaneTilt size={18} weight="fill" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
