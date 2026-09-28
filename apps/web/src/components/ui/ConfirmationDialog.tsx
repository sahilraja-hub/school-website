import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info' | 'primary';
  variant?: 'danger' | 'warning' | 'info' | 'primary';
  confirmVariant?: 'danger' | 'warning' | 'info' | 'primary';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmText,
  cancelLabel = 'Cancel',
  type,
  variant,
  confirmVariant,
  isLoading = false,
}) => {
  const handleClose = onClose || onCancel || (() => {});
  const displayConfirmLabel = confirmText || confirmLabel || 'Confirm';

  const rawType = type || variant || confirmVariant || 'danger';
  const resolvedType = rawType === 'primary' ? 'info' : rawType;

  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-danger-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-warning-600" />,
    info: <Info className="w-6 h-6 text-info-600" />,
  };

  const bgMap = {
    danger: 'bg-danger-50',
    warning: 'bg-warning-50',
    info: 'bg-info-50',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      role="alertdialog"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={rawType === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {displayConfirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${bgMap[resolvedType]} shrink-0`}>
          {iconMap[resolvedType]}
        </div>
        <div className="space-y-1">
          <h4 className="font-serif text-base font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};
