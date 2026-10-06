// ==========================================
// THÀNH PHẦN MINH HỌA KIẾN TRÚC VÀ KỸ THUẬT ÁP DỤNG
// Giúp sinh viên và giảng viên dễ dàng tra cứu cách hiện thực Buổi 1, 2, 3
// ==========================================

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, CheckCircle } from 'lucide-react';

export const ArchitectureShowcase: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="architecture-panel">
      <button
        type="button"
        className="architecture-toggle-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="architecture-toggle-title">
          <Code2 size={20} className="arch-icon" />
          <span>Kiến trúc & Kỹ thuật đã áp dụng (Buổi 1, 2, 3)</span>
          <span className="arch-badge">Đầy đủ 100% yêu cầu</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="architecture-content">
          <div className="arch-grid">
            {/* Buổi 1 */}
            <div className="arch-card">
              <div className="arch-card-header">
                <span className="lesson-tag tag-b1">Buổi 1</span>
                <h4>TypeScript Nâng Cao</h4>
              </div>
              <ul className="arch-list">
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>Generic:</strong> <code>ApiResponse&lt;T&gt;</code>, <code>filterCollection&lt;T&gt;</code>, <code>sortByProperty&lt;T, K extends keyof T&gt;</code>, <code>searchByFields&lt;T&gt;</code>.
                </li>
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>Utility Types:</strong> <code>Omit&lt;Assignment, 'id' | 'createdAt' | 'completed'&gt;</code> (Tạo bài mới), <code>Pick&lt;Assignment, 'id'&gt;</code>, <code>Record&lt;Priority, PriorityMeta&gt;</code>, <code>Readonly</code>.
                </li>
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>Type Guard:</strong> <code>isAssignment(val)</code>, <code>isPriority(val)</code>, <code>isFilterStatus(val)</code>, <code>isAssignmentOverdue()</code>.
                </li>
              </ul>
            </div>

            {/* Buổi 2 */}
            <div className="arch-card">
              <div className="arch-card-header">
                <span className="lesson-tag tag-b2">Buổi 2</span>
                <h4>React Design Patterns</h4>
              </div>
              <ul className="arch-list">
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>Custom Hook nâng cao:</strong> <code>useDeadlineCalculator</code> (tự động tính đếm ngược và trạng thái hạn nộp), <code>useAssignmentFilter</code> (lọc, tìm kiếm, tính toán thống kê).
                </li>
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>Compound Component:</strong> <code>&lt;AssignmentCard&gt;</code> (Header, SubjectBadge, PriorityBadge, Body, Title, DueInfo, Actions, ToggleButton, DeleteButton) chia sẻ state qua Context.
                </li>
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>HOC Pattern:</strong> <code>withLoading</code> bọc quanh danh sách bài tập để hiển thị skeleton animation khi đang tải.
                </li>
              </ul>
            </div>

            {/* Buổi 3 */}
            <div className="arch-card">
              <div className="arch-card-header">
                <span className="lesson-tag tag-b3">Buổi 3</span>
                <h4>Redux Toolkit + TypeScript</h4>
              </div>
              <ul className="arch-list">
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>Feature-based Structure:</strong> Phân chia thư mục rõ ràng theo tính năng <code>src/features/assignments/</code> kết hợp cùng <code>src/app/</code>.
                </li>
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>Typed Hooks:</strong> <code>useAppDispatch</code> và <code>useAppSelector</code> chuẩn hóa với <code>useDispatch.withTypes&lt;AppDispatch&gt;()</code>.
                </li>
                <li>
                  <CheckCircle size={14} className="list-check" />
                  <strong>createAsyncThunk:</strong> <code>fetchAssignments</code>, <code>addAssignment</code>, <code>toggleAssignment</code>, <code>deleteAssignment</code>, <code>resetToMockData</code> xử lý bất đồng bộ từ Mock API có network latency.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
