// ==========================================
// BUỔI 1: TYPE GUARDS (USER-DEFINED TYPE GUARDS)
// Giúp TypeScript thu hẹp kiểu (Type Narrowing) an toàn tại runtime
// ==========================================

import type { Assignment, FilterStatus, Priority } from '../../types/assignment';

/**
 * Type Guard kiểm tra một giá trị bất kỳ có phải là Priority hợp lệ không
 */
export function isPriority(value: unknown): value is Priority {
  return (
    typeof value === 'string' &&
    ['low', 'medium', 'high', 'urgent'].includes(value)
  );
}

/**
 * Type Guard kiểm tra giá trị có phải là FilterStatus hợp lệ
 */
export function isFilterStatus(value: unknown): value is FilterStatus {
  return (
    typeof value === 'string' &&
    ['all', 'pending', 'overdue', 'completed'].includes(value)
  );
}

/**
 * Type Guard kiểm tra xem một object nhận từ API giả lập có đầy đủ cấu trúc của Assignment hay không
 */
export function isAssignment(value: unknown): value is Assignment {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.subject === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.dueDate === 'string' &&
    isPriority(candidate.priority) &&
    typeof candidate.completed === 'boolean'
  );
}

/**
 * Type Guard kiểm tra mảng bài tập trả về từ API
 */
export function isAssignmentArray(value: unknown): value is Assignment[] {
  return Array.isArray(value) && value.every(isAssignment);
}

/**
 * Type Guard tiện ích kiểm tra xem bài tập có bị Quá Hạn hay không
 * (Quá hạn = Chưa hoàn thành VÀ ngày hết hạn nhỏ hơn ngày hôm nay)
 */
export function isAssignmentOverdue(assignment: Assignment, referenceDate: Date = new Date()): boolean {
  if (assignment.completed) return false;
  
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const [year, month, day] = assignment.dueDate.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  
  return due.getTime() < today.getTime();
}

/**
 * Kiểm tra bài tập có phải hạn nộp hôm nay không
 */
export function isAssignmentDueToday(assignment: Assignment, referenceDate: Date = new Date()): boolean {
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const [year, month, day] = assignment.dueDate.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  
  return due.getTime() === today.getTime();
}
