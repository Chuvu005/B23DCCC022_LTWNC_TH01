// ==========================================
// BUỔI 2: REACT DESIGN PATTERN - COMPOUND COMPONENT
// AssignmentCard Compound Component:
// Tách biệt logic và giao diện thành các subcomponent liên kết qua React Context
// ==========================================

import React, { createContext, useContext } from 'react';
import type { Assignment } from '../../../../types/assignment';
import { useDeadlineCalculator } from '../../../../common/hooks/useDeadlineCalculator';
import { PRIORITY_CONFIG } from '../../../../common/constants/priorityConfig';
import { formatDisplayDate } from '../../../../common/utils/dateUtils';
import { Check, Trash2, Calendar, Clock, AlertTriangle, BookOpen } from 'lucide-react';

interface AssignmentCardContextValue {
  assignment: Assignment;
  isCompleted: boolean;
  isOverdue: boolean;
  formattedText: string;
  statusType: string;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AssignmentCardContext = createContext<AssignmentCardContextValue | null>(null);

function useAssignmentCardContext() {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('Các subcomponent của AssignmentCard phải nằm trong <AssignmentCard>');
  }
  return context;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  children: React.ReactNode;
}

export function AssignmentCard({
  assignment,
  onToggle,
  onDelete,
  children,
}: AssignmentCardProps) {
  // Sử dụng Custom Hook nâng cao (Buổi 2) để tính toán hạn nộp
  const { formattedText, statusType, isOverdue } = useDeadlineCalculator(
    assignment.dueDate,
    assignment.completed
  );

  const contextValue: AssignmentCardContextValue = {
    assignment,
    isCompleted: assignment.completed,
    isOverdue,
    formattedText,
    statusType,
    onToggle,
    onDelete,
  };

  const cardClasses = [
    'assignment-card',
    assignment.completed ? 'card-completed' : '',
    isOverdue ? 'card-overdue' : '',
    `priority-border-${assignment.priority}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AssignmentCardContext.Provider value={contextValue}>
      <article className={cardClasses} data-id={assignment.id}>
        {children}
      </article>
    </AssignmentCardContext.Provider>
  );
}

// -------------------------------------------------------------------
// Subcomponents của AssignmentCard
// -------------------------------------------------------------------

// 1. AssignmentCard.Header
function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}

// 2. AssignmentCard.SubjectBadge
function SubjectBadge() {
  const { assignment } = useAssignmentCardContext();
  return (
    <div className="card-subject-badge" title={`Môn: ${assignment.subject}`}>
      <BookOpen size={14} className="badge-icon" />
      <span>{assignment.subject}</span>
    </div>
  );
}

// 3. AssignmentCard.PriorityBadge
function PriorityBadge() {
  const { assignment } = useAssignmentCardContext();
  const config = PRIORITY_CONFIG[assignment.priority] || PRIORITY_CONFIG.medium;

  return (
    <div
      className={`card-priority-badge ${config.badgeClass}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      <span className="priority-dot" style={{ backgroundColor: config.color }} />
      <span>{config.label}</span>
    </div>
  );
}

// 4. AssignmentCard.Body
function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
}

// 5. AssignmentCard.Title
function CardTitle() {
  const { assignment, isCompleted } = useAssignmentCardContext();
  return (
    <h3 className={`card-title ${isCompleted ? 'text-strikethrough' : ''}`}>
      {assignment.title}
    </h3>
  );
}

// 6. AssignmentCard.Description
function CardDescription() {
  const { assignment } = useAssignmentCardContext();
  if (!assignment.description) return null;
  return <p className="card-description">{assignment.description}</p>;
}

// 7. AssignmentCard.DueInfo (Yêu cầu chức năng 6: "Còn X ngày" / "Quá hạn Y ngày")
function DueInfo() {
  const { assignment, formattedText, isOverdue, isCompleted } = useAssignmentCardContext();
  const displayDate = formatDisplayDate(assignment.dueDate);

  return (
    <div className="card-due-info">
      <div className="due-date-row">
        <Calendar size={14} className="due-icon" />
        <span className="due-date-text">Hạn nộp: <strong>{displayDate}</strong></span>
      </div>

      <div
        className={`countdown-pill ${
          isCompleted
            ? 'pill-completed'
            : isOverdue
            ? 'pill-overdue'
            : 'pill-active'
        }`}
      >
        {isOverdue && !isCompleted ? (
          <AlertTriangle size={13} className="countdown-icon pulse-animation" />
        ) : (
          <Clock size={13} className="countdown-icon" />
        )}
        <span className="countdown-text">{formattedText}</span>
      </div>
    </div>
  );
}

// 8. AssignmentCard.Actions
function CardActions({ children }: { children?: React.ReactNode }) {
  return <div className="card-actions">{children}</div>;
}

// 9. AssignmentCard.ToggleButton (Yêu cầu chức năng 3: Đánh dấu hoàn thành / bỏ đánh dấu)
function ToggleButton() {
  const { assignment, isCompleted, onToggle } = useAssignmentCardContext();

  return (
    <button
      type="button"
      className={`btn-toggle-completion ${isCompleted ? 'btn-completed' : 'btn-uncompleted'}`}
      onClick={() => onToggle?.(assignment.id)}
      title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
      aria-label={isCompleted ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}
    >
      <span className={`checkbox-custom ${isCompleted ? 'checked' : ''}`}>
        {isCompleted && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="btn-label">
        {isCompleted ? 'Đã hoàn thành' : 'Hoàn thành'}
      </span>
    </button>
  );
}

// 10. AssignmentCard.DeleteButton (Yêu cầu chức năng 4: Xoá bài tập)
function DeleteButton() {
  const { assignment, onDelete } = useAssignmentCardContext();

  return (
    <button
      type="button"
      className="btn-delete"
      onClick={() => onDelete?.(assignment.id)}
      title="Xoá bài tập này"
      aria-label="Xoá bài tập"
    >
      <Trash2 size={16} />
    </button>
  );
}

// Kết nối các subcomponents theo Compound Component pattern
AssignmentCard.Header = CardHeader;
AssignmentCard.SubjectBadge = SubjectBadge;
AssignmentCard.PriorityBadge = PriorityBadge;
AssignmentCard.Body = CardBody;
AssignmentCard.Title = CardTitle;
AssignmentCard.Description = CardDescription;
AssignmentCard.DueInfo = DueInfo;
AssignmentCard.Actions = CardActions;
AssignmentCard.ToggleButton = ToggleButton;
AssignmentCard.DeleteButton = DeleteButton;
