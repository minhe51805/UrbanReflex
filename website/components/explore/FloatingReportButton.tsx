/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 25-11-2025
 * Description: Floating report button for quick access to report road issues
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, X, Send, MapPin, Camera, Trash2 } from 'lucide-react';
import { processReportWithAIAsync } from '@/lib/services/reportApproval';
import { processImages } from '@/lib/utils/imageProcessor';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface FloatingReportButtonProps {
  selectedRoad?: {
    id: string;
    name: string;
    location: {
      type: string;
      coordinates: number[][];
    };
  } | null;
}

export default function FloatingReportButton({ selectedRoad }: FloatingReportButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'road_damage',
    images: [] as File[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Button always visible, but modal only works for logged-in users

  // Map category to NGSI-LD entity type
  const getCategoryEntityType = (category: string): string => {
    const typeMap: Record<string, string> = {
      'road_damage': 'RoadReport',
      'pothole': 'PotholeReport',
      'traffic_sign': 'TrafficSignReport',
      'streetlight': 'StreetlightReport',
      'drainage': 'DrainageReport',
      'other': 'CitizenReport'
    };
    return typeMap[category] || 'CitizenReport';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoad) {
      setError('Please select a road on the map first');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const centerIndex = Math.floor(selectedRoad.location.coordinates.length / 2);
      const [lng, lat] = selectedRoad.location.coordinates[centerIndex];

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const entityType = getCategoryEntityType(formData.category);
      const reportId = `urn:ngsi-ld:${entityType}:${selectedRoad.id.split(':').pop()}-${timestamp}`;

      // Process images: compress and hash
      console.log(`📸 Processing ${formData.images.length} images...`);
      const imageHashes = formData.images.length > 0 
        ? await processImages(formData.images)
        : [];
      
      console.log(`✅ Images processed: ${imageHashes.join(', ')}`);

      const report = {
        id: reportId,
        type: entityType,
        '@context': [
          'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
        ],
        refRoadSegment: {
          type: 'Relationship',
          object: selectedRoad.id
        },
        // Alternative: try as string if Relationship format fails
        // refRoadSegment: selectedRoad.id,
        location: {
          type: 'GeoProperty',
          value: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        },
        title: {
          type: 'Property',
          value: formData.title
        },
        description: {
          type: 'Property',
          value: formData.description
        },
        reporterEmail: {
          type: 'Property',
          value: user?.email || 'anonymous'
        },
        reporterName: {
          type: 'Property',
          value: user?.email || 'anonymous'
        },
        images: {
          type: 'Property',
          value: imageHashes
        },
        imageCount: {
          type: 'Property',
          value: imageHashes.length
        },
        dateCreated: {
          type: 'Property',
          value: {
            '@type': 'DateTime',
            '@value': new Date().toISOString()
          }
        },
        dateModified: {
          type: 'Property',
          value: {
            '@type': 'DateTime',
            '@value': new Date().toISOString()
          }
        },
        // AI classification fields (empty initially)
        verified: {
          type: 'Property',
          value: false
        },
        category: {
          type: 'Property',
          value: 'unknown'
        },
        categoryConfidence: {
          type: 'Property',
          value: ''
        },
        priority: {
          type: 'Property',
          value: 'low'
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

      console.log('📤 Submitting report:', JSON.stringify(report, null, 2));

      // Step 1: Submit to NGSI-LD Context Broker
      const response = await fetch(`/api/ngsi-ld?type=${entityType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        let errorData;
        try {
          const errorText = await response.text();
          console.error('❌ Error response text:', errorText);
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { detail: errorText };
          }
        } catch {
          errorData = {};
        }
        
        console.error('❌ Report submission failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          report: JSON.stringify(report, null, 2)
        });
        
        const errorMessage = errorData.detail || errorData.message || errorData.title || `Failed to submit report: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      console.log('✅ Report submitted to NGSI-LD successfully');

      // Step 2: Process with AI and auto-approval (async - fire and forget)
      processReportWithAIAsync(reportId);

      // Report submitted successfully - Admin can view in dashboard
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setFormData({ title: '', description: '', category: 'road_damage', images: [] });
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button - Always visible */}
      <button
        onClick={() => {
          if (!user) {
            router.push('/login');
            return;
          }
          if (!selectedRoad) {
            setError('Vui lòng chọn một đường trên bản đồ trước khi báo cáo');
            setTimeout(() => setError(null), 4000);
            return;
          }
          setShowModal(true);
        }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-4 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all backdrop-blur-sm"
        title={!user ? 'Login to report' : selectedRoad ? `Report issue for ${selectedRoad.name}` : 'Select a road first'}
      >
        <div className="bg-transparent p-2 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-orange-600 stroke-2" fill="currentColor" />
        </div>
        <span className="hidden sm:inline text-orange-600 font-bold">Báo cáo</span>
      </button>

      {/* Error Toast */}
      {error && !showModal && (
        <div className="fixed bottom-24 right-8 z-40 bg-red-500 text-white px-4 py-3 rounded-xl shadow-xl animate-bounce">
          {error}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedRoad && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Report Road Issue</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Road Info */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border-2 border-blue-200">
                <p className="text-xs text-blue-700 font-bold mb-2 uppercase tracking-wide">Reporting for:</p>
                <p className="text-base font-bold text-blue-900 mb-2">{selectedRoad.name || 'Unnamed Road'}</p>
                <p className="text-xs text-blue-700 font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedRoad.location.coordinates[0][1].toFixed(4)}°, {selectedRoad.location.coordinates[0][0].toFixed(4)}°
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white font-medium"
                  required
                >
                  <option value="road_damage">🛣️ Road Damage</option>
                  <option value="pothole">🕳️ Pothole</option>
                  <option value="traffic_sign">🚦 Traffic Sign Issue</option>
                  <option value="streetlight">💡 Streetlight Problem</option>
                  <option value="drainage">💧 Drainage Issue</option>
                  <option value="other">❓ Other</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-medium"
                  rows={4}
                  placeholder="Detailed description of the issue..."
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  📸 Photos (Optional, max 3)
                </label>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={120}
                          height={120}
                          className="w-full h-28 object-cover rounded-xl border-2 border-gray-300 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length < 3 && (
                  <label className="flex flex-col items-center justify-center gap-2 px-6 py-6 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group">
                    <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors">
                      <Camera className="h-6 w-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                      {formData.images.length === 0 ? 'Add Photos' : `Add More (${3 - formData.images.length} left)`}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Upload clear photos of the issue. Max 3 images, 5MB each.
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
                  <span className="text-lg">❌</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 text-green-800 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span>Báo cáo đã được gửi thành công! Admin sẽ xem xét trong thời gian sớm nhất.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || success}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : success ? (
                  <>
                    <span className="text-xl">✓</span>
                    <span>Report Submitted</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


