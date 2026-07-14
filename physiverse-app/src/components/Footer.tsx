'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoIcon from './LogoIcon';
import {
  Mail,
  BookOpen,
  Orbit,
  Calculator,
  Bot,
  Users,
  FlaskConical,
  Heart,
} from 'lucide-react';
import { GithubIcon, TwitterIcon, YoutubeIcon } from './SocialIcons';



const domainIcons = [BookOpen, Orbit, FlaskConical, Calculator, Bot, Users];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '2px solid var(--color-primary)',
      }}
    >

      <div className="section-container" style={{ paddingTop: '100px', paddingBottom: '64px' }}>
        {/* Top area: Brand + Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-14">
          {/* Brand */}
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-md">
                <LogoIcon size={30} className="text-white" />
              </div>
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-heading)' }}
              >
                Physi<span className="gradient-text">verse</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Transform the way you learn physics. Immersive 3D simulations, AI-powered tutoring,
              and gamified experiences make every concept tangible and exciting.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: GithubIcon, href: '#', label: 'GitHub' },
                { icon: TwitterIcon, href: '#', label: 'Twitter' },
                { icon: YoutubeIcon, href: '#', label: 'YouTube' },
                { icon: Mail, href: '#', label: 'Email' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <social.icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-md">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-heading)' }}
            >
              Stay in orbit
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Get the latest simulations, learning tips, and platform updates delivered weekly.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-body)',
                }}
                id="footer-newsletter-email"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}
                id="footer-newsletter-submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>



        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Physiverse. Built with
            <Heart className="w-3 h-3 text-red-500 inline" />
            for curious minds.
          </p>
          <div className="flex items-center gap-4">
            {/* Physics domain icons as decoration */}
            <div className="hidden md:flex items-center gap-2 opacity-30">
              {domainIcons.map((Icon, i) => (
                <Icon key={i} className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
