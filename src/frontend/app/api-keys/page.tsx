/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
 */


'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Key, Copy, Trash2, Eye, EyeOff, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import DotsBackground from '@/components/ui/DotsBackground';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  requestCount: number;
  isActive: boolean;
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load API keys from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('urbanreflex_api_keys');
    if (stored) {
      setApiKeys(JSON.parse(stored));
    }
  }, []);

  // Save API keys to localStorage whenever they change
  useEffect(() => {
    if (apiKeys.length > 0) {
      localStorage.setItem('urbanreflex_api_keys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

  const generateAPIKey = () => {
    // Generate a secure API key
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    const randomStr2 = Math.random().toString(36).substring(2, 15);
    return `urx_${timestamp}_${randomStr}${randomStr2}`;
  };

  const createNewKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for your API key');
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generateAPIKey(),
      createdAt: new Date().toISOString(),
      lastUsed: null,
      requestCount: 0,
      isActive: true,
    };

    setApiKeys([...apiKeys, newKey]);
    setNewlyCreatedKey(newKey.key);
    setNewKeyName('');
    setShowNewKeyModal(false);

    // Auto-hide the newly created key after 30 seconds
    setTimeout(() => {
      setNewlyCreatedKey(null);
    }, 30000);
  };

  const deleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
      // Also remove from localStorage
      const updated = apiKeys.filter(key => key.id !== id);
      localStorage.setItem('urbanreflex_api_keys', JSON.stringify(updated));
    }
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    const parts = key.split('_');
    if (parts.length >= 3) {
      return `${parts[0]}_${parts[1]}_${'*'.repeat(20)}`;
    }
    return '*'.repeat(key.length);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden min-h-[400px]">
        <div className="absolute inset-0">
          <DotsBackground />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Key className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 text-[#1e64ab]" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#30363c] mb-6">
              API Key Management
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create and manage your API keys to access UrbanReflex data programmatically
            </p>
          </motion.div>
        </div>
      </section>

      {/* API Endpoint Info */}
      <section className="py-12 bg-blue-50 border-y border-blue-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-6 shadow-soft border border-blue-200">
            <h3 className="text-lg font-bold text-[#30363c] mb-3">API Base URL</h3>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <code className="flex-1 text-[#1e64ab]">
                {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1
              </code>
              <button
                onClick={() => copyToClipboard(
                  `${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1`,
                  'base-url'
                )}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copiedKey === 'base-url' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Include your API key in the request header: <code className="bg-gray-100 px-2 py-1 rounded">X-API-Key: your_api_key</code>
            </p>
          </div>
        </div>
      </section>

      {/* Newly Created Key Alert */}
      {newlyCreatedKey && (
        <section className="py-6 bg-green-50 border-b border-green-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-soft border-2 border-green-500"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#30363c] mb-2">API Key Created Successfully!</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Make sure to copy your API key now. You won't be able to see it again!
                  </p>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 font-mono text-sm">
                    <code className="flex-1 text-green-600 break-all">{newlyCreatedKey}</code>
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey, 'new-key')}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                    >
                      {copiedKey === 'new-key' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* API Keys List */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#30363c] mb-2">Your API Keys</h2>
              <p className="text-gray-600">Manage your API keys and monitor usage</p>
            </div>
            <button
              onClick={() => setShowNewKeyModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e64ab] text-white font-semibold hover:bg-[#1a5690] transition-all duration-300 shadow-soft hover:shadow-medium"
            >
              <Plus className="h-5 w-5" />
              Create New Key
            </button>
          </div>

          {apiKeys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
            >
              <Key className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No API Keys Yet</h3>
              <p className="text-gray-600 mb-6">Create your first API key to start using the UrbanReflex API</p>
              <button
                onClick={() => setShowNewKeyModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e64ab] text-white font-semibold hover:bg-[#1a5690] transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                Create API Key
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey, index) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-[#30363c]">{apiKey.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          apiKey.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 mb-4 font-mono text-sm">
                        <code className="flex-1 text-gray-700">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedKey === apiKey.id ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <p className="font-semibold text-[#30363c]">
                            {new Date(apiKey.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Used:</span>
                          <p className="font-semibold text-[#30363c]">
                            {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Requests:</span>
                          <p className="font-semibold text-[#30363c]">
                            {apiKey.requestCount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteKey(apiKey.id)}
                      className="p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Delete API key"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full shadow-large"
          >
            <h3 className="text-2xl font-bold text-[#30363c] mb-4">Create New API Key</h3>
            <p className="text-gray-600 mb-6">
              Give your API key a descriptive name to help you identify it later.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#30363c] mb-2">
                API Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production App, Development, Mobile App"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e64ab] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && createNewKey()}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewKeyModal(false);
                  setNewKeyName('');
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewKey}
                className="flex-1 px-6 py-3 rounded-xl bg-[#1e64ab] text-white font-semibold hover:bg-[#1a5690] transition-colors"
              >
                Create Key
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

