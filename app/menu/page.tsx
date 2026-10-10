'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserCircle, 
  Settings,
  Info,
  Mail,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function MenuPage() {
  const router = useRouter();

  const menuSections = [
    {
      title: 'Account & Information',
      subtitle: 'Manage your platform identity, preferences, and corporate details',
      items: [
        {
          name: 'User Profile',
          href: '/profile',
          icon: UserCircle,
          description: 'Customize your professional profile, showcase achievements, experience, and projects.',
          badge: 'Account'
        },
        {
          name: 'Settings & Security',
          href: '/settings',
          icon: Settings,
          description: 'Configure account security, notification triggers, privacy preferences, and themes.',
          badge: 'Preferences'
        },
        {
          name: 'Contact & Support',
          href: '/contact',
          icon: Mail,
          description: 'Reach out to support, submit feedback, or request custom enterprise onboarding.',
          badge: 'Support'
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Sticky Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 text-xs font-bold"
            aria-label="Go back"
            title="Return to previous page"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12">
        {/* Menu Grid Content */}
        <div className="space-y-12">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  {section.title}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{section.subtitle}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-red-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                            {item.badge}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5 font-normal">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span>Open {item.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


