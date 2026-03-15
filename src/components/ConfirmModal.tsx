import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-academic shadow-2xl overflow-hidden border border-oxford-blue/10 animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-serif font-black text-oxford-blue leading-none">{title}</h3>
                <button 
                  onClick={onClose}
                  disabled={loading}
                  className="text-oxford-blue/40 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-charcoal/80 leading-relaxed font-medium">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50/80 border-t border-oxford-blue/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-mono font-black text-oxford-blue/60 uppercase tracking-widest hover:bg-oxford-blue/5 rounded-academic transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 text-xs font-mono font-black text-white uppercase tracking-widest bg-red-600 hover:bg-red-700 rounded-academic transition-colors flex items-center gap-2 shadow-sm shadow-red-600/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
