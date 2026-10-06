// ==========================================
// BUỔI 2: REACT DESIGN PATTERN - HIGHER-ORDER COMPONENT (HOC)
// withLoading: Bọc một Component bất kỳ để tự động hiển thị trạng thái đang tải (Loading/Skeleton)
// ==========================================

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface WithLoadingProps {
  isLoading?: boolean;
  loadingMessage?: string;
}

/**
 * Higher-Order Component nhận vào một Component và trả về một Component mới có xử lý trạng thái Loading
 * @param WrappedComponent Component gốc cần bọc
 * @param defaultMessage Thông báo mặc định khi đang tải
 */
export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultMessage: string = 'Đang tải danh sách bài tập từ máy chủ...'
) {
  // Trả về component mới được tăng cường (Enhanced Component)
  const ComponentWithLoading: React.FC<P & WithLoadingProps> = ({
    isLoading = false,
    loadingMessage = defaultMessage,
    ...restProps
  }) => {
    if (isLoading) {
      return (
        <div className="hoc-loading-container" role="status" aria-live="polite">
          <div className="hoc-loading-card">
            <Loader2 className="hoc-loading-spinner" size={36} />
            <p className="hoc-loading-text">{loadingMessage}</p>
            <div className="hoc-skeleton-grid">
              <div className="hoc-skeleton-item shimmer" />
              <div className="hoc-skeleton-item shimmer" />
              <div className="hoc-skeleton-item shimmer" />
            </div>
          </div>
        </div>
      );
    }

    // Khi không loading, render Component gốc với đầy đủ props ban đầu
    return <WrappedComponent {...(restProps as P)} />;
  };

  ComponentWithLoading.displayName = `WithLoading(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ComponentWithLoading;
}
