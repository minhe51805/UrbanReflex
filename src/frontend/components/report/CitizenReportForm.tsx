/**
 * Citizen Report Form Component - Road Infrastructure Reporting
 * 
 * @module components/report/CitizenReportForm
 * @description Allows citizens to submit road infrastructure reports to NGSI-LD Context Broker
 *              and automatically classify reports using AI backend service.
 * 
 * @see {@link https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld} NGSI-LD Context
 * @see {@link https://pulsar-ai.site/api/v1/citizen-reports/classify} AI Classification API
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, AlertCircle, CheckCircle, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

/**
 * Form data interface matching NGSI-LD entity schema
 * @interface FormData
 */
interface FormData {
  category: string;
  title: string;
  description: string;
  reporterName: string;
  reporterContact: string;
  reporterEmail: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  refRoadSegment: string;
}

/**
 * AI Classification response from backend
 * @interface AIClassificationResponse
 */
interface AIClassificationResponse {
  category?: string;
  categoryConfidence?: number;
  priority?: string;
  severity?: string;
  verified?: boolean;
  message?: string;
}

/**
 * Report categories with emoji icons and NGSI-LD type mapping
 * @constant
 */
const REPORT_CATEGORIES = [
  { 
    value: 'road_damage', 
    label: '🚧 Road Damage', 
    emoji: '🚧',
    ngsiType: 'RoadReport',
    description: 'Damaged, cracked, or sunken road'
  },
  { 
    value: 'pothole', 
    label: '🕳️ Pothole', 
    emoji: '🕳️',
    ngsiType: 'PotholeReport',
    description: 'Potholes and deep holes on road'
  },
  { 
    value: 'traffic_sign_issue', 
    label: '🚦 Traffic Sign Issue', 
    emoji: '🚦',
    ngsiType: 'TrafficSignReport',
    description: 'Damaged, faded, or missing traffic signs'
  },
  { 
    value: 'streetlight_problem', 
    label: '💡 Streetlight Problem', 
    emoji: '💡',
    ngsiType: 'StreetlightReport',
    description: 'Non-functioning streetlights'
  },
  { 
    value: 'drainage_issue', 
    label: '💧 Drainage Issue', 
    emoji: '💧',
    ngsiType: 'DrainageReport',
    description: 'Clogged drainage'
  },
  { 
    value: 'other', 
    label: '❓ Other', 
    emoji: '❓',
    ngsiType: 'CitizenReport',
    description: 'Other issues'
  },
] as const;

/**
 * Get NGSI-LD entity type from category value
 * @param {string} category - Category value
 * @returns {string} NGSI-LD entity type
 */
const getCategoryNgsiType = (category: string): string => {
  const found = REPORT_CATEGORIES.find(cat => cat.value === category);
  return found?.ngsiType || 'CitizenReport';
};

/**
 * Main component for citizen road infrastructure reporting
 * @component CitizenReportForm
 * @returns {JSX.Element} Form component with validation and AI classification
 */
export default function CitizenReportForm() {
  // Form state with default coordinates for Ho Chi Minh City center
  const [formData, setFormData] = useState<FormData>({
    category: 'road_damage',
    title: '',
    description: '',
    reporterName: '',
    reporterContact: '',
    reporterEmail: '',
    latitude: '10.77689',
    longitude: '106.70098',
    imageUrl: '',
    refRoadSegment: '',
  });

  // UI state management
  const [submitting, setSubmitting] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiClassification, setAiClassification] = useState<AIClassificationResponse | null>(null);

  /**
   * Submit report to NGSI-LD Context Broker and classify with AI
   * @async
   * @param {React.FormEvent} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    setAiClassification(null);

    try {
      // Get NGSI-LD entity type based on selected category
      const entityType = getCategoryNgsiType(formData.category);
      
      // Generate unique report ID with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const reportId = `urn:ngsi-ld:${entityType}:HCMC-${timestamp}`;
      const currentDateTime = new Date().toISOString();

      // Construct NGSI-LD compliant entity with dynamic type
      const report = {
        id: reportId,
        type: entityType,
        '@context': ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'],
        
        // Report content
        title: {
          type: 'Property',
          value: formData.title
        },
        description: {
          type: 'Property',
          value: formData.description
        },
        
        // Reporter information
        reporterName: {
          type: 'Property',
          value: formData.reporterName || 'Anonymous'
        },
        reporterContact: {
          type: 'Property',
          value: formData.reporterContact || 'N/A'
        },
        reporterEmail: {
          type: 'Property',
          value: formData.reporterEmail || 'N/A'
        },
        
        // Timestamps
        dateCreated: {
          type: 'Property',
          value: {
            '@type': 'DateTime',
            '@value': currentDateTime
          }
        },
        dateModified: {
          type: 'Property',
          value: {
            '@type': 'DateTime',
            '@value': currentDateTime
          }
        },
        
        // Location
        location: {
          type: 'GeoProperty',
          value: {
            type: 'Point',
            coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
          }
        },
        
        // References and media
        refRoadSegment: {
          type: 'Relationship',
          object: formData.refRoadSegment || 'urn:ngsi-ld:RoadSegment:HCMC-DEFAULT'
        },
        imageUrl: {
          type: 'Property',
          value: formData.imageUrl || ''
        },
        
        // AI classification fields (will be updated by backend)
        verified: {
          type: 'Property',
          value: false
        },
        category: {
          type: 'Property',
          value: ''
        },
        categoryConfidence: {
          type: 'Property',
          value: ''
        },
        priority: {
          type: 'Property',
          value: ''
        },
        severity: {
          type: 'Property',
          value: ''
        },
        status: {
          type: 'Property',
          value: 'submitted'
        }
      };

      // Step 1: Submit to NGSI-LD Context Broker
      console.log(`📤 Submitting ${entityType} to NGSI-LD...`, reportId);
      const ngsiResponse = await fetch(`/api/ngsi-ld?type=${entityType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!ngsiResponse.ok) {
        const errorData = await ngsiResponse.json();
        throw new Error(errorData.detail || 'Failed to submit report to NGSI-LD');
      }

      console.log('✅ Report submitted to NGSI-LD successfully');

      // Step 2: Call AI backend for classification
      setClassifying(true);
      console.log('🤖 Requesting AI classification...', reportId);
      
      try {
        const aiResponse = await fetch(
          `${process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'https://pulsar-ai.site'}/api/v1/citizen-reports/classify/${encodeURIComponent(reportId)}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          console.log('✅ AI Classification received:', aiData);
          setAiClassification(aiData);
        } else {
          // AI classification failed, but report was submitted successfully
          console.warn('⚠️ AI classification failed, but report was submitted');
          const errorData = await aiResponse.json().catch(() => ({}));
          console.warn('AI Error:', errorData);
        }
      } catch (aiError) {
        // AI service unavailable, but report was submitted successfully
        console.warn('⚠️ AI service unavailable:', aiError);
      } finally {
        setClassifying(false);
      }

      // Mark as successful
      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          category: 'road_damage',
          title: '',
          description: '',
          reporterName: '',
          reporterContact: '',
          reporterEmail: '',
          latitude: '10.77689',
          longitude: '106.70098',
          imageUrl: '',
          refRoadSegment: '',
        });
        setSuccess(false);
        setAiClassification(null);
      }, 3000);

    } catch (err) {
      console.error('❌ Error submitting report:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle form input changes
   * @param {React.ChangeEvent} e - Input change event
   */
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
        Report Road Infrastructure Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Issue Type <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {REPORT_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {REPORT_CATEGORIES.find(c => c.value === formData.category)?.description}
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Brief description of the issue (e.g., Streetlight not working)"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Describe the issue in detail, specific location, time of occurrence..."
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="10.77689"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Longitude <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="106.70098"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            Image URL (optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide a link to an image illustrating the issue (if available)
          </p>
        </div>

        {/* Road Segment Reference */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            Road Segment ID (optional)
          </label>
          <input
            type="text"
            name="refRoadSegment"
            value={formData.refRoadSegment}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="urn:ngsi-ld:RoadSegment:HCMC-32576911"
          />
          <p className="text-xs text-gray-500 mt-1">
            Road segment ID in the system (if known)
          </p>
        </div>

        {/* Reporter Info */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Reporter Information (optional)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="reporterContact"
                  value={formData.reporterContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+84 90 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="reporterEmail"
                  value={formData.reporterEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Classification Status */}
        {classifying && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>🤖 Classifying report with AI...</span>
          </div>
        )}

        {/* AI Classification Result */}
        {aiClassification && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              🤖 AI Classification Result
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {aiClassification.category && (
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium text-purple-700">{aiClassification.category}</span>
                </div>
              )}
              {aiClassification.priority && (
                <div>
                  <span className="text-gray-600">Priority Level:</span>
                  <span className="ml-2 font-medium text-purple-700">{aiClassification.priority}</span>
                </div>
              )}
              {aiClassification.severity && (
                <div>
                  <span className="text-gray-600">Severity Level:</span>
                  <span className="ml-2 font-medium text-purple-700">{aiClassification.severity}</span>
                </div>
              )}
              {aiClassification.categoryConfidence !== undefined && (
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className="ml-2 font-medium text-purple-700">
                    {(aiClassification.categoryConfidence * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>
              ✅ Report submitted successfully! 
              {aiClassification ? ' AI has classified the report.' : ''}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || success}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-medium hover:shadow-large transform hover:scale-[1.02]"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting report...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Report
            </>
          )}
        </button>

        {/* Info Footer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
          <p className="mb-1">
            ℹ️ Your report will be:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Stored in the NGSI-LD Context Broker system</li>
            <li>Automatically classified by AI to determine priority level</li>
            <li>Forwarded to the relevant department for processing</li>
          </ul>
        </div>
      </form>
    </motion.div>
  );
}

