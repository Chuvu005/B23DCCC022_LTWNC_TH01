// ==========================================
// STUDENT DEADLINE TRACKER - MAIN APPLICATION
// Tổng hợp đầy đủ 3 buổi học:
// - Buổi 1: TypeScript nâng cao (Generic, Utility Types, Type Guard)
// - Buổi 2: React Design Patterns (Custom Hook, Compound Component, HOC)
// - Buổi 3: Redux Toolkit (Feature-based, Typed Hooks, createAsyncThunk)
// ==========================================

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchAssignments,
  addAssignment,
  toggleAssignment,
  deleteAssignment,
  resetToMockData,
  setFilter,
  setSearchQuery,
  setSelectedSubject,
  setSortBy,
  clearNotification,
  clearError,
} from './features/assignments/assignmentsSlice';
import type { CreateAssignmentInput } from './types/assignment';
import { useAssignmentFilter } from './common/hooks/useAssignmentFilter';

// Components
import { AssignmentStatsOverview } from './features/assignments/components/AssignmentStatsOverview';
import { AssignmentFilterBar } from './features/assignments/components/AssignmentFilterBar';
import { AssignmentList } from './features/assignments/components/AssignmentList';
import { AssignmentFormModal } from './features/assignments/components/AssignmentFormModal';
import { ArchitectureShowcase } from './features/assignments/components/ArchitectureShowcase';
import { ToastNotification } from './common/components/Toast/ToastNotification';

// Icons
import {
  CalendarDays,
  Plus,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  const dispatch = useAppDispatch();
  const {
    items,
    filter,
    searchQuery,
    selectedSubject,
    sortBy,
    status,
    actionStatus,
    error,
    notification,
  } = useAppSelector((state) => state.assignments);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ----------------------------------------------------
  // Yêu cầu chức năng 7: Khởi động app, lấy danh sách mẫu từ API giả lập
  // ----------------------------------------------------
  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  // ----------------------------------------------------
  // Buổi 2: Sử dụng Custom Hook nâng cao useAssignmentFilter
  // ----------------------------------------------------
  const { filteredAssignments, stats, availableSubjects } = useAssignmentFilter({
    assignments: items,
    filter,
    searchQuery,
    sortBy,
    selectedSubject,
  });

  // Xử lý tạo bài tập mới (Yêu cầu 2)
  const handleCreateAssignment = (payload: CreateAssignmentInput) => {
    dispatch(addAssignment(payload)).then((action) => {
      if (addAssignment.fulfilled.match(action)) {
        setIsModalOpen(false);
      }
    });
  };

  // Xử lý đánh dấu hoàn thành / bỏ đánh dấu (Yêu cầu 3)
  const handleToggle = (id: string) => {
    dispatch(toggleAssignment(id));
  };

  // Xử lý xoá bài tập (Yêu cầu 4)
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bài tập này không?')) {
      dispatch(deleteAssignment(id));
    }
  };

  // Khôi phục dữ liệu mẫu
  const handleResetMockData = () => {
    if (window.confirm('Khôi phục danh sách dữ liệu bài tập mẫu ban đầu?')) {
      dispatch(resetToMockData());
    }
  };

  // Ngày hiện tại định dạng đẹp
  const todayFormatted = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="app-layout">
      {/* 1. Header ứng dụng */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand-group">
            <div className="brand-logo-glow">
              <GraduationCap className="brand-icon" size={28} />
            </div>
            <div>
              <div className="brand-title-row">
                <h1 className="brand-title">Student Deadline Tracker</h1>
                <span className="brand-pill">React 19 + RTK</span>
              </div>
              <p className="brand-subtitle">
                Ứng dụng theo dõi deadline bài tập cá nhân sinh viên
              </p>
            </div>
          </div>

          <div className="header-actions">
            <div className="current-date-chip">
              <CalendarDays size={16} className="date-icon" />
              <span className="date-text">{todayFormatted}</span>
            </div>

            <button
              type="button"
              className="btn-create-assignment"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Thêm bài tập mới</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Nội dung chính (Main Content) */}
      <main className="app-main-content">
        {/* Panel giải thích kiến trúc Buổi 1, 2, 3 */}
        <ArchitectureShowcase />

        {/* Thống kê tiến độ (Stats Cards) */}
        <AssignmentStatsOverview stats={stats} />

        {/* Thanh công cụ: Lọc trạng thái, Tìm kiếm, Môn học, Sắp xếp */}
        <AssignmentFilterBar
          currentFilter={filter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedSubject={selectedSubject}
          availableSubjects={availableSubjects}
          stats={stats}
          onFilterChange={(f) => dispatch(setFilter(f))}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
          onSortChange={(s) => dispatch(setSortBy(s))}
          onSubjectChange={(subj) => dispatch(setSelectedSubject(subj))}
          onResetMockData={handleResetMockData}
          isResetting={status === 'loading'}
        />

        {/* Danh sách bài tập (Áp dụng HOC withLoading và Compound Component) */}
        <AssignmentList
          isLoading={status === 'loading'}
          loadingMessage="Đang tải danh sách bài tập từ API giả lập..."
          assignments={filteredAssignments}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onOpenCreateModal={() => setIsModalOpen(true)}
        />
      </main>

      {/* 3. Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-meta">
            <p className="footer-title">
              <strong>Student Deadline Tracker</strong> — Đồ án Thực hành Web
            </p>
            <p className="footer-tech-list">
              TypeScript Generics &amp; Type Guards • React Compound Components &amp; HOC • Redux Toolkit (Thunks &amp; Typed Hooks)
            </p>
          </div>
          <div className="footer-badges">
            <span className="badge-tag">TypeScript 6</span>
            <span className="badge-tag">Redux Toolkit 2</span>
            <span className="badge-tag">React 19</span>
          </div>
        </div>
      </footer>

      {/* 4. Modal tạo bài tập mới (Compound Component) */}
      <AssignmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAssignment}
        isSubmitting={actionStatus === 'loading'}
      />

      {/* 5. Toast thông báo */}
      <ToastNotification
        message={notification}
        type="success"
        onClose={() => dispatch(clearNotification())}
      />
      <ToastNotification
        message={error}
        type="error"
        onClose={() => dispatch(clearError())}
      />
    </div>
  );
}
