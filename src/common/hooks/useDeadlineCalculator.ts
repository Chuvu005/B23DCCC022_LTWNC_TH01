// ==========================================
// BUỔI 2: CUSTOM HOOK NÂNG CAO - useDeadlineCalculator
// Quản lý việc tính toán thời hạn, đếm ngược và cập nhật tự động
// ==========================================

import { useMemo } from 'react';
import { calculateDeadlineInfo, type DeadlineInfo } from '../utils/dateUtils';

interface UseDeadlineCalculatorReturn extends DeadlineInfo {
  isOverdue: boolean;
  isUrgent: boolean;
}

/**
 * Custom hook tính toán thời gian hạn nộp của bài tập
 * Tự động tính toán lại khi dueDate hoặc completed thay đổi
 */
export function useDeadlineCalculator(
  dueDate: string,
  isCompleted: boolean
): UseDeadlineCalculatorReturn {
  const deadlineInfo = useMemo(() => {
    return calculateDeadlineInfo(dueDate, isCompleted);
  }, [dueDate, isCompleted]);

  const isOverdue = deadlineInfo.statusType === 'overdue';
  const isUrgent = deadlineInfo.statusType === 'due-today' || isOverdue;

  return {
    ...deadlineInfo,
    isOverdue,
    isUrgent,
  };
}
