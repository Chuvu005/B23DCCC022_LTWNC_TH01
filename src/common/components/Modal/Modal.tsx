// ==========================================
// BUỔI 2: REACT DESIGN PATTERN - COMPOUND COMPONENT (MODAL)
// Cho phép lắp ghép linh hoạt giao diện hộp thoại với Modal.Header, Modal.Body, Modal.Footer
// ==========================================

import React, { createContext, useContext, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Các thành phần con của Modal phải được đặt trong <Modal>');
  }
  return context;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, children, maxWidth = '540px' }: ModalProps) {
  // Đóng modal khi nhấn Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <div
          className="modal-container"
          style={{ maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

// Subcomponent: Modal.Header
interface ModalHeaderProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
}

function ModalHeader({ children, showCloseButton = true }: ModalHeaderProps) {
  const { onClose } = useModalContext();

  return (
    <div className="modal-header">
      <div className="modal-header-title">{children}</div>
      {showCloseButton && (
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

// Subcomponent: Modal.Body
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

function ModalBody({ children, className = '' }: ModalBodyProps) {
  return <div className={`modal-body ${className}`}>{children}</div>;
}

// Subcomponent: Modal.Footer
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return <div className={`modal-footer ${className}`}>{children}</div>;
}

// Gắn các subcomponents vào Modal component
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
