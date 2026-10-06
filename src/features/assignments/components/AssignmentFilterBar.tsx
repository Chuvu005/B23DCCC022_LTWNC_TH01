// ==========================================
// BỘ LỌC VÀ TÌM KIẾM BÀI TẬP (FILTER BAR)
// Yêu cầu chức năng 5: Lọc theo trạng thái: Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành
// ==========================================

import React from 'react';
import type { FilterStatus, SortOption, AssignmentStats } from '../../../types/assignment';
import { Search, X, RotateCcw, ArrowUpDown, Layers } from 'lucide-react';

interface AssignmentFilterBarProps {
  currentFilter: FilterStatus;
  searchQuery: string;
  sortBy: SortOption;
  selectedSubject: string;
  availableSubjects: string[];
  stats: AssignmentStats;
  onFilterChange: (filter: FilterStatus) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onSubjectChange: (subject: string) => void;
  onResetMockData: () => void;
  isResetting?: boolean;
}

export const AssignmentFilterBar: React.FC<AssignmentFilterBarProps> = ({
  currentFilter,
  searchQuery,
  sortBy,
  selectedSubject,
  availableSubjects,
  stats,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onSubjectChange,
  onResetMockData,
  isResetting = false,
}) => {
  // Cấu hình các tab lọc trạng thái kèm đếm số lượng
  const filterTabs: Array<{ id: FilterStatus; label: string; count: number }> = [
    { id: 'all', label: 'Tất cả', count: stats.total },
    { id: 'pending', label: 'Chưa hoàn thành', count: stats.pending },
    { id: 'overdue', label: 'Quá hạn', count: stats.overdue },
    { id: 'completed', label: 'Đã hoàn thành', count: stats.completed },
  ];

  return (
    <div className="filter-bar-container">
      {/* 1. Thanh Tabs lọc theo trạng thái (Yêu cầu 5) */}
      <div className="status-tabs-wrapper" role="tablist" aria-label="Bộ lọc trạng thái bài tập">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`status-tab-btn ${isActive ? 'tab-active' : ''} tab-${tab.id}`}
              onClick={() => onFilterChange(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>
              <span className={`tab-count-badge ${isActive ? 'count-active' : ''}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Hàng điều khiển: Tìm kiếm + Lọc môn học + Sắp xếp */}
      <div className="controls-row">
        {/* Tìm kiếm */}
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên bài tập hoặc môn học..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Xoá tìm kiếm"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Lọc theo môn học */}
        <div className="filter-select-wrapper">
          <Layers size={16} className="select-icon" />
          <select
            className="custom-select"
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            aria-label="Lọc theo môn học"
          >
            <option value="all">Tất cả môn học ({availableSubjects.length})</option>
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Sắp xếp */}
        <div className="sort-select-wrapper">
          <ArrowUpDown size={16} className="select-icon" />
          <select
            className="custom-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sắp xếp danh sách"
          >
            <option value="dueDateAsc">Hạn nộp: Gần nhất trước</option>
            <option value="dueDateDesc">Hạn nộp: Xa nhất trước</option>
            <option value="priorityDesc">Ưu tiên: Cao xuống thấp</option>
            <option value="titleAsc">Tên bài tập: A → Z</option>
          </select>
        </div>

        {/* Khôi phục dữ liệu mẫu ban đầu */}
        <button
          type="button"
          className="btn-reset-mock"
          onClick={onResetMockData}
          disabled={isResetting}
          title="Khôi phục danh sách dữ liệu mẫu ban đầu của hệ thống"
        >
          <RotateCcw size={15} className={isResetting ? 'spin-animation' : ''} />
          <span>Dữ liệu mẫu</span>
        </button>
      </div>
    </div>
  );
};
