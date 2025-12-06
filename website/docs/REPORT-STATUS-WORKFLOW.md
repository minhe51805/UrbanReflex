<!--
============================================================================
UrbanReflex — Smart City Intelligence Platform
Copyright (C) 2025  WAG

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

For more information, visit: https://github.com/minhe51805/UrbanReflex
============================================================================
-->

# Report Status Workflow Documentation

## 📋 Overview

UrbanReflex uses an automated AI-powered report status management system (Report Status Workflow) to optimize the review and display process for citizen reports.

## 🔄 Status Flow Diagram

```
User Submit Report
        ↓
   [submitted]
        ↓
   AI Processing
        ↓
   [ai_processing]
        ↓
    ┌───────┴───────┐
    ↓               ↓
[auto_approved]  [pending_review]
    ↓               ↓
(Show Public)   Admin Review
    ↓               ↓
    |          [approved] ───→ (Show Public)
    |               ↓
    |          [rejected] ───→ (Hidden)
    ↓               ↓
    └───────┬───────┘
            ↓
      [resolved]
    (Issue Fixed)
```

## 📊 Status Definitions

### 1. `submitted` 📝

- **Meaning:** Report just submitted
- **Public Display:** ❌ No
- **Description:** User just submitted report, not yet processed by AI

### 2. `ai_processing` 🤖

- **Meaning:** AI is analyzing
- **Public Display:** ❌ No
- **Description:** Backend AI is classifying category, priority, severity

### 3. `auto_approved` ✅

- **Meaning:** Auto-approved by AI
- **Public Display:** ✅ Yes
- **Description:** Meets auto-approval conditions, displayed immediately on map

### 4. `pending_review` ⏳

- **Meaning:** Pending admin review
- **Public Display:** ❌ No
- **Description:** Does not meet auto-approval conditions, requires admin review

### 5. `approved` ✓

- **Meaning:** Manually approved by admin
- **Public Display:** ✅ Yes
- **Description:** Admin has reviewed and approved, displayed on map

### 6. `rejected` ✗

- **Meaning:** Rejected
- **Public Display:** ❌ No
- **Description:** Report is invalid, spam, or duplicate

### 7. `resolved` 🎉

- **Meaning:** Resolved
- **Public Display:** ✅ Yes
- **Description:** Issue has been resolved (still displayed to track history)

---

## 🤖 Auto-Approval Logic

### Auto-Approval Conditions

Report is **auto-approved** (`auto_approved`) if it meets **ALL** of the following conditions:

#### ✅ 1. AI Confidence >= 70%

```typescript
categoryConfidence >= 0.7;
```

- AI must be >= 70% confident about category classification
- Ensures high accuracy

#### ✅ 2. Low/Medium Priority

```typescript
priority in ["low", "medium"];
```

- Only auto-approve non-urgent reports
- `high` and `urgent` require admin review

#### ✅ 3. Low/Medium Severity

```typescript
severity in ["low", "medium"];
```

- Issue is not critical
- High severity requires careful evaluation

#### ✅ 4. Has Evidence Image

```typescript
verified === true || imageUrl.length > 0;
```

- Must have evidence image
- Increases reliability

### Example

#### ✅ Auto-Approved

```json
{
  "categoryConfidence": 0.85,
  "priority": "medium",
  "severity": "low",
  "verified": true,
  "imageUrl": ["https://..."]
}
→ Status: auto_approved ✅
```

#### ❌ Pending Review

```json
{
  "categoryConfidence": 0.65,  // < 0.7 ❌
  "priority": "high",           // Not in [low, medium] ❌
  "severity": "medium",
  "verified": true
}
→ Status: pending_review ⏳
```

---

## 🔐 Admin Permissions

### Status Transitions (Admin Only)

| Current Status   | Allowed Next Status                           |
| ---------------- | --------------------------------------------- |
| `submitted`      | `ai_processing`, `rejected`                   |
| `ai_processing`  | `auto_approved`, `pending_review`, `rejected` |
| `auto_approved`  | `resolved`, `rejected`                        |
| `pending_review` | `approved`, `rejected`                        |
| `approved`       | `resolved`, `rejected`                        |
| `rejected`       | `pending_review` (reopen)                     |
| `resolved`       | _(terminal state)_                            |

---

## 💻 Implementation

### Utilities Location

```
lib/utils/reportStatus.ts
```

### Key Functions

#### `shouldAutoApprove(report, criteria?)`

Check if report meets auto-approval conditions

```typescript
import { shouldAutoApprove } from "@/lib/utils/reportStatus";

const canAutoApprove = shouldAutoApprove({
  categoryConfidence: 0.85,
  priority: "medium",
  severity: "low",
  verified: true,
  imageUrl: ["https://..."],
});
// → true
```

#### `getStatusAfterAI(report)`

Get status after AI processing is complete

```typescript
import { getStatusAfterAI } from "@/lib/utils/reportStatus";

const nextStatus = getStatusAfterAI(reportData);
// → 'auto_approved' hoặc 'pending_review'
```

#### `isPubliclyVisible(status)`

Check if status is publicly visible

```typescript
import { isPubliclyVisible } from "@/lib/utils/reportStatus";

isPubliclyVisible("auto_approved"); // → true
isPubliclyVisible("pending_review"); // → false
```

#### `formatStatus(status)`

Format status into display string

```typescript
import { formatStatus } from "@/lib/utils/reportStatus";

formatStatus("auto_approved"); // → "✅ Auto Approved"
formatStatus("pending_review"); // → "⏳ Pending Review"
```

---

## 🎨 UI Components

### Status Badge

```tsx
import { getStatusBadgeClasses, formatStatus } from "@/lib/utils/reportStatus";

<span className={`px-2 py-1 rounded-full ${getStatusBadgeClasses(status)}`}>
  {formatStatus(status)}
</span>;
```

### Status Select (Admin)

```tsx
import { STATUS_CONFIG, formatStatus } from "@/lib/utils/reportStatus";

<select value={status} onChange={handleChange}>
  <option value="submitted">{formatStatus("submitted")}</option>
  <option value="ai_processing">{formatStatus("ai_processing")}</option>
  <option value="auto_approved">{formatStatus("auto_approved")}</option>
  <option value="pending_review">{formatStatus("pending_review")}</option>
  <option value="approved">{formatStatus("approved")}</option>
  <option value="rejected">{formatStatus("rejected")}</option>
  <option value="resolved">{formatStatus("resolved")}</option>
</select>;
```

---

## 📈 Statistics & Metrics

### Calculate Auto-Approval Rate

```typescript
const autoApprovalRate =
  (reports.filter((r) => r.status === "auto_approved").length /
    reports.filter((r) =>
      ["auto_approved", "pending_review"].includes(r.status)
    ).length) *
  100;

console.log(`Auto-approval rate: ${autoApprovalRate.toFixed(1)}%`);
```

### Track Pending Reviews

```typescript
const pendingCount = reports.filter(
  (r) => r.status === "pending_review"
).length;
console.log(`${pendingCount} reports pending admin review`);
```

---

## 🔧 Configuration

### Custom Auto-Approval Criteria

```typescript
import {
  shouldAutoApprove,
  type AutoApprovalCriteria,
} from "@/lib/utils/reportStatus";

const strictCriteria: AutoApprovalCriteria = {
  minConfidence: 0.85, // Raise to 85%
  allowedPriorities: ["low"], // Only low priority
  allowedSeverities: ["low"], // Only low severity
  requiresImage: true,
};

const canApprove = shouldAutoApprove(report, strictCriteria);
```

---

## 📝 Notes

- **Public Visibility:** Only reports with `isPublic: true` are displayed on public map
- **AI Processing:** Backend AI endpoint must update status from `submitted` → `ai_processing` → `auto_approved/pending_review`
- **Admin Override:** Admin can manually override any status
- **Audit Trail:** All status changes should be logged to `dateModified` field

---

## 🚀 Future Improvements

1. **Machine Learning:** Learn from admin decisions to improve auto-approval logic
2. **Priority Scoring:** Automatically calculate priority score based on multiple factors
3. **Duplicate Detection:** AI detects duplicate reports
4. **Auto-Resolution:** Automatically resolve after fix is complete (integration with actual work)

---

**Author:** Trương Dương Bảo Minh (minhe51805)  
**Last Updated:** 2025-12-04  
**Version:** 1.0.0
