'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, User, Lightbulb, HelpCircle, BookOpen, Target, Loader2, 
  Mic, Volume2, VolumeX, Plus, Trash2, X, History 
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  languageCode: string;
  timestamp: Date;
}

const LANGUAGES = [
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' }
];

const quickActions = [
  { icon: HelpCircle, label: 'Explain a Concept', prompt: 'Explain the concept of ' },
  { icon: Target, label: 'Solve a Problem', prompt: 'Help me solve this physics problem: ' },
  { icon: BookOpen, label: 'Generate Quiz', prompt: 'Generate a 5-question quiz about ' },
  { icon: Lightbulb, label: 'Study Tips', prompt: 'Give me study recommendations for ' },
];

export default function AITutorPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-US');
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('physiverse_tutor_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const formatted = parsed.map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp),
          messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setSessions(formatted);
        if (formatted.length > 0) {
          const latest = formatted[0];
          setCurrentSessionId(latest.id);
          setMessages(latest.messages);
          setSelectedLanguageCode(latest.languageCode || 'en-US');
        }
      } catch (e) {
        console.error('Error loading chat history', e);
      }
    }
  }, []);

  // Sync scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = selectedLanguageCode;

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        };

        rec.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            alert("Microphone access is blocked or denied. Please click the site settings/microphone icon in your browser's address bar and select 'Allow' to use voice input.");
          } else if (event.error !== 'no-speech') {
            alert(`Voice recognition error: ${event.error}. Please check your microphone.`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [selectedLanguageCode]);

  // Cleanup speech synthesis and hide global footer on mount, restore on unmount
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguageCode(code);
    if (recognitionRef.current) {
      recognitionRef.current.lang = code;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const toggleSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined') return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*#_~`>]/g, '')
        .replace(/-\s+/g, '')
        .replace(/\n+/g, ' ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = selectedLanguageCode;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateSessions = (sessionId: string, currentMsgs: Message[], langCode: string) => {
    setSessions((prev) => {
      const sessionIndex = prev.findIndex(s => s.id === sessionId);
      const updated = [...prev];

      if (sessionIndex > -1) {
        updated[sessionIndex] = {
          ...updated[sessionIndex],
          messages: currentMsgs,
          languageCode: langCode,
          timestamp: new Date()
        };
      } else {
        const firstUserMessage = currentMsgs.find(m => m.role === 'user')?.content || 'Physics Chat';
        const title = firstUserMessage.length > 22 ? firstUserMessage.slice(0, 22) + '...' : firstUserMessage;
        
        updated.unshift({
          id: sessionId,
          title,
          messages: currentMsgs,
          languageCode: langCode,
          timestamp: new Date()
        });
      }

      updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      localStorage.setItem('physiverse_tutor_sessions', JSON.stringify(updated));
      return updated;
    });
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setSelectedLanguageCode(session.languageCode || 'en-US');
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    setIsMobileHistoryOpen(false);
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInput('');
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const updated = prev.filter(s => s.id !== sessionId);
      localStorage.setItem('physiverse_tutor_sessions', JSON.stringify(updated));
      return updated;
    });

    if (currentSessionId === sessionId) {
      startNewChat();
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const targetLang = LANGUAGES.find(l => l.code === selectedLanguageCode) || LANGUAGES[0];

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      setCurrentSessionId(activeSessionId);
    }

    try {
      const promptToSend = `${content.trim()}\n\n(IMPORTANT: Respond to me in ${targetLang.name} (${targetLang.nativeName}) language. Provide all physics explanations and formulas translated in this language.)`;

      const requestMessages = messages.map(m => ({ role: m.role, content: m.content }));
      requestMessages.push({ role: 'user', content: promptToSend });

      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: requestMessages
        }),
      });

      const data = await response.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, I was unable to generate a response. Please try again.',
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      updateSessions(activeSessionId, finalMessages, selectedLanguageCode);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'An error occurred. If you just set up your API key, please restart the Next.js server.',
        timestamp: new Date(),
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      updateSessions(activeSessionId, finalMessages, selectedLanguageCode);
    } finally {
      setLoading(false);
    }
  };

  const activeLang = LANGUAGES.find(l => l.code === selectedLanguageCode) || LANGUAGES[0];

  return (
    <div className="pt-24 pb-4 h-[calc(100vh-1rem)] flex flex-col">
      <div className="section-container flex-1 flex flex-col max-w-5xl mx-auto w-full overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between py-4 border-b border-[var(--border-default)] mb-4">
          <div className="flex items-center gap-3">
            {/* Mobile History Toggle Button */}
            <button
              onClick={() => setIsMobileHistoryOpen(true)}
              className="p-2 md:hidden rounded-lg hover:bg-[var(--bg-tertiary)] border border-[var(--border-default)]"
              title="Chat History"
            >
              <History className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
            <div>
              <h1 className="text-lg md:text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-heading)' }}>
                AI Physics <span className="text-[var(--color-primary)]">Tutor</span>
              </h1>
              <p className="text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>
                Physics questions, quizzes, and simulations tutor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] font-medium hidden sm:inline">Language:</span>
              <select
                value={selectedLanguageCode}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs outline-none font-semibold border cursor-pointer transition-colors bg-[var(--bg-secondary)] border-[var(--border-default)]"
                style={{ color: 'var(--text-body)' }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions Reset */}
            <button
              onClick={startNewChat}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-white bg-[var(--color-primary)] hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Main Interface Layout */}
        <div className="flex-1 flex card-surface overflow-hidden rounded-2xl border border-[var(--border-default)]">
          
          {/* Desktop Sidebar (Chat Sessions) */}
          <div className="hidden md:flex w-60 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-default)] h-full overflow-hidden">
            <div className="p-3 border-b border-[var(--border-default)] bg-[var(--bg-tertiary)] flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider opacity-60">CHAT HISTORY</span>
              <button 
                onClick={startNewChat}
                className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--color-primary)]"
                title="Start a new session"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sessions.length === 0 ? (
                <div className="text-center text-xs py-8 opacity-40">No past sessions</div>
              ) : (
                sessions.map((s) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={s.id}
                    onClick={() => selectSession(s)}
                    onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') selectSession(s); }}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      currentSessionId === s.id 
                        ? 'bg-[rgba(255,85,0,0.08)] border border-[rgba(255,85,0,0.2)] text-[var(--color-primary)]' 
                        : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-body)] border border-transparent'
                    }`}
                  >
                    <div className="truncate flex-1 pr-2">
                      {s.title}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] px-1 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] scale-[0.9]">
                        {(s.languageCode || 'en').split('-')[0].toUpperCase()}
                      </span>
                      <button
                        onClick={(e) => deleteSession(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile Overlay Sidebar Drawer (History) */}
          <AnimatePresence>
            {isMobileHistoryOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileHistoryOpen(false)}
                  className="fixed inset-0 z-40 md:hidden bg-black"
                />
                
                {/* Sidebar Drawer */}
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-default)] flex flex-col h-full md:hidden"
                >
                  <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-tertiary)]">
                    <span className="text-xs font-bold tracking-wider opacity-60">CHAT HISTORY</span>
                    <button onClick={() => setIsMobileHistoryOpen(false)} className="p-1 rounded hover:bg-[var(--bg-secondary)]">
                      <X className="w-5 h-5 text-[var(--text-muted)]" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sessions.length === 0 ? (
                      <div className="text-center text-xs py-8 opacity-40">No past sessions</div>
                    ) : (
                      sessions.map((s) => (
                        <div
                          role="button"
                          tabIndex={0}
                          key={s.id}
                          onClick={() => selectSession(s)}
                          onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') selectSession(s); }}
                          className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            currentSessionId === s.id 
                              ? 'bg-[rgba(255,85,0,0.08)] border border-[rgba(255,85,0,0.2)] text-[var(--color-primary)]' 
                              : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-body)] border border-transparent'
                          }`}
                        >
                          <div className="truncate flex-1 pr-2">
                            {s.title}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] px-1 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                              {(s.languageCode || 'en').split('-')[0].toUpperCase()}
                            </span>
                            <button
                              onClick={(e) => deleteSession(s.id, e)}
                              className="text-[var(--text-muted)] hover:text-red-500 p-0.5"
                              title="Delete chat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Chat Feed Area */}
          <div className="flex-1 flex flex-col bg-[var(--bg-tertiary)] h-full overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <Bot className="w-16 h-16 mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
                    Learn physics in {activeLang.nativeName}
                  </h3>
                  <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--text-muted)' }}>
                    Type your question, or click one of the quick prompts below to get started.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => setInput(action.prompt)}
                          className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.02] bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-[rgba(255,85,0,0.3)]"
                        >
                          <Icon className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(255, 85, 0, 0.1)' }}>
                        <Bot className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                    )}
                    <div
                      className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                        color: msg.role === 'user' ? 'white' : 'var(--text-body)',
                        border: msg.role === 'user' ? 'none' : '1px solid var(--border-default)'
                      }}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className="flex items-center justify-between gap-4 mt-1.5 opacity-50">
                        <div className="text-[10px]">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {msg.role === 'assistant' && (
                          <button
                            onClick={() => toggleSpeech(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-white/10 transition-colors flex items-center justify-center"
                            title={speakingId === msg.id ? "Stop reading" : "Read aloud"}
                          >
                            {speakingId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 hover:text-white" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255, 85, 0, 0.1)' }}>
                    <Bot className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Form Bar */}
            <div className="p-4 bg-[var(--bg-secondary)]" style={{ borderTop: '1px solid var(--border-default)' }}>
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-end gap-2"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder={isListening ? "Listening... Speak now!" : `Ask a question in ${activeLang.name}...`}
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-body)' }}
                  id="ai-tutor-input"
                />
                
                {/* Voice command button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    isListening ? 'bg-[var(--color-primary)] text-white animate-pulse' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white border border-[var(--border-default)]'
                  }`}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30"
                  style={{ background: 'var(--gradient-primary)' }}
                  id="ai-tutor-send"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
