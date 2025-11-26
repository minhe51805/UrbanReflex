/**
 * Citizen Report Form Component
 * Allows citizens to submit reports to NGSI-LD Context Broker
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  reporterName: string;
  reporterContact: string;
  latitude: string;
  longitude: string;
}

const CATEGORIES = [
  { value: 'streetlight_broken', label: 'Streetlight Broken' },
  { value: 'traffic_issue', label: 'Traffic Issue' },
  { value: 'waste_dump', label: 'Waste Dump' },
  { value: 'road_damage', label: 'Road Damage' },
  { value: 'other', label: 'Other' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function CitizenReportForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    reporterName: '',
    reporterContact: '',
    latitude: '10.775',
    longitude: '106.7008',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const reportId = `urn:ngsi-ld:CitizenReport:HCMC-${timestamp}`;

      const report = {
        id: reportId,
        type: 'CitizenReport',
        '@context': ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'],
        location: {
          type: 'GeoProperty',
          value: {
            type: 'Point',
            coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
          }
        },
        category: {
          type: 'Property',
          value: formData.category
        },
        status: {
          type: 'Property',
          value: 'submitted'
        },
        title: {
          type: 'Property',
          value: formData.title
        },
        description: {
          type: 'Property',
          value: formData.description
        },
        priority: {
          type: 'Property',
          value: formData.priority
        },
        reporterName: {
          type: 'Property',
          value: formData.reporterName || 'Anonymous'
        },
        reporterContact: {
          type: 'Property',
          value: formData.reporterContact || 'N/A'
        },
        dateCreated: {
          type: 'Property',
          value: {
            '@type': 'DateTime',
            '@value': new Date().toISOString()
          }
        }
      };

      const response = await fetch('/api/ngsi-ld?type=CitizenReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit report');
      }

      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: 'other',
          priority: 'medium',
          reporterName: '',
          reporterContact: '',
          latitude: '10.775',
          longitude: '106.7008',
        });
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-large p-8 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <AlertCircle className="h-6 w-6 text-primary-600" />
        Submit a Report
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Brief description of the issue"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Detailed description of the issue..."
          />
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {PRIORITIES.map(pri => (
                <option key={pri.value} value={pri.value}>{pri.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Latitude *
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Longitude *
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Reporter Info (Optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Anonymous"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact (Optional)
            </label>
            <input
              type="text"
              name="reporterContact"
              value={formData.reporterContact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Email or phone"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Report submitted successfully!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || success}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Report
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

