// ==========================================
// THÀNH PHẦN THỐNG KÊ TỔNG QUAN (METRICS CARDS)
// ==========================================

import React from 'react';
import type { AssignmentStats } from '../../../types/assignment';
import { BookMarked, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AssignmentStatsOverviewProps {
  stats: AssignmentStats;
}

export const AssignmentStatsOverview: React.FC<AssignmentStatsOverviewProps> = ({ stats }) => {
  return (
    <div className="stats-overview-grid">
      {/* 1. Tổng bài tập */}
      <div className="stat-card stat-total">
        <div className="stat-icon-wrapper">
          <BookMarked size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Tổng bài tập</span>
          <div className="stat-value-row">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-badge">Toàn bộ</span>
          </div>
        </div>
      </div>

      {/* 2. Chưa hoàn thành */}
      <div className="stat-card stat-pending">
        <div className="stat-icon-wrapper">
          <Clock size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Chưa hoàn thành</span>
          <div className="stat-value-row">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-subtext">Cần nộp</span>
          </div>
        </div>
      </div>

      {/* 3. Quá hạn */}
      <div className={`stat-card stat-overdue ${stats.overdue > 0 ? 'alert-glow' : ''}`}>
        <div className="stat-icon-wrapper">
          <AlertTriangle size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Quá hạn</span>
          <div className="stat-value-row">
            <span className="stat-number">{stats.overdue}</span>
            {stats.overdue > 0 && <span className="stat-badge-danger">Cần chú ý!</span>}
          </div>
        </div>
      </div>

      {/* 4. Đã hoàn thành */}
      <div className="stat-card stat-completed">
        <div className="stat-icon-wrapper">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Đã hoàn thành</span>
          <div className="stat-value-row">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-rate">{stats.completionRate}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.completionRate}%` }}
              role="progressbar"
              aria-valuenow={stats.completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
