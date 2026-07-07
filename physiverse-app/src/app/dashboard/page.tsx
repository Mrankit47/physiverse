'use client';

import { motion } from 'framer-motion';
import {
  Trophy, Star, Flame, Target, Play,
  ArrowRight, Clock, Award, TrendingUp, Zap, Calendar,
} from 'lucide-react';
import Link from 'next/link';

const recentSims = [
  { title: 'Projectile Motion', progress: 85, color: '#10B981' },
  { title: 'Circuit Sandbox', progress: 60, color: '#EF4444' },
  { title: 'Wave on a String', progress: 40, color: '#F59E0B' },
];

const achievements = [
  { icon: '🚀', name: 'First Launch', desc: 'Completed your first simulation' },
  { icon: '🧪', name: 'Lab Rat', desc: 'Finished 5 virtual labs' },
  { icon: '⚡', name: 'Quick Learner', desc: '3-day learning streak' },
  { icon: '🎯', name: 'Sharpshooter', desc: '100% quiz accuracy' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardPage() {
  return (
    <div className="pt-36 pb-20">
      <div className="section-container">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: 'var(--text-heading)' }}>
            Welcome back, <span className="gradient-text">Explorer</span>! 👋
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
            Here&apos;s your learning progress at a glance.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Flame, label: 'Day Streak', value: '7', color: '#EF4444' },
            { icon: Star, label: 'Total XP', value: '2,450', color: '#F59E0B' },
            { icon: Trophy, label: 'Rank', value: '#42', color: '#8B5CF6' },
            { icon: Target, label: 'Completion', value: '34%', color: '#10B981' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={fadeUp} initial="hidden" animate="visible" className="card-surface p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            {/* Continue Learning */}
            <div className="card-surface p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                  <Play className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  Continue Learning
                </h2>
                <Link href="/learn" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="card-surface p-5 relative overflow-hidden" style={{ borderColor: 'var(--color-primary)' }}>
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'var(--gradient-primary)' }} />
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                  Mechanics
                </span>
                <h3 className="text-base font-semibold mt-2" style={{ color: 'var(--text-heading)' }}>
                  Chapter 3: Energy & Work
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Lesson 5 of 8 — Conservation of Energy
                </p>
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="h-full rounded-full" style={{ width: '62%', background: 'var(--gradient-primary)' }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>62% complete</span>
                  <Link href="/learn/energy-work-5" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                    Resume <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Simulations */}
            <div className="card-surface p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                Recent Simulations
              </h2>
              <div className="space-y-3">
                {recentSims.map((sim) => (
                  <div key={sim.title} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${sim.color}15` }}>
                      <Zap className="w-5 h-5" style={{ color: sim.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{sim.title}</div>
                      <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                        <div className="h-full rounded-full" style={{ width: `${sim.progress}%`, background: sim.color }} />
                      </div>
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{sim.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Activity */}
            <div className="card-surface p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                This Week
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  const active = i < 5;
                  return (
                    <div key={i} className="text-center">
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{day}</div>
                      <div
                        className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-semibold"
                        style={{
                          background: active ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                          color: active ? 'white' : 'var(--text-muted)',
                        }}
                      >
                        {active ? '✓' : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-4">
                <span className="text-2xl font-bold gradient-text">5/7</span>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>days active this week</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="card-surface p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <Award className="w-4 h-4" style={{ color: '#F59E0B' }} />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.name} className="flex items-center gap-3">
                    <span className="text-xl">{ach.icon}</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{ach.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ach.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Schedule */}
            <div className="card-surface p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <Clock className="w-4 h-4" style={{ color: '#06B6D4' }} />
                Today&apos;s Schedule
              </h3>
              <div className="space-y-2">
                {[
                  { time: '10:00', task: 'Energy Conservation Lesson', done: true },
                  { time: '11:30', task: 'Pendulum Simulation', done: true },
                  { time: '14:00', task: 'Quiz: Mechanics Ch.3', done: false },
                  { time: '16:00', task: 'Study Group Session', done: false },
                ].map((item) => (
                  <div key={item.task} className="flex items-start gap-3 text-xs text-left">
                    <span className="font-mono w-10 shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                    <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${item.done ? '' : 'animate-pulse'}`} style={{ background: item.done ? 'var(--color-success)' : 'var(--color-warning)' }} />
                    <span className="flex-1" style={{ color: item.done ? 'var(--text-muted)' : 'var(--text-body)', textDecoration: item.done ? 'line-through' : 'none' }}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
