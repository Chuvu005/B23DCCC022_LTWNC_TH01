// ==========================================
// CẤU HÌNH ĐỘ ƯU TIÊN (RECORD UTILITY TYPE)
// ==========================================

import type { PriorityConfigMap } from '../../types/assignment';

export const PRIORITY_CONFIG: PriorityConfigMap = {
  urgent: {
    label: 'Khẩn cấp',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    badgeClass: 'priority-urgent',
    weight: 4,
  },
  high: {
    label: 'Cao',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    badgeClass: 'priority-high',
    weight: 3,
  },
  medium: {
    label: 'Trung bình',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    badgeClass: 'priority-medium',
    weight: 2,
  },
  low: {
    label: 'Thấp',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    badgeClass: 'priority-low',
    weight: 1,
  },
};

export const COMMON_SUBJECTS = [
  'Lập trình Web',
  'Cấu trúc dữ liệu & Giải thuật',
  'Cơ sở dữ liệu',
  'Trí tuệ nhân tạo (AI)',
  'Mạng máy tính',
  'Kiến trúc phần mềm',
  'Thiết kế giao diện UI/UX',
  'Phát triển ứng dụng di động',
];
