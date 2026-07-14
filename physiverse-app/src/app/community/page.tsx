'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, ArrowRight, ThumbsUp, MessageCircle } from 'lucide-react';

const tabs = ['Discussions', 'Leaderboard', 'Study Groups', 'Notes'];

const discussions = [
  { id: 1, title: 'Why does time slow down near a black hole?', author: 'AstroNerd42', replies: 23, likes: 47, domain: 'Astrophysics', color: '#06B6D4', time: '2h ago' },
  { id: 2, title: 'Best way to understand Schrödinger equation?', author: 'QuantumCat', replies: 15, likes: 32, domain: 'Quantum', color: '#A855F7', time: '4h ago' },
  { id: 3, title: 'Real-world applications of electromagnetic induction', author: 'TeslaFan', replies: 8, likes: 21, domain: 'Electromagnetism', color: '#F59E0B', time: '6h ago' },
  { id: 4, title: 'How do I calculate moment of inertia for complex shapes?', author: 'MechEnthusiast', replies: 12, likes: 18, domain: 'Mechanics', color: '#3B82F6', time: '8h ago' },
  { id: 5, title: 'Double-slit experiment — wave or particle?', author: 'PhysicsPhD', replies: 31, likes: 56, domain: 'Quantum', color: '#A855F7', time: '1d ago' },
];

const leaderboard = [
  { rank: 1, name: 'NovaStar', xp: 12450, level: 'Quantum Master', avatar: '🌟' },
  { rank: 2, name: 'GravityWiz', xp: 11200, level: 'Force Expert', avatar: '🧠' },
  { rank: 3, name: 'PhotonRider', xp: 10800, level: 'Light Specialist', avatar: '⚡' },
  { rank: 4, name: 'WaveRunner', xp: 9500, level: 'Wave Pioneer', avatar: '🌊' },
  { rank: 5, name: 'AtomSmasher', xp: 8900, level: 'Nuclear Pro', avatar: '☢️' },
  { rank: 6, name: 'OrbitKing', xp: 8200, level: 'Space Navigator', avatar: '🚀' },
  { rank: 7, name: 'CircuitMaster', xp: 7800, level: 'Current Expert', avatar: '🔌' },
  { rank: 8, name: 'You', xp: 2450, level: 'Explorer', avatar: '👤' },
];

const studyGroups = [
  { name: 'Quantum Study Circle', members: 45, topic: 'Wave-Particle Duality', active: true, color: '#A855F7' },
  { name: 'Mechanics Masters', members: 78, topic: 'Rotational Dynamics', active: true, color: '#3B82F6' },
  { name: 'Astrophysics Club', members: 32, topic: 'Black Hole Thermodynamics', active: false, color: '#06B6D4' },
  { name: 'Circuit Builders', members: 56, topic: 'AC Circuit Analysis', active: true, color: '#F59E0B' },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Discussions');

  return (
    <div className="pt-36 pb-20">
      <div className="section-container max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4' }}>
            <Users className="w-4 h-4" />
            Learning Together
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Physics <span className="gradient-text">Community</span>
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Connect with fellow physics enthusiasts. Discuss, compete, and learn together.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab ? 'var(--gradient-primary)' : 'var(--bg-elevated)',
                color: activeTab === tab ? 'white' : 'var(--text-muted)',
                border: activeTab === tab ? 'none' : '1px solid var(--border-default)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Discussions */}
        {activeTab === 'Discussions' && (
          <div className="space-y-4">
            {discussions.map((d) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="card-surface p-5 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${d.color}15`, color: d.color }}>
                        {d.domain}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.time}</span>
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>
                      {d.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>by {d.author}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <ThumbsUp className="w-3 h-3" /> {d.likes}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <MessageCircle className="w-3 h-3" /> {d.replies}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'Leaderboard' && (
          <div className="card-surface overflow-hidden">
            {leaderboard.map((user, i) => {
              const isYou = user.name === 'You';
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
              return (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${isYou ? '' : 'hover:bg-[var(--bg-tertiary)]'}`}
                  style={{
                    borderBottom: '1px solid var(--border-default)',
                    background: isYou ? 'rgba(255, 85, 0, 0.05)' : undefined,
                  }}
                >
                  <span className="w-8 text-center text-sm font-bold" style={{ color: medal ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                    {medal || `#${user.rank}`}
                  </span>
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: isYou ? 'var(--color-primary)' : 'var(--text-heading)' }}>
                      {user.name} {isYou && '(You)'}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono" style={{ color: '#F59E0B' }}>{user.xp.toLocaleString()}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Study Groups */}
        {activeTab === 'Study Groups' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {studyGroups.map((group) => (
              <div key={group.name} className="card-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  {group.active && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                  <span className="text-xs" style={{ color: group.active ? '#10B981' : 'var(--text-muted)' }}>
                    {group.active ? 'Active Now' : 'Offline'}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{group.name}</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Current topic: {group.topic}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Users className="w-3 h-3" /> {group.members} members
                  </span>
                  <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: `${group.color}15`, color: group.color }}>
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {activeTab === 'Notes' && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Study Notes Sharing</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Share and discover community study notes. Coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
