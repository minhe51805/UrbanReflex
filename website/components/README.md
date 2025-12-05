# Components Directory

## Tổng quan

Folder `components/` chứa tất cả các React components được tái sử dụng trong ứng dụng UrbanReflex. Components được tổ chức theo feature/module để dễ quản lý.

## Cấu trúc

```
components/
├── explore/              # Components cho trang explore
│   ├── EnhancedRoadMapView.tsx    # Map component chính
│   ├── RoadDetailModal.tsx        # Modal chi tiết đường phố
│   ├── ReportsListSidebar.tsx     # Sidebar danh sách báo cáo
│   └── FloatingReportButton.tsx   # Nút báo cáo nổi
├── admin/                # Components cho admin dashboard
├── auth/                 # Components cho authentication
├── ui/                   # UI components tái sử dụng (buttons, inputs, etc.)
├── layout/               # Layout components (Header, Footer)
├── home/                 # Components cho homepage
├── Header.tsx            # Header component
├── Footer.tsx            # Footer component
└── [các components khác]
```

## Flow chính

### 1. Explore Components Flow
```
EnhancedRoadMapView (Map)
  ├── Render road segments (GeoJSON)
  ├── Render road nodes (clustered points)
  ├── Handle click events → onRoadClick()
  └── Display popups & markers

RoadDetailModal (Modal)
  ├── Fetch road details từ /api/roads/[id]
  ├── Display: Weather, AQI, Reports, POIs
  └── Allow user actions (report, share)

ReportsListSidebar (Sidebar)
  ├── Fetch reports từ /api/reports?lat=&lon=
  ├── Filter by status (pending/in_progress/resolved)
  └── Display report cards với images

FloatingReportButton (Button)
  ├── Check authentication
  ├── Open modal form
  └── Submit report → /api/ngsi-ld?type=RoadReport
```

### 2. Admin Components Flow
```
AdminPage Components
  ├── Reports Tab → Filter, Search, Update status
  ├── Users Tab → CRUD operations
  └── Overview Tab → Statistics cards
```

## Components quan trọng

### `explore/EnhancedRoadMapView.tsx`
- **Chức năng**: Render interactive map với MapLibre GL JS
- **Features**:
  - Road segments visualization
  - Clustered road nodes (donut shape với white border)
  - Highlight markers cho selected roads
  - Popups với close button
- **Props**:
  - `roadSegments: RoadSegment[]` - Danh sách đoạn đường
  - `onRoadClick?: (road: RoadSegment) => void` - Callback khi click
  - `highlightLocation?: [number, number]` - Vị trí highlight
  - `highlightLabel?: string` - Label cho highlight

### `explore/RoadDetailModal.tsx`
- **Chức năng**: Hiển thị chi tiết đầy đủ về một đoạn đường
- **Data hiển thị**:
  - Weather information
  - Air Quality Index (AQI) stations
  - Citizen Reports (RoadReport + CitizenReport)
  - Points of Interest (POIs)
  - Road metadata
- **API**: `GET /api/roads/[id]`

### `explore/ReportsListSidebar.tsx`
- **Chức năng**: Sidebar hiển thị danh sách báo cáo trong khu vực
- **Features**:
  - Spatial query (lat, lon, radius)
  - Filter by status/priority
  - Image gallery
  - Report detail modal
- **API**: `GET /api/reports?lat=&lon=&maxDistance=`

### `explore/FloatingReportButton.tsx`
- **Chức năng**: Nút báo cáo nổi ở giữa bottom màn hình
- **Flow**:
  1. Check authentication → Redirect to `/login` nếu chưa login
  2. Check selected road → Show error nếu chưa chọn đường
  3. Open modal form
  4. Submit → `POST /api/ngsi-ld?type=RoadReport`

## UI Components (`components/ui/`)

Các components tái sử dụng như:
- Buttons
- Inputs
- Modals
- Cards
- Loading spinners
- etc.

## Best Practices

1. **Component Organization**: 
   - Nhóm theo feature/module
   - Tách logic và UI khi cần
   - Sử dụng TypeScript interfaces cho props

2. **Performance**:
   - Sử dụng `memo()` cho components nặng
   - `useMemo()` và `useCallback()` cho expensive computations
   - Virtualization cho long lists (VirtualizedRoadList)

3. **State Management**:
   - Local state với `useState` cho UI state
   - Context API cho global state (AuthContext)
   - Props drilling khi cần thiết

4. **Styling**:
   - Tailwind CSS utility classes
   - Responsive design với breakpoints
   - Consistent color scheme và spacing

5. **Error Handling**:
   - Try-catch trong async functions
   - Error boundaries cho component trees
   - User-friendly error messages

