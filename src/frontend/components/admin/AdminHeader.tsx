'use client';

import Link from 'next/link';
import { Shield, Home, Bell, Settings, LogOut } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                UrbanReflex Admin
              </h1>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/admin" 
              className="text-slate-600 hover:text-primary transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/" 
              className="text-slate-600 hover:text-primary transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>View Site</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-600 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-600 hover:text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-600 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

