/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: Donation page with quick donation options and impact information
 */

'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import DotsBackground from '@/components/ui/DotsBackground';

const donationAmounts = [10, 25, 50, 100, 250, 500];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('monthly');

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <DotsBackground />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Make a Difference Today</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your donation helps us provide universal access to air quality data and fight air inequality worldwide.
          </p>
        </div>
      </div>

      {/* Donation Form Section */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="bg-white rounded-xl shadow-large border border-gray-200/80 p-6 sm:p-8"
        >
          {/* Frequency Toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1.5 mb-6">
            <button
              onClick={() => setFrequency('once')}
              className={`px-4 py-2.5 text-sm font-bold rounded-md transition-colors ${frequency === 'once' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-600 hover:text-gray-900'}`}>
              One-Time
            </button>
            <button
              onClick={() => setFrequency('monthly')}
              className={`px-4 py-2.5 text-sm font-bold rounded-md transition-colors ${frequency === 'monthly' ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-600 hover:text-gray-900'}`}>
              Monthly
            </button>
          </div>

          {/* Amount Selection */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
            {donationAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountClick(amount)}
                className={`py-3 px-2 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 border-2 ${selectedAmount === amount && !customAmount ? 'bg-primary-600 text-white border-primary-600 scale-105' : 'bg-white text-gray-800 border-gray-200 hover:border-primary-500'}`}>
                ${amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="relative mb-6">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
            <input
              type="number"
              placeholder="Or enter custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 py-3 pl-7 pr-3 text-base font-semibold placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
            />
          </div>

          {/* Donate Button */}
          <button className="w-full rounded-lg bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-4 text-base font-bold text-white hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-medium hover:shadow-large transform hover:scale-[1.02]">
            Donate ${finalAmount || 0} {frequency === 'monthly' ? 'per month' : ''}
          </button>

          {/* Security Note */}
          <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
            <Shield className="h-3 w-3 mr-1.5" />
            Secure payment powered by Stripe. Your donation is tax-deductible.
          </div>
        </motion.div>
      </main>
    </div>
  );
}

