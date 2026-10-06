// ==========================================
// BUỔI 1: TYPESCRIPT NÂNG CAO - TYPE DEFINITIONS
// ==========================================

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type FilterStatus = 'all' | 'pending' | 'overdue' | 'completed';

export type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'titleAsc';

/**
 * Interface chính đại diện cho một bài tập sinh viên
 */
export interface Assignment {
  readonly id: string;
  subject: string;
  title: string;
  dueDate: string; // Định dạng YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  createdAt: string;
  description?: string;
}

// ----------------------------------------------------
// UTILITY TYPES DEMONSTRATION (BUỔI 1)
// ----------------------------------------------------

/**
 * 1. Omit: Loại bỏ 'id', 'createdAt', 'completed' khi tạo bài tập mới
 * (các trường này do hệ thống tự sinh tự động)
 */
export type CreateAssignmentInput = Omit<Assignment, 'id' | 'createdAt' | 'completed'>;

/**
 * 2. Pick: Trích xuất chỉ các trường cần thiết cho thao tác toggle trạng thái
 */
export type ToggleAssignmentPayload = Pick<Assignment, 'id'> & {
  completed?: boolean;
};

/**
 * 3. Partial kết hợp Pick: Dùng cho cập nhật thông tin bài tập (id là bắt buộc, các trường khác tuỳ chọn)
 */
export type UpdateAssignmentInput = Partial<Omit<Assignment, 'id'>> & Pick<Assignment, 'id'>;

/**
 * 4. Record: Cấu hình màu sắc, nhãn hiển thị cho từng mức độ ưu tiên
 */
export interface PriorityMeta {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  weight: number;
}

export type PriorityConfigMap = Record<Priority, PriorityMeta>;

/**
 * 5. Readonly: Đảm bảo dữ liệu không bị đột biến trực tiếp (Immutability)
 */
export type ReadonlyAssignment = Readonly<Assignment>;

/**
 * Thống kê tổng hợp số lượng bài tập theo trạng thái
 */
export interface AssignmentStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}
