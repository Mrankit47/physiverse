'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Orbit, Waves, Play, HelpCircle, ChevronRight, Check, X, Award
} from 'lucide-react';

const domainData: Record<string, {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  chapters: {
    title: string;
    lessons: {
      id: string;
      title: string;
      content: string;
      formula: string;
      quiz: {
        question: string;
        options: string[];
        answer: number;
        explanation: string;
      };
    }[];
  }[];
}> = {
  mechanics: {
    name: 'Classical Mechanics',
    icon: Orbit,
    color: '#3B82F6',
    chapters: [
      {
        title: 'Energy & Work',
        lessons: [
          {
            id: 'work-energy-theorem',
            title: 'The Work-Energy Theorem',
            content: 'Work is defined as force applied over a distance. When work is done on an object, its kinetic energy changes. The Work-Energy Theorem states that the net work done on an object is equal to its change in kinetic energy: W_net = ΔKE. If the work is positive, the object speeds up. If negative, it slows down.',
            formula: 'W = F · d · cos(θ) = ΔKE',
            quiz: {
              question: 'If a constant force of 10 N pushes a 2 kg box over a distance of 5 m on a frictionless surface, what is the change in kinetic energy of the box?',
              options: ['10 Joules', '25 Joules', '50 Joules', '100 Joules'],
              answer: 2,
              explanation: 'Work = Force × distance = 10 N × 5 m = 50 J. By the Work-Energy Theorem, the change in kinetic energy is equal to the work done: ΔKE = 50 J.'
            }
          },
          {
            id: 'conservation-of-energy',
            title: 'Conservation of Mechanical Energy',
            content: 'In a conservative system (no friction or drag), the total mechanical energy (E = KE + PE) remains constant. Potential energy can be converted to kinetic energy and vice versa, but the sum is conserved. For example, a falling object loses potential energy and gains kinetic energy: mgh_initial + ½mv²_initial = mgh_final + ½mv²_final.',
            formula: 'E_total = KE + PE = constant',
            quiz: {
              question: 'A 1 kg ball is dropped from a height of 5 m. Ignoring air resistance, what is its kinetic energy just before hitting the ground? (Use g = 9.8 m/s²)',
              options: ['4.9 J', '9.8 J', '49 J', '98 J'],
              answer: 2,
              explanation: 'By conservation of energy, the initial potential energy (PE = mgh) is fully converted to kinetic energy (KE) at the bottom. PE = 1 kg × 9.8 m/s² × 5 m = 49 J. Therefore, final KE = 49 J.'
            }
          }
        ]
      }
    ]
  },
  waves: {
    name: 'Waves & Sound',
    icon: Waves,
    color: '#10B981',
    chapters: [
      {
        title: 'Wave Properties',
        lessons: [
          {
            id: 'wave-propagation',
            title: 'Wave Velocity & Propagation',
            content: 'A mechanical wave is a disturbance that travels through a medium, transferring energy without transferring matter. The speed of a wave depends on the properties of the medium. For any periodic wave, the speed v is the product of its frequency f and wavelength λ: v = fλ.',
            formula: 'v = f · λ',
            quiz: {
              question: 'A sound wave has a frequency of 250 Hz and travels at 340 m/s. What is its wavelength?',
              options: ['0.73 m', '1.36 m', '2.50 m', '8.50 m'],
              answer: 1,
              explanation: 'Using the wave equation v = fλ, we rearrange for wavelength: λ = v/f = 340 / 250 = 1.36 m.'
            }
          }
        ]
      }
    ]
  }
};

export default function LearnDetailPage() {
  const params = useParams();
  const domainId = params.domainId as string;
  const domain = domainData[domainId] || domainData.mechanics;

  const [activeLesson, setActiveLesson] = useState(domain.chapters[0].lessons[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  const handleAnswerSubmit = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    if (optionIndex === activeLesson.quiz.answer && !xpEarned) {
      setXpEarned(true);
    }
  };

  const selectLesson = (lesson: typeof activeLesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setShowExplanation(false);
    setXpEarned(false);
  };

  const Icon = domain.icon;

  return (
    <div className="pt-36 pb-20">
      <div className="section-container">
        {/* Breadcrumb */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:text-[var(--color-primary)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Curriculum
        </Link>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card-surface p-5" style={{ borderColor: `${domain.color}30` }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5" style={{ color: domain.color }} />
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-heading)' }}>
                  {domain.name}
                </h2>
              </div>
              <div className="space-y-4">
                {domain.chapters.map((ch) => (
                  <div key={ch.title}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      {ch.title}
                    </div>
                    <div className="space-y-1">
                      {ch.lessons.map((les) => {
                        const isCurrent = les.id === activeLesson.id;
                        return (
                          <button
                            key={les.id}
                            onClick={() => selectLesson(les)}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                            style={{
                              background: isCurrent ? `${domain.color}15` : 'transparent',
                              color: isCurrent ? 'var(--text-heading)' : 'var(--text-muted)',
                              fontWeight: isCurrent ? '600' : '500'
                            }}
                          >
                            <BookOpen className="w-4 h-4 shrink-0" style={{ color: isCurrent ? domain.color : 'inherit' }} />
                            <span className="truncate">{les.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Simulation Card */}
            <div className="card-surface p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>
                Related 3D Simulation
              </h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Practice this concept in our interactive 3D laboratory.
              </p>
              <Link
                href="/simulations"
                className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-md"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <span className="flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Launch Sandbox
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Lesson Content Area */}
          <div className="space-y-6">
            {/* Main Article */}
            <article className="card-surface p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
                {activeLesson.title}
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-body)' }}>
                {activeLesson.content}
              </p>

              {/* Equation Box */}
              <div className="p-5 rounded-xl text-center my-6" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  Mathematical Model
                </div>
                <div className="text-2xl font-mono font-bold" style={{ color: domain.color }}>
                  {activeLesson.formula}
                </div>
              </div>
            </article>

            {/* Quiz Card */}
            <div className="card-surface p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
                  Concept Check
                </h2>
              </div>
              <p className="text-sm mb-5" style={{ color: 'var(--text-body)' }}>
                {activeLesson.quiz.question}
              </p>
              <div className="grid gap-3 mb-5">
                {activeLesson.quiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === activeLesson.quiz.answer;
                  let btnBg = 'var(--bg-tertiary)';
                  let btnBorder = 'var(--border-default)';
                  let icon = null;

                  if (showExplanation) {
                    if (isCorrect) {
                      btnBg = 'rgba(16, 185, 129, 0.1)';
                      btnBorder = '#10B981';
                      icon = <Check className="w-4 h-4 text-green-500" />;
                    } else if (isSelected) {
                      btnBg = 'rgba(239, 68, 68, 0.1)';
                      btnBorder = '#EF4444';
                      icon = <X className="w-4 h-4 text-red-500" />;
                    }
                  } else if (isSelected) {
                    btnBg = `${domain.color}15`;
                    btnBorder = domain.color;
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showExplanation}
                      onClick={() => setSelectedOption(idx)}
                      className="w-full text-left p-4 rounded-xl text-sm flex items-center justify-between transition-all"
                      style={{
                        background: btnBg,
                        border: `1px solid ${btnBorder}`,
                        color: 'var(--text-body)'
                      }}
                    >
                      <span>{opt}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {!showExplanation && (
                <button
                  disabled={selectedOption === null}
                  onClick={() => selectedOption !== null && handleAnswerSubmit(selectedOption)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  Submit Answer
                </button>
              )}

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl mt-4"
                  style={{ background: 'var(--bg-tertiary)', borderLeft: `4px solid ${selectedOption === activeLesson.quiz.answer ? '#10B981' : '#EF4444'}` }}
                >
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
                    {selectedOption === activeLesson.quiz.answer ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {activeLesson.quiz.explanation}
                  </p>
                </motion.div>
              )}

              {/* XP Claim alert */}
              {xpEarned && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 p-3 rounded-xl mt-4 text-xs font-semibold text-green-700 bg-green-50 border border-green-200"
                >
                  <Award className="w-4 h-4 text-green-600" />
                  Correct answer! You earned 10 XP points!
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
