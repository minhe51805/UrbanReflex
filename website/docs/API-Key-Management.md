# API Key Management - Chi tiết chức năng

## 📋 Tổng quan

Trang quản lý API Keys cho phép người dùng tạo, xem, và quản lý các API keys để truy cập UrbanReflex API.

**URL**: `/api-keys`  
**File**: `app/api-keys/page.tsx`

---

## 🎯 Các chức năng chính

### 1. Tạo API Key mới

#### Mô tả
Người dùng có thể tạo API key mới với tên tùy chỉnh để dễ dàng quản lý và phân biệt.

#### Cách sử dụng
1. Click nút **"+ Create New Key"**
2. Nhập tên cho API key (ví dụ: "Production App", "Development", "Mobile App")
3. Click **"Create Key"**
4. API key mới sẽ được hiển thị trong alert màu xanh
5. **Copy ngay** vì bạn sẽ không thể xem lại full key sau này

#### Technical Details
```typescript
const generateAPIKey = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  const randomStr2 = Math.random().toString(36).substring(2, 15);
  return `urx_${timestamp}_${randomStr}${randomStr2}`;
};
```

**Format**: `urx_[timestamp]_[random_string]`
- `urx_` - Prefix để identify UrbanReflex keys
- `[timestamp]` - Base36 timestamp để đảm bảo unique
- `[random_string]` - Random alphanumeric string để security

#### Data Structure
```typescript
interface APIKey {
  id: string;              // Unique ID (timestamp)
  name: string;            // User-defined name
  key: string;             // Generated API key
  createdAt: string;       // ISO 8601 timestamp
  lastUsed: string | null; // ISO 8601 timestamp or null
  requestCount: number;    // Number of API requests
  isActive: boolean;       // Active status
}
```

---

### 2. Xem danh sách API Keys

#### Mô tả
Hiển thị tất cả API keys đã tạo với thông tin chi tiết và trạng thái.

#### Thông tin hiển thị
- **Name**: Tên do người dùng đặt
- **Status**: Active/Inactive badge
- **API Key**: Masked hoặc full (tùy toggle)
- **Created**: Ngày tạo
- **Last Used**: Lần sử dụng cuối (hoặc "Never")
- **Requests**: Tổng số requests đã thực hiện

#### UI Components
```tsx
<div className="bg-white rounded-xl p-6 shadow-soft">
  <div className="flex items-center gap-3">
    <h3>Production App</h3>
    <span className="badge-active">Active</span>
  </div>
  
  <div className="api-key-display">
    <code>{masked ? maskKey(key) : key}</code>
    <button onClick={toggleVisibility}>[object Object]<button onClick={copyToClipboard}>📋</button>
  </div>
  
  <div className="stats-grid">
    <div>Created: Nov 18, 2025</div>
    <div>Last Used: Never</div>
    <div>Requests: 0</div>
  </div>
</div>
```

---

### 3. Ẩn/Hiện API Key

#### Mô tả
Toggle visibility của API key để bảo vệ khỏi shoulder surfing.

#### Cách hoạt động
- **Hidden**: `urx_lq8k9j_********************`
- **Visible**: `urx_lq8k9j_abc123def456ghi789`

#### Implementation
```typescript
const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

const toggleKeyVisibility = (id: string) => {
  const newVisible = new Set(visibleKeys);
  if (newVisible.has(id)) {
    newVisible.delete(id);
  } else {
    newVisible.add(id);
  }
  setVisibleKeys(newVisible);
};

const maskKey = (key: string) => {
  const parts = key.split('_');
  if (parts.length >= 3) {
    return `${parts[0]}_${parts[1]}_${'*'.repeat(20)}`;
  }
  return '*'.repeat(key.length);
};
```

#### UI States
- **Eye Icon** (👁️): Click để show key
- **Eye Off Icon** (🚫👁️): Click để hide key
- Hover effect để indicate clickable

---

### 4. Copy API Key

#### Mô tả
Copy API key vào clipboard với visual feedback.

#### Features
- Click icon 📋 để copy
- Visual feedback: Icon đổi thành ✅ trong 2 giây
- Toast notification (optional)
- Works với cả masked và visible keys

#### Implementation
```typescript
const [copiedKey, setCopiedKey] = useState<string | null>(null);

const copyToClipboard = (key: string, id: string) => {
  navigator.clipboard.writeText(key);
  setCopiedKey(id);
  setTimeout(() => setCopiedKey(null), 2000);
};
```

#### UI Feedback
```tsx
<button onClick={() => copyToClipboard(apiKey.key, apiKey.id)}>
  {copiedKey === apiKey.id ? (
    <CheckCircle className="text-green-600" />
  ) : (
    <Copy className="text-gray-600" />
  )}
</button>
```

---

### 5. Xóa API Key

#### Mô tả
Xóa API key với confirmation để tránh xóa nhầm.

#### Flow
1. Click icon 🗑️ (Trash)
2. Confirmation dialog xuất hiện
3. Confirm → Key bị xóa khỏi localStorage
4. Cancel → Không làm gì

#### Implementation
```typescript
const deleteKey = (id: string) => {
  if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    // Also remove from localStorage
    const updated = apiKeys.filter(key => key.id !== id);
    localStorage.setItem('urbanreflex_api_keys', JSON.stringify(updated));
  }
};
```

#### Security Note
⚠️ **Warning**: Xóa API key sẽ làm tất cả applications đang sử dụng key đó bị lỗi authentication.

---

### 6. Newly Created Key Alert

#### Mô tả
Hiển thị alert đặc biệt khi vừa tạo key mới, nhắc nhở user copy ngay.

#### Features
- Background màu xanh lá (success)
- Border highlight
- Full API key visible
- Copy button
- Auto-hide sau 30 giây

#### Implementation
```typescript
const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

const createNewKey = async () => {
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
  
  // Auto-hide after 30 seconds
  setTimeout(() => {
    setNewlyCreatedKey(null);
  }, 30000);
};
```

#### UI Design
```tsx
{newlyCreatedKey && (
  <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
    <CheckCircle className="text-green-600" />
    <h3>API Key Created Successfully!</h3>
    <p>Make sure to copy your API key now. You won't be able to see it again!</p>
    <code className="text-green-600">{newlyCreatedKey}</code>
    <button onClick={copy}>Copy</button>
  </div>
)}
```

---

### 7. Empty State

#### Mô tả
Hiển thị khi chưa có API key nào được tạo.

#### Features
- Icon lớn (Key icon)
- Heading: "No API Keys Yet"
- Description text
- Call-to-action button

#### UI Design
```tsx
{apiKeys.length === 0 ? (
  <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed">
    <Key className="h-16 w-16 mx-auto text-gray-400" />
    <h3>No API Keys Yet</h3>
    <p>Create your first API key to start using the UrbanReflex API</p>
    <button onClick={openModal}>Create API Key</button>
  </div>
) : (
  // Show keys list
)}
```

---

### 8. API Base URL Display

#### Mô tả
Hiển thị base URL của API để user biết endpoint gốc.

#### Features
- Dynamic URL (lấy từ `window.location.origin`)
- Copy button
- Hướng dẫn cách sử dụng header

#### Implementation
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
  <h3>API Base URL</h3>
  <div className="bg-gray-50 rounded-lg p-4">
    <code>{window.location.origin}/api/v1</code>
    <button onClick={copyBaseUrl}>Copy</button>
  </div>
  <p>Include your API key in the request header:</p>
  <code>X-API-Key: your_api_key</code>
</div>
```

---

## 💾 Data Storage

### LocalStorage
```typescript
// Key
'urbanreflex_api_keys'

// Value (JSON array)
[
  {
    "id": "1731934783345",
    "name": "Production App",
    "key": "urx_lq8k9j_abc123def456",
    "createdAt": "2025-11-18T11:39:43.345Z",
    "lastUsed": null,
    "requestCount": 0,
    "isActive": true
  }
]
```

### Load on Mount
```typescript
useEffect(() => {
  const stored = localStorage.getItem('urbanreflex_api_keys');
  if (stored) {
    setApiKeys(JSON.parse(stored));
  }
}, []);
```

### Save on Change
```typescript
useEffect(() => {
  if (apiKeys.length > 0) {
    localStorage.setItem('urbanreflex_api_keys', JSON.stringify(apiKeys));
  }
}, [apiKeys]);
```

---

## 🎨 Design System

### Colors
- **Primary**: `#1e64ab` (Brand blue)
- **Text**: `#30363c` (Dark text)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Background**: `#ffffff` (White)

### Shadows
- **Soft**: `shadow-soft`
- **Medium**: `shadow-medium`
- **Large**: `shadow-large`

### Animations
- Framer Motion for page transitions
- Hover effects on buttons
- Smooth state changes

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Stack layout vertically
- Larger touch targets
- Simplified stats display
- Full-width buttons

---

## ♿ Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Readers**: Proper ARIA labels
- **Focus States**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant

---

## 🔒 Security Considerations

1. **Client-side Storage**: Keys stored in localStorage (not secure for production)
2. **Visibility Toggle**: Prevents shoulder surfing
3. **Confirmation Dialogs**: Prevents accidental deletion
4. **Auto-hide Alert**: Encourages immediate copying

### Production Recommendations
- Move to server-side storage (database)
- Hash keys before storing
- Implement key rotation
- Add expiration dates
- Enable 2FA for key management

---

## [object Object] Handling

### Empty Name
```typescript
if (!newKeyName.trim()) {
  alert('Please enter a name for your API key');
  return;
}
```

### Storage Errors
```typescript
try {
  localStorage.setItem('urbanreflex_api_keys', JSON.stringify(apiKeys));
} catch (error) {
  console.error('Failed to save API keys:', error);
  alert('Failed to save API key. Please try again.');
}
```

---

## 🧪 Testing Checklist

- [ ] Create new API key
- [ ] View API keys list
- [ ] Toggle key visibility
- [ ] Copy key to clipboard
- [ ] Delete API key
- [ ] Empty state displays correctly
- [ ] Newly created alert shows and auto-hides
- [ ] Responsive on mobile
- [ ] LocalStorage persistence works
- [ ] Refresh page keeps data

---

## 📚 Related Documentation

- [API Authentication](./API-Authentication.md)
- [API Endpoints](./API-Endpoints.md)
- [Testing Guide](./Testing-Guide.md)

