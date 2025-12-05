/**
 * Report Auto-Approval Service
 * 
 * @module lib/services/reportApproval
 * @description Handles post-AI processing and auto-approval logic for reports
 */

import { shouldAutoApprove, getStatusAfterAI, type ReportStatus } from '@/lib/utils/reportStatus';

// Detect if running server-side or client-side
const isServer = typeof window === 'undefined';

// Use direct NGSI-LD URL on server, proxy on client
const ORION_LD_URL = process.env.NEXT_PUBLIC_ORION_LD_URL || 'http://103.178.233.233:1026/ngsi-ld/v1';
const NGSI_LD_BASE = isServer ? ORION_LD_URL : '/api/ngsi-ld';
const AI_BACKEND_URL = `${process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://163.61.183.90:8001'}/api/v1/citizen-reports`;

interface ReportEntity {
  id: string;
  type: string;
  category?: { type: string; value: string };
  categoryConfidence?: { type: string; value: number };
  priority?: { type: string; value: string };
  severity?: { type: string; value: string };
  status?: { type: string; value: string };
  verified?: { type: string; value: boolean };
  imageUrl?: { type: string; value: string | string[] };
  [key: string]: unknown;
}

/**
 * Poll NGSI-LD until AI classification is complete
 * 
 * @param reportId - The NGSI-LD entity ID
 * @param maxAttempts - Maximum number of polling attempts (default 10)
 * @param intervalMs - Polling interval in milliseconds (default 2000)
 * @returns The classified entity or null if timeout
 */
async function pollForAIClassification(
  reportId: string,
  maxAttempts: number = 10,
  intervalMs: number = 2000
): Promise<ReportEntity | null> {
  console.log(`🔄 Polling for AI classification: ${reportId}`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `${NGSI_LD_BASE}/entities/${encodeURIComponent(reportId)}`,
        {
          headers: {
            'Accept': 'application/ld+json'
          }
        }
      );

      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch entity (attempt ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        continue;
      }

      const entity: ReportEntity = await response.json();

      // Check if AI has processed (has category and confidence)
      const hasCategory = entity.category?.value;
      const hasConfidence = entity.categoryConfidence?.value !== undefined;
      const hasPriority = entity.priority?.value;

      if (hasCategory && hasConfidence && hasPriority) {
        console.log(`✅ AI classification complete (attempt ${attempt})`);
        console.log(`   Category: ${entity.category?.value} (${entity.categoryConfidence?.value})`);
        console.log(`   Priority: ${entity.priority?.value}`);
        return entity;
      }

      console.log(`⏳ AI still processing... (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      
    } catch (error) {
      console.error(`❌ Error polling entity (attempt ${attempt}):`, error);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  console.warn(`⚠️ Timeout waiting for AI classification after ${maxAttempts} attempts`);
  return null;
}

/**
 * Update report status in NGSI-LD
 * 
 * @param reportId - The NGSI-LD entity ID
 * @param status - New status value
 * @param reason - Reason for status change (optional)
 * @returns true if successful
 */
async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  reason?: string
): Promise<boolean> {
  try {
    const updateData: Record<string, unknown> = {
      status: {
        type: 'Property',
        value: status
      },
      dateModified: {
        type: 'Property',
        value: {
          '@type': 'DateTime',
          '@value': new Date().toISOString()
        }
      }
    };

    if (reason) {
      updateData.autoApprovalReason = {
        type: 'Property',
        value: reason
      };
    }

    const response = await fetch(
      `${NGSI_LD_BASE}/entities/${encodeURIComponent(reportId)}/attrs`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      }
    );

    if (!response.ok && response.status !== 204) {
      console.error(`❌ Failed to update status: ${response.status}`);
      return false;
    }

    console.log(`✅ Updated status to: ${status}`);
    return true;

  } catch (error) {
    console.error('❌ Error updating report status:', error);
    return false;
  }
}

/**
 * Process report after AI classification
 * 
 * This function:
 * 1. Triggers AI classification
 * 2. Polls until AI completes
 * 3. Applies auto-approval logic
 * 4. Updates status accordingly
 * 
 * @param reportId - The NGSI-LD entity ID
 * @returns Final status or null if failed
 */
export async function processReportWithAI(
  reportId: string
): Promise<ReportStatus | null> {
  try {
    console.log(`🤖 Starting AI processing for: ${reportId}`);

    // Step 1: Trigger AI classification
    try {
      await fetch(
        `${AI_BACKEND_URL}/classify/${encodeURIComponent(reportId)}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      console.log('✅ AI classification request sent');
    } catch (aiError) {
      console.warn('⚠️ AI service unavailable:', aiError);
      // Continue anyway - maybe it was already processed
    }

    // Step 2: Poll for AI results
    const entity = await pollForAIClassification(reportId);
    
    if (!entity) {
      console.warn('⚠️ Could not get AI classification results');
      return null;
    }

    // Step 3: Apply auto-approval logic
    const confidence = entity.categoryConfidence?.value || 0;
    const priority = entity.priority?.value || 'unassigned';
    const severity = entity.severity?.value || 'unassigned';
    const hasImage = entity.verified?.value || 
                     (entity.imageUrl?.value && (
                       (typeof entity.imageUrl.value === 'string' && entity.imageUrl.value.length > 0) ||
                       (Array.isArray(entity.imageUrl.value) && entity.imageUrl.value.length > 0)
                     ));

    const newStatus = getStatusAfterAI({
      categoryConfidence: confidence,
      priority,
      severity,
      verified: !!hasImage,
      imageUrl: entity.imageUrl?.value
    });

    console.log(`📊 Auto-approval evaluation:`);
    console.log(`   Confidence: ${confidence}`);
    console.log(`   Priority: ${priority}`);
    console.log(`   Severity: ${severity}`);
    console.log(`   Has Image: ${hasImage}`);
    console.log(`   → Decision: ${newStatus}`);

    // Step 4: Update status if needed
    const currentStatus = entity.status?.value;
    
    if (currentStatus !== newStatus) {
      const reason = shouldAutoApprove({
        categoryConfidence: confidence,
        priority,
        severity,
        verified: !!hasImage,
        imageUrl: entity.imageUrl?.value
      })
        ? `Auto-approved: AI confidence ${(confidence * 100).toFixed(0)}%, priority=${priority}, severity=${severity}, verified=${hasImage}`
        : `Pending review: Requires admin approval`;

      const updated = await updateReportStatus(reportId, newStatus, reason);
      
      if (!updated) {
        console.warn('⚠️ Failed to update status, but AI classification succeeded');
      }
    } else {
      console.log(`ℹ️ Status already correct: ${currentStatus}`);
    }

    return newStatus;

  } catch (error) {
    console.error('❌ Error processing report with AI:', error);
    return null;
  }
}

/**
 * Process report with AI in background (fire-and-forget)
 * 
 * Use this when you don't need to wait for the result
 * 
 * @param reportId - The NGSI-LD entity ID
 */
export function processReportWithAIAsync(reportId: string): void {
  processReportWithAI(reportId)
    .then(status => {
      if (status) {
        console.log(`✅ Background AI processing complete: ${status}`);
      }
    })
    .catch(error => {
      console.error('❌ Background AI processing failed:', error);
    });
}
