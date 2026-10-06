// ==========================================
// FORM THÊM BÀI TẬP MỚI (COMPOUND MODAL)
// Yêu cầu chức năng 2: Thêm bài tập mới qua form (môn học, tên bài tập, hạn nộp, độ ưu tiên)
// Sử dụng Compound Component <Modal> (Buổi 2) và CreateAssignmentInput (Buổi 1)
// ==========================================

import React, { useState } from 'react';
import type { CreateAssignmentInput, Priority } from '../../../types/assignment';
import { Modal } from '../../../common/components/Modal/Modal';
import { COMMON_SUBJECTS, PRIORITY_CONFIG } from '../../../common/constants/priorityConfig';
import { getDateOffsetString } from '../../../common/utils/dateUtils';
import { PlusCircle, Calendar, BookOpen, FileText, AlertCircle, Sparkles } from 'lucide-react';

interface AssignmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentInput) => void;
  isSubmitting?: boolean;
}

export const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(getDateOffsetString(1)); // Mặc định là ngày mai
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset form khi đóng
  const handleClose = () => {
    setValidationError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      setValidationError('Vui lòng nhập hoặc chọn tên môn học');
      return;
    }

    if (!title.trim()) {
      setValidationError('Vui lòng nhập tên bài tập');
      return;
    }

    if (!dueDate) {
      setValidationError('Vui lòng chọn hạn nộp');
      return;
    }

    setValidationError(null);

    // Gửi payload hợp lệ tuân thủ CreateAssignmentInput (Omit<Assignment, 'id' | 'createdAt' | 'completed'>)
    onSubmit({
      subject: subject.trim(),
      title: title.trim(),
      dueDate,
      priority,
      description: description.trim() || undefined,
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setDueDate(getDateOffsetString(1));
    setPriority('medium');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="580px">
      <Modal.Header>
        <div className="form-modal-header-content">
          <div className="form-modal-icon">
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 className="modal-title-text">Thêm bài tập mới</h2>
            <p className="modal-subtitle-text">Ghi chú lại deadline để không bỏ lỡ bài nộp</p>
          </div>
        </div>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body className="form-modal-body">
          {validationError && (
            <div className="form-error-alert" role="alert">
              <AlertCircle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Môn học */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-subject">
              <BookOpen size={16} className="label-icon" />
              <span>Môn học <span className="required-star">*</span></span>
            </label>
            <input
              id="form-subject"
              type="text"
              className="form-control"
              placeholder="VD: Lập trình Web, Cấu trúc dữ liệu..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            {/* Gợi ý chọn nhanh môn học */}
            <div className="quick-suggestions-row">
              <span className="quick-label">
                <Sparkles size={12} /> Gợi ý nhanh:
              </span>
              <div className="suggestion-chips">
                {COMMON_SUBJECTS.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`suggestion-chip ${subject === s ? 'chip-selected' : ''}`}
                    onClick={() => setSubject(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Tên bài tập */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-title">
              <FileText size={16} className="label-icon" />
              <span>Tên bài tập <span className="required-star">*</span></span>
            </label>
            <input
              id="form-title"
              type="text"
              className="form-control"
              placeholder="VD: Làm bài tập lớn phân tích thiết kế hệ thống..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 3. Hạn nộp & Độ ưu tiên (2 cột) */}
          <div className="form-row-two-cols">
            {/* Hạn nộp */}
            <div className="form-group">
              <label className="form-label" htmlFor="form-due-date">
                <Calendar size={16} className="label-icon" />
                <span>Hạn nộp <span className="required-star">*</span></span>
              </label>
              <input
                id="form-due-date"
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {/* Độ ưu tiên */}
            <div className="form-group">
              <label className="form-label">
                <span>Độ ưu tiên <span className="required-star">*</span></span>
              </label>
              <div className="priority-selector-grid">
                {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => {
                  const config = PRIORITY_CONFIG[p];
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`priority-select-btn ${isSelected ? 'selected' : ''}`}
                      style={{
                        borderColor: isSelected ? config.color : undefined,
                        backgroundColor: isSelected ? config.bgColor : undefined,
                        color: isSelected ? config.color : undefined,
                      }}
                      onClick={() => setPriority(p)}
                    >
                      <span
                        className="priority-indicator-dot"
                        style={{ backgroundColor: config.color }}
                      />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Ghi chú thêm (Tuỳ chọn) */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-desc">
              <span>Ghi chú thêm (không bắt buộc)</span>
            </label>
            <textarea
              id="form-desc"
              className="form-control form-textarea"
              rows={3}
              placeholder="Ghi chú yêu cầu cụ thể, đường link nộp bài LMS, tên nhóm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Huỷ bỏ
          </button>
          <button
            type="submit"
            className="btn-modal-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Thêm bài tập'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
