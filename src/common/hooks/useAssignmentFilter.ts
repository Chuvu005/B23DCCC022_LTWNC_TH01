// ==========================================
// BUỔI 2: CUSTOM HOOK NÂNG CAO - useAssignmentFilter
// Tổng hợp logic lọc theo trạng thái, tìm kiếm, sắp xếp và thống kê
// ==========================================

import { useMemo } from 'react';
import type { Assignment, FilterStatus, SortOption, AssignmentStats } from '../../types/assignment';
import { isAssignmentOverdue } from '../utils/typeGuards';
import { filterCollection, searchByFields, sortByProperty } from '../utils/generics';
import { PRIORITY_CONFIG } from '../constants/priorityConfig';

interface UseAssignmentFilterProps {
  assignments: Assignment[];
  filter: FilterStatus;
  searchQuery: string;
  sortBy: SortOption;
  selectedSubject?: string;
}

interface UseAssignmentFilterResult {
  filteredAssignments: Assignment[];
  stats: AssignmentStats;
  availableSubjects: string[];
}

export function useAssignmentFilter({
  assignments,
  filter,
  searchQuery,
  sortBy,
  selectedSubject = 'all',
}: UseAssignmentFilterProps): UseAssignmentFilterResult {
  // 1. Thống kê số lượng (Stats)
  const stats = useMemo<AssignmentStats>(() => {
    let completedCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    for (const item of assignments) {
      if (item.completed) {
        completedCount++;
      } else {
        pendingCount++;
        if (isAssignmentOverdue(item)) {
          overdueCount++;
        }
      }
    }

    const total = assignments.length;
    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      total,
      completed: completedCount,
      pending: pendingCount,
      overdue: overdueCount,
      completionRate,
    };
  }, [assignments]);

  // 2. Danh sách tất cả môn học hiện có
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    for (const a of assignments) {
      if (a.subject) subjects.add(a.subject);
    }
    return Array.from(subjects).sort();
  }, [assignments]);

  // 3. Thực hiện lọc và sắp xếp
  const filteredAssignments = useMemo(() => {
    // Bước 1: Lọc theo trạng thái (FilterStatus)
    let result = filterCollection(assignments, (item) => {
      switch (filter) {
        case 'completed':
          return item.completed;
        case 'pending':
          return !item.completed;
        case 'overdue':
          return isAssignmentOverdue(item);
        case 'all':
        default:
          return true;
      }
    });

    // Bước 2: Lọc theo môn học (nếu chọn môn cụ thể)
    if (selectedSubject && selectedSubject !== 'all') {
      result = filterCollection(result, (item) => item.subject === selectedSubject);
    }

    // Bước 3: Tìm kiếm theo tiêu đề và môn học (sử dụng Generic searchByFields)
    if (searchQuery.trim()) {
      result = searchByFields(result, searchQuery, ['title', 'subject']);
    }

    // Bước 4: Sắp xếp kết quả (Sort)
    switch (sortBy) {
      case 'dueDateAsc':
        return sortByProperty(result, 'dueDate', 'asc');
      case 'dueDateDesc':
        return sortByProperty(result, 'dueDate', 'desc');
      case 'titleAsc':
        return sortByProperty(result, 'title', 'asc');
      case 'priorityDesc':
        return [...result].sort((a, b) => {
          const weightA = PRIORITY_CONFIG[a.priority]?.weight ?? 0;
          const weightB = PRIORITY_CONFIG[b.priority]?.weight ?? 0;
          return weightB - weightA;
        });
      default:
        return result;
    }
  }, [assignments, filter, searchQuery, sortBy, selectedSubject]);

  return {
    filteredAssignments,
    stats,
    availableSubjects,
  };
}
