# Lib Directory - Utilities & Helpers

## Tổng quan

Folder `lib/` chứa các utility functions, helpers, và shared logic được sử dụng xuyên suốt ứng dụng UrbanReflex. Code trong đây được tái sử dụng và không phụ thuộc vào React components.

## Cấu trúc

```
lib/
├── api/              # API client functions
└── utils/            # Utility functions
```

## Flow chính

### API Client (`lib/api/`)
- Wrapper functions cho API calls
- Centralized error handling
- Request/response transformation
- Token management

### Utilities (`lib/utils/`)
- Helper functions cho common operations
- Data transformation utilities
- Formatting functions (dates, numbers, etc.)
- Validation helpers

## Best Practices

1. **Pure Functions**: Functions không có side effects
2. **TypeScript**: Strong typing cho tất cả functions
3. **Documentation**: JSDoc comments cho public functions
4. **Testing**: Unit tests cho utility functions
5. **Reusability**: Tách logic có thể tái sử dụng vào đây

## Usage

Import utilities khi cần:
```typescript
import { someUtility } from '@/lib/utils/helpers'
import { apiClient } from '@/lib/api/client'
```

