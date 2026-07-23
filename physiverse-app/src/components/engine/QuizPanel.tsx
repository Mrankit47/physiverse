'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — QuizPanel Component
   Interactive quiz with scoring, hints, and explanations.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import type { QuizQuestion, QuizResult, QuizAnswer } from '@/types/content';
import { useAnalyticsStore } from '@/stores/analyticsStore';

interface QuizPanelProps {
  questions: QuizQuestion[];
  visualizationId: string;
  onComplete?: (result: QuizResult) => void;
  accentColor?: string;
}

export default function QuizPanel({
  questions,
  visualizationId,
  onComplete,
  accentColor = 'var(--color-primary)',
}: QuizPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const trackQuizResult = useAnalyticsStore((s) => s.trackQuizResult);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === String(currentQuestion?.correctAnswer);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer || !currentQuestion) return;
    setIsSubmitted(true);

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect: selectedAnswer === String(currentQuestion.correctAnswer),
      timeTaken: (Date.now() - questionStartTime) / 1000,
    };
    setAnswers((prev) => [...prev, answer]);
  }, [selectedAnswer, currentQuestion, questionStartTime]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setShowHint(false);
      setQuestionStartTime(Date.now());
    } else {
      // Quiz complete
      const allAnswers = [...answers];
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      const score = allAnswers.filter((a) => a.isCorrect).reduce((sum, a) => {
        const q = questions.find((qu) => qu.id === a.questionId);
        return sum + (q?.points ?? 0);
      }, 0);

      const result: QuizResult = {
        visualizationId,
        score,
        totalPoints,
        percentage: Math.round((score / totalPoints) * 100),
        answers: allAnswers,
        completedAt: new Date().toISOString(),
        timeTaken: (Date.now() - startTime) / 1000,
      };

      trackQuizResult(result);
      onComplete?.(result);
      setIsComplete(true);
    }
  }, [currentIndex, questions, answers, visualizationId, startTime, onComplete, trackQuizResult]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowHint(false);
    setAnswers([]);
    setIsComplete(false);
    setQuestionStartTime(Date.now());
  }, []);

  if (isComplete) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const score = answers.filter((a) => a.isCorrect).reduce((sum, a) => {
      const q = questions.find((qu) => qu.id === a.questionId);
      return sum + (q?.points ?? 0);
    }, 0);
    const percentage = Math.round((score / totalPoints) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 text-center"
      >
        <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: accentColor }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          {percentage === 100 ? 'Perfect Score!' : 'Quiz Complete!'}
        </h3>
        <p className="text-3xl font-bold mb-1" style={{ color: accentColor }}>
          {percentage}%
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {score} / {totalPoints} points
        </p>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: accentColor,
            color: '#fff',
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="p-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: `${accentColor}15`,
            color: accentColor,
          }}
        >
          {currentQuestion.difficulty}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 rounded-full mb-5"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: accentColor }}
          initial={false}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h4
            className="text-base font-semibold mb-4"
            style={{ color: 'var(--text-heading)' }}
          >
            {currentQuestion.question}
          </h4>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {currentQuestion.options?.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === String(currentQuestion.correctAnswer);

              let borderColor = 'var(--border-default)';
              let bgColor = 'transparent';
              if (isSubmitted && isCorrectOption) {
                borderColor = '#10B981';
                bgColor = 'rgba(16, 185, 129, 0.08)';
              } else if (isSubmitted && isSelected && !isCorrectOption) {
                borderColor = '#EF4444';
                bgColor = 'rgba(239, 68, 68, 0.08)';
              } else if (isSelected) {
                borderColor = accentColor;
                bgColor = `${accentColor}08`;
              }

              return (
                <button
                  key={i}
                  onClick={() => !isSubmitted && setSelectedAnswer(option)}
                  disabled={isSubmitted}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3"
                  style={{
                    border: `1.5px solid ${borderColor}`,
                    background: bgColor,
                    color: 'var(--text-body)',
                    cursor: isSubmitted ? 'default' : 'pointer',
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: isSelected ? accentColor : 'var(--bg-tertiary)',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#10B981' }} />
                  )}
                  {isSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 shrink-0" style={{ color: '#EF4444' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint */}
          {!isSubmitted && currentQuestion.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs font-medium mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
          {showHint && !isSubmitted && (
            <p
              className="text-xs px-3 py-2 rounded-lg mb-4"
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--text-body)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              💡 {currentQuestion.hint}
            </p>
          )}

          {/* Explanation */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-2 rounded-lg mb-4 text-xs"
              style={{
                background: isCorrect
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                color: 'var(--text-body)',
              }}
            >
              <span className="font-semibold">
                {isCorrect ? '✓ Correct!' : '✗ Incorrect.'}
              </span>{' '}
              {currentQuestion.explanation}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{
                  background: accentColor,
                  color: '#fff',
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: accentColor,
                  color: '#fff',
                }}
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  'See Results'
                )}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
