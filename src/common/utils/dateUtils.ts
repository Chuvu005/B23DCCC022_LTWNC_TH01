// ==========================================
// TIỆN ÍCH TÍNH TOÁN NGÀY VÀ THỜI HẠN DEADLINE
// Yêu cầu chức năng 6: Mỗi bài tập hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"
// ==========================================

export interface DeadlineInfo {
  formattedText: string;
  daysDiff: number;
  statusType: 'overdue' | 'due-today' | 'due-soon' | 'normal' | 'completed';
  badgeColor: string;
}

/**
 * Tính toán chênh lệch số ngày giữa ngày hiện tại và ngày hết hạn
 * @param dueDateStr Chuỗi ngày YYYY-MM-DD
 * @param isCompleted Trạng thái hoàn thành của bài tập
 */
export function calculateDeadlineInfo(dueDateStr: string, isCompleted: boolean = false): DeadlineInfo {
  if (isCompleted) {
    return {
      formattedText: 'Đã hoàn thành',
      daysDiff: 0,
      statusType: 'completed',
      badgeColor: 'badge-completed',
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, month, day] = dueDateStr.split('-').map(Number);
  const due = new Date(year, month - 1, day);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      formattedText: `Quá hạn ${overdueDays} ngày`,
      daysDiff: diffDays,
      statusType: 'overdue',
      badgeColor: 'badge-overdue',
    };
  }

  if (diffDays === 0) {
    return {
      formattedText: 'Hôm nay đến hạn',
      daysDiff: 0,
      statusType: 'due-today',
      badgeColor: 'badge-urgent',
    };
  }

  if (diffDays === 1) {
    return {
      formattedText: 'Còn 1 ngày (Ngày mai)',
      daysDiff: 1,
      statusType: 'due-soon',
      badgeColor: 'badge-warning',
    };
  }

  return {
    formattedText: `Còn ${diffDays} ngày`,
    daysDiff: diffDays,
    statusType: diffDays <= 3 ? 'due-soon' : 'normal',
    badgeColor: diffDays <= 3 ? 'badge-warning' : 'badge-normal',
  };
}

/**
 * Định dạng ngày hiển thị đẹp mắt (VD: 15/10/2026)
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Lấy ngày hôm nay dưới dạng YYYY-MM-DD cho input date picker
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Tạo ngày tương lai offset ngày (VD: +3 ngày, -2 ngày)
 */
export function getDateOffsetString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
