'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, Lightbulb, HelpCircle, BookOpen, Target, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: HelpCircle, label: 'Explain a Concept', prompt: 'Explain the concept of ' },
  { icon: Target, label: 'Solve a Problem', prompt: 'Help me solve this physics problem: ' },
  { icon: BookOpen, label: 'Generate Quiz', prompt: 'Generate a 5-question quiz about ' },
  { icon: Lightbulb, label: 'Study Tips', prompt: 'Give me study recommendations for ' },
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, I was unable to generate a response. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m currently running in offline mode. To enable AI responses, add your `GEMINI_API_KEY` to the `.env.local` file. In the meantime, here\'s a tip: Try using the Formula Explorer or Simulations to explore physics concepts interactively!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-4 min-h-screen flex flex-col">
      <div className="section-container flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-3"
            style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
            <Sparkles className="w-4 h-4" />
            Powered by Gemini
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
            AI Physics <span className="gradient-text">Tutor</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Ask questions, solve problems, generate quizzes, and get study recommendations.
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col card-surface overflow-hidden" style={{ minHeight: '400px' }}>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Bot className="w-16 h-16 mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
                  How can I help you learn physics?
                </h3>
                <p className="text-sm mb-8 max-w-md" style={{ color: 'var(--text-muted)' }}>
                  I can explain concepts, solve problems step-by-step, generate quizzes, and provide study recommendations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => setInput(action.prompt)}
                        className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)' }}
                      >
                        <Icon className="w-5 h-5 shrink-0" style={{ color: '#8B5CF6' }} />
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
                      style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                      <Bot className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    </div>
                  )}
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                      color: msg.role === 'user' ? 'white' : 'var(--text-body)',
                    }}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-xs mt-1.5 opacity-50">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                  <Bot className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                </div>
                <div className="px-4 py-3 rounded-2xl" style={{ background: 'var(--bg-tertiary)' }}>
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#8B5CF6' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="p-4" style={{ borderTop: '1px solid var(--border-default)' }}>
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
                placeholder="Ask a physics question..."
                rows={1}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-body)' }}
                id="ai-tutor-input"
              />
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
  );
}
