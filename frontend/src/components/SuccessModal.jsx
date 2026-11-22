import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

/**
 * Delete Confirmation Modal
 */
export const DeleteConfirmModal = ({ isOpen, hotel, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen || !hotel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100 transform transition-all">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
            <p className="text-xs text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-gray-900">"{hotel.title}"</span>? This will permanently remove the record from the database and remove its uploaded media.
        </p>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center space-x-2 transition disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Hotel</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Success Popup Modal / Toast
 */
export const SuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full sm:w-auto animate-bounce-short">
      <div className="bg-emerald-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-emerald-500">
        <div className="w-8 h-8 rounded-full bg-emerald-500/50 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-sm font-medium pr-2">
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-emerald-200 hover:text-white transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
