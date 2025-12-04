# Contexts Directory

## Tổng quan

Folder `contexts/` chứa các React Context providers để quản lý global state trong ứng dụng UrbanReflex. Hiện tại chủ yếu tập trung vào authentication state.

## Cấu trúc

```
contexts/
└── AuthContext.tsx      # Authentication context provider
```

## Flow chính

### Authentication Flow

```
App Start
  ↓
AuthProvider mounts
  ↓
useEffect checks localStorage for 'auth_token'
  ↓
If token exists:
  ├── Fetch /auth/me → Get user info
  ├── Set user state
  └── Check admin status → Set isAdmin flag
  ↓
If no token:
  └── Set user = null
```

### Login Flow

```
User submits login form
  ↓
AuthContext.login(identifier, password)
  ↓
Try multiple request formats:
  1. { identifier, password } (JSON)
  2. { email, password } (fallback)
  3. { username, password } (fallback)
  ...
  ↓
Backend responds with token + user data
  ↓
Extract token & user info
  ↓
Check admin status from multiple fields:
  - is_admin
  - isAdmin
  - role === 'admin'
  - user_type === 'admin'
  - is_superuser
  ↓
If admin:
  └── window.location.href = '/admin' (immediate redirect)
  ↓
If regular user:
  └── router.push('/')
```

### Logout Flow

```
User clicks logout
  ↓
AuthContext.logout()
  ↓
Clear user state
Clear localStorage token
  ↓
Redirect to /login
```

## AuthContext API

### Context Value

```typescript
{
  user: User | null              // Current user object
  loading: boolean               // Loading state
  login: (id: string, pwd: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAdmin: boolean               // Computed from user.is_admin
  isAuthenticated: boolean       // Computed from !!user
}
```

### User Interface

```typescript
interface User {
  id: string
  email: string
  username: string
  full_name: string
  phone: string
  is_admin: boolean
}
```

### Usage Example

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAdmin, login, logout } = useAuth()
  
  if (!user) {
    return <LoginForm onSubmit={login} />
  }
  
  return (
    <div>
      <p>Welcome, {user.full_name}</p>
      {isAdmin && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Features

### 1. Multiple Login Format Support
- Backend có thể yêu cầu `identifier`, `email`, hoặc `username`
- AuthContext tự động thử nhiều format để tương thích

### 2. Admin Detection
- Kiểm tra nhiều fields để xác định admin:
  - `is_admin`, `isAdmin`
  - `role === 'admin'`
  - `user_type === 'admin'`
  - `is_superuser`, `superuser`

### 3. Auto Redirect
- Admin → `/admin` (immediate redirect với `window.location.href`)
- Regular user → `/` (client-side navigation)

### 4. Token Management
- Lưu token vào `localStorage` với key `auth_token`
- Tự động gửi token trong `Authorization: Bearer <token>` header
- Clear token khi logout hoặc token invalid

### 5. Error Handling
- Detailed error logging cho debugging
- User-friendly error messages
- Network error handling (connection refused, etc.)

## Best Practices

1. **Always use `useAuth()` hook**: Không import `AuthContext` trực tiếp
2. **Check loading state**: Hiển thị loading UI khi `loading === true`
3. **Handle null user**: Luôn check `user` trước khi access properties
4. **Admin checks**: Sử dụng `isAdmin` flag thay vì check `user.is_admin` trực tiếp
5. **Error boundaries**: Wrap components với error boundaries để catch auth errors

## Future Enhancements

- Refresh token mechanism
- Session timeout handling
- Multi-role support (admin, moderator, user)
- OAuth integration (Google, Facebook, etc.)
- Remember me functionality

