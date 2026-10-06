// ==========================================
// DANH SÁCH BÀI TẬP (SỬ DỤNG COMPOUND COMPONENT & HOC)
// Yêu cầu chức năng 1, 3, 4, 6
// ==========================================

import React from 'react';
import type { Assignment } from '../../../types/assignment';
import { AssignmentCard } from './AssignmentCard/AssignmentCard';
import { withLoading, type WithLoadingProps } from '../../../common/components/HOC/withLoading';
import { Inbox } from 'lucide-react';

interface AssignmentListProps extends WithLoadingProps {
  assignments: Assignment[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal?: () => void;
}

const AssignmentListBase: React.FC<AssignmentListProps> = ({
  assignments,
  onToggle,
  onDelete,
  onOpenCreateModal,
}) => {
  // Trạng thái trống (Empty State)
  if (assignments.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">
          <Inbox size={48} />
        </div>
        <h3 className="empty-state-title">Không tìm thấy bài tập nào</h3>
        <p className="empty-state-desc">
          Bạn chưa có bài tập nào phù hợp với bộ lọc hiện tại hoặc tất cả đã được hoàn thành.
        </p>
        {onOpenCreateModal && (
          <button
            type="button"
            className="btn-empty-action"
            onClick={onOpenCreateModal}
          >
            + Thêm bài tập ngay
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="assignments-grid">
      {assignments.map((assignment) => (
        // Sử dụng trọn vẹn Compound Component Pattern (Buổi 2)
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onToggle={onToggle}
          onDelete={onDelete}
        >
          {/* Header chứa môn học và độ ưu tiên */}
          <AssignmentCard.Header>
            <AssignmentCard.SubjectBadge />
            <AssignmentCard.PriorityBadge />
          </AssignmentCard.Header>

          {/* Body chứa tiêu đề, mô tả và hạn nộp (còn X ngày / quá hạn Y ngày) */}
          <AssignmentCard.Body>
            <AssignmentCard.Title />
            <AssignmentCard.Description />
            <AssignmentCard.DueInfo />
          </AssignmentCard.Body>

          {/* Actions chứa nút Đánh dấu hoàn thành / Bỏ đánh dấu và nút Xoá */}
          <AssignmentCard.Actions>
            <AssignmentCard.ToggleButton />
            <AssignmentCard.DeleteButton />
          </AssignmentCard.Actions>
        </AssignmentCard>
      ))}
    </div>
  );
};

// Áp dụng Higher-Order Component withLoading (Buổi 2)
export const AssignmentList = withLoading(AssignmentListBase);
