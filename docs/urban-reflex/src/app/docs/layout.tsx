import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs with Animation */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse-slower" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]"></div>
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <DocsLayout 
        tree={source.pageTree} 
        {...baseOptions()}
        sidebar={{
          banner: (
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-violet-500/10 backdrop-blur-xl border border-blue-500/20 shadow-lg relative overflow-hidden group">
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live Documentation</span>
                </div>
                <h3 className="text-base font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent mb-1">
                  UrbanReflex Docs
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Smart City Monitoring System for HCMC
                </p>
              </div>
            </div>
          ),
          collapsible: true,
          defaultOpenLevel: 0,
        }}
      >
        {/* Enhanced Content Container */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Main Content */}
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20">
            <div className="docs-content">
              {children}
            </div>
          </article>
        </div>
      </DocsLayout>
    </div>
  );
}
