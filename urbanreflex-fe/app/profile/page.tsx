'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Save, AlertTriangle, CheckCircle, Key, Copy, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

type ProfileSection = 'profile' | 'security' | 'api-keys';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
}

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ProfileSection>('profile');

  const [profileData, setProfileData] = useState({ full_name: '', username: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      setProfileData({ full_name: user.full_name, username: user.username, phone: user.phone });
      // Load API keys
      loadApiKeys();
    }
  }, [loading, isAuthenticated, router, user]);

  const loadApiKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/keys', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    console.log('Updating profile with:', profileData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage({ type: 'success', text: 'Profile updated successfully! (API not implemented)' });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
    }
    setMessage(null);
    console.log('Changing password...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage({ type: 'success', text: 'Password changed successfully! (API not implemented)' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/keys', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newKeyName })
      });

      if (response.ok) {
        const data = await response.json();
        setNewlyCreatedKey(data.key);
        setNewKeyName('');
        await loadApiKeys();
        setMessage({ type: 'success', text: 'API key created successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.detail || 'Failed to create API key' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create API key' });
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadApiKeys();
        setMessage({ type: 'success', text: 'API key deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete API key' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete API key' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'API key copied to clipboard!' });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(24) + key.substring(key.length - 4);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav className="space-y-1">
              <button onClick={() => setActiveSection('profile')} className={`w-full text-left flex items-center px-4 py-2 rounded-lg ${activeSection === 'profile' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}>
                <User className="w-5 h-5 mr-3" />
                <span className="font-medium">Profile</span>
              </button>
              <button onClick={() => setActiveSection('security')} className={`w-full text-left flex items-center px-4 py-2 rounded-lg ${activeSection === 'security' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}>
                <Lock className="w-5 h-5 mr-3" />
                <span className="font-medium">Security</span>
              </button>
              <button onClick={() => setActiveSection('api-keys')} className={`w-full text-left flex items-center px-4 py-2 rounded-lg ${activeSection === 'api-keys' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}>
                <Key className="w-5 h-5 mr-3" />
                <span className="font-medium">API Keys</span>
              </button>
            </nav>
          </aside>

          <main className="md:col-span-3">
            {message && (
              <div className={`p-4 mb-6 rounded-lg flex items-start space-x-3 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{message.text}</p>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Personal Information</h2>
                <p className="text-slate-500 mb-6">Update your photo and personal details here.</p>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" id="email" value={user.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                    <input type="text" id="username" value={profileData.username} onChange={(e) => setProfileData({...profileData, username: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" id="full_name" value={profileData.full_name} onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="tel" id="phone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Change Password</h2>
                <p className="text-slate-500 mb-6">Update your password for enhanced security.</p>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">Current Password</label>
                    <input type="password" id="currentPassword" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" required />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New Password</label>
                    <input type="password" id="newPassword" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" required />
                  </div>
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input type="password" id="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" required />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <Lock className="w-4 h-4 mr-2" /> Change Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'api-keys' && (
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">API Keys</h2>
                    <p className="text-slate-500">Manage your API keys for accessing UrbanReflex API.</p>
                  </div>
                  <button
                    onClick={() => setShowNewKeyModal(true)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create New Key
                  </button>
                </div>

                {/* Newly Created Key Alert */}
                {newlyCreatedKey && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-green-800 mb-2">API Key Created Successfully!</h3>
                        <p className="text-sm text-green-700 mb-3">Make sure to copy your API key now. You won't be able to see it again!</p>
                        <div className="flex items-center space-x-2">
                          <code className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono text-gray-900">
                            {newlyCreatedKey}
                          </code>
                          <button
                            onClick={() => copyToClipboard(newlyCreatedKey)}
                            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => setNewlyCreatedKey(null)}
                          className="mt-3 text-sm text-green-700 hover:text-green-800 font-medium"
                        >
                          I've saved my key
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Keys List */}
                <div className="space-y-4">
                  {apiKeys.length === 0 ? (
                    <div className="text-center py-12">
                      <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
                      <p className="text-gray-500 mb-4">You haven't created any API keys yet.</p>
                      <button
                        onClick={() => setShowNewKeyModal(true)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Create Your First Key
                      </button>
                    </div>
                  ) : (
                    apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{apiKey.name}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
                                {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                              </code>
                              <button
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                                title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                              >
                                {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(apiKey.key)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                                title="Copy to clipboard"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-sm text-gray-500">
                              <p>Created: {new Date(apiKey.created_at).toLocaleDateString()}</p>
                              {apiKey.last_used && <p>Last used: {new Date(apiKey.last_used).toLocaleDateString()}</p>}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                            className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete API key"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Create New API Key</h2>
            <form onSubmit={handleCreateApiKey}>
              <div className="mb-6">
                <label htmlFor="keyName" className="block text-sm font-medium text-slate-700 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API, Development Key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Choose a descriptive name to help you identify this key later.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewKeyModal(false);
                    setNewKeyName('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

