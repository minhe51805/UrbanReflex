# App Directory - Routing & Pages

## Tổng quan

Folder `app/` chứa tất cả các routes và pages của ứng dụng UrbanReflex, sử dụng Next.js App Router (Next.js 13+). Mỗi folder con đại diện cho một route trong ứng dụng.

## Cấu trúc

```
app/
├── layout.tsx          # Root layout cho toàn bộ ứng dụng
├── page.tsx            # Homepage (/)
├── explore/            # Trang khám phá bản đồ đường phố
├── admin/              # Dashboard quản trị viên
├── login/              # Trang đăng nhập
├── register/           # Trang đăng ký
├── profile/            # Trang profile người dùng
├── api/                # API Routes (xem app/api/README.md)
└── [các routes khác]   # Các trang thông tin khác
```

## Flow chính

### 1. Authentication Flow
```
/login → AuthContext.login() → Redirect:
  - Admin → /admin
  - User → /
```

### 2. Explore Flow (Trang chính)
```
/explore → ExplorePageContent
  ├── Load road segments từ NGSI-LD
  ├── Render map với EnhancedRoadMapView
  ├── User click road → RoadDetailModal hiển thị
  └── User click report button → FloatingReportButton modal
```

### 3. Admin Flow
```
/admin → AdminPage
  ├── Check isAdmin từ AuthContext
  ├── Load reports/users từ API
  ├── Filter & search reports/users
  └── CRUD operations (Edit/Delete users, Update report status)
```

## Các Pages quan trọng

### `/explore` - Trang khám phá
- **File**: `app/explore/page.tsx`
- **Chức năng**: 
  - Hiển thị bản đồ tương tác với các đoạn đường
  - Sidebar với danh sách đường phố
  - Modal chi tiết đường phố
  - Nút báo cáo sự cố
- **Components sử dụng**:
  - `EnhancedRoadMapView` - Map component
  - `RoadDetailModal` - Modal chi tiết
  - `ReportsListSidebar` - Sidebar báo cáo
  - `FloatingReportButton` - Nút báo cáo

### `/admin` - Dashboard quản trị
- **File**: `app/admin/page.tsx`
- **Chức năng**:
  - Quản lý báo cáo (xem, cập nhật trạng thái, ưu tiên)
  - Quản lý người dùng (xem, sửa, xóa, đổi mật khẩu)
  - Thống kê tổng quan
- **API endpoints**:
  - `GET /api/admin/reports` - Lấy danh sách báo cáo
  - `PATCH /api/admin/reports/[id]` - Cập nhật báo cáo
  - `GET /api/admin/users` - Lấy danh sách users
  - `PUT /api/admin/users/[id]` - Cập nhật user
  - `DELETE /api/admin/users/[id]` - Xóa user

### `/login` & `/register`
- **Files**: `app/login/page.tsx`, `app/register/page.tsx`
- **Chức năng**: Xác thực người dùng
- **Flow**: Sử dụng `AuthContext` để login/register

### `/profile`
- **File**: `app/profile/page.tsx`
- **Chức năng**:
  - Xem/chỉnh sửa thông tin cá nhân
  - Quản lý API keys
  - Cài đặt bảo mật

## Lưu ý

- Tất cả pages đều là **Server Components** mặc định, trừ khi có `'use client'`
- Sử dụng `useSearchParams()` để đọc query parameters
- Layout được áp dụng từ `app/layout.tsx` (root) và các nested layouts
- API routes nằm trong `app/api/` (xem `app/api/README.md`)

## Best Practices

1. **Client Components**: Chỉ đánh dấu `'use client'` khi cần:
   - useState, useEffect, event handlers
   - Browser APIs (localStorage, window, etc.)
   - Third-party libraries yêu cầu client-side

2. **Server Components**: Mặc định cho:
   - Fetch data từ API/DB
   - Access server-side resources
   - Giảm bundle size

3. **Loading States**: Sử dụng `loading.tsx` cho loading UI
4. **Error Handling**: Sử dụng `error.tsx` cho error boundaries

