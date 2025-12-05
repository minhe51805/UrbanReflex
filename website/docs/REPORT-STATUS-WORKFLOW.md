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

UrbanReflex sử dụng hệ thống quản lý trạng thái báo cáo (Report Status Workflow) tự động hóa với AI để tối ưu quy trình duyệt và hiển thị báo cáo của người dân.

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

- **Nghĩa:** Báo cáo vừa được gửi
- **Hiển thị công khai:** ❌ Không
- **Mô tả:** User vừa submit báo cáo, chưa qua xử lý AI

### 2. `ai_processing` 🤖

- **Nghĩa:** AI đang phân tích
- **Hiển thị công khai:** ❌ Không
- **Mô tả:** Backend AI đang classify category, priority, severity

### 3. `auto_approved` ✅

- **Nghĩa:** Tự động duyệt bởi AI
- **Hiển thị công khai:** ✅ Có
- **Mô tả:** Thỏa điều kiện auto-approval, hiển thị ngay trên bản đồ

### 4. `pending_review` ⏳

- **Nghĩa:** Chờ admin duyệt
- **Hiển thị công khai:** ❌ Không
- **Mô tả:** Không thỏa điều kiện auto-approval, cần admin review

### 5. `approved` ✓

- **Nghĩa:** Admin duyệt thủ công
- **Hiển thị công khai:** ✅ Có
- **Mô tả:** Admin đã review và approve, hiển thị trên bản đồ

### 6. `rejected` ✗

- **Nghĩa:** Bị từ chối
- **Hiển thị công khai:** ❌ Không
- **Mô tả:** Báo cáo không hợp lệ, spam, hoặc trùng lặp

### 7. `resolved` 🎉

- **Nghĩa:** Đã giải quyết
- **Hiển thị công khai:** ✅ Có
- **Mô tả:** Vấn đề đã được xử lý xong (vẫn hiển thị để track history)

---

## 🤖 Auto-Approval Logic

### Điều kiện tự động duyệt

Report được **tự động duyệt** (`auto_approved`) nếu thỏa **TẤT CẢ** các điều kiện sau:

#### ✅ 1. AI Confidence >= 70%

```typescript
categoryConfidence >= 0.7;
```

- AI phải tự tin >= 70% về category classification
- Đảm bảo độ chính xác cao

#### ✅ 2. Priority Thấp/Trung Bình

```typescript
priority in ["low", "medium"];
```

- Chỉ auto-approve báo cáo không khẩn cấp
- `high` và `urgent` cần admin review

#### ✅ 3. Severity Thấp/Trung Bình

```typescript
severity in ["low", "medium"];
```

- Vấn đề không nghiêm trọng
- Severity cao cần đánh giá kỹ

#### ✅ 4. Có Ảnh Minh Chứng

```typescript
verified === true || imageUrl.length > 0;
```

- Phải có ảnh chứng minh
- Tăng độ tin cậy

### Ví dụ

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

Kiểm tra report có thỏa điều kiện auto-approve không

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

Lấy status sau khi AI xử lý xong

```typescript
import { getStatusAfterAI } from "@/lib/utils/reportStatus";

const nextStatus = getStatusAfterAI(reportData);
// → 'auto_approved' hoặc 'pending_review'
```

#### `isPubliclyVisible(status)`

Kiểm tra status có hiển thị công khai không

```typescript
import { isPubliclyVisible } from "@/lib/utils/reportStatus";

isPubliclyVisible("auto_approved"); // → true
isPubliclyVisible("pending_review"); // → false
```

#### `formatStatus(status)`

Format status thành chuỗi hiển thị

```typescript
import { formatStatus } from "@/lib/utils/reportStatus";

formatStatus("auto_approved"); // → "✅ Tự động duyệt"
formatStatus("pending_review"); // → "⏳ Chờ duyệt"
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

### Tính toán Auto-Approval Rate

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

- **Public Visibility:** Chỉ reports có `isPublic: true` mới hiển thị trên bản đồ công khai
- **AI Processing:** Backend AI endpoint phải update status từ `submitted` → `ai_processing` → `auto_approved/pending_review`
- **Admin Override:** Admin có thể manually override bất kỳ status nào
- **Audit Trail:** Mọi status change nên log vào `dateModified` field

---

## 🚀 Future Improvements

1. **Machine Learning:** Học từ admin decisions để cải thiện auto-approval logic
2. **Priority Scoring:** Tự động tính priority score dựa trên multiple factors
3. **Duplicate Detection:** AI detect báo cáo trùng lặp
4. **Auto-Resolution:** Tự động resolve sau khi fix xong (integration với công việc thực tế)

---

**Author:** Trương Dương Bảo Minh (minhe51805)  
**Last Updated:** 2025-12-04  
**Version:** 1.0.0
