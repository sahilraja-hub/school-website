import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Sidebar } from './Sidebar';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="left" maxWidth="max-w-xs">
      <div className="-m-6">
        <Sidebar collapsed={false} onToggleCollapse={onClose} className="h-screen w-full border-none" />
      </div>
    </Drawer>
  );
};
