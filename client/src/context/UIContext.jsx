import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [modal, setModal] = useState(null);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, duration);
        }
    }, []);

    const showConfirm = useCallback((config) => {
        setModal(config);
    }, []);

    const hideModal = useCallback(() => {
        setModal(null);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <UIContext.Provider value={{ showNotification, showConfirm, hideModal }}>
            {children}

            {/* Global Notifications Overlay */}
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-slide-in-right transform transition-all ${notif.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                                notif.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
                                    'bg-blue-50 border-blue-100 text-blue-800'
                            }`}
                    >
                        {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {notif.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                        <p className="text-sm font-bold">{notif.message}</p>
                        <button
                            onClick={() => removeNotification(notif.id)}
                            className="ml-2 hover:opacity-70 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Global Modal Overlay */}
            {modal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 w-[95%] max-w-md shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${modal.danger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {modal.icon || <Info size={32} />}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">{modal.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8">
                                {modal.message}
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={hideModal}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                                >
                                    {modal.cancelText || 'Otkaži'}
                                </button>
                                <button
                                    onClick={() => {
                                        modal.onConfirm();
                                        hideModal();
                                    }}
                                    className={`flex-1 px-6 py-3 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 ${modal.danger ? 'bg-red-500 shadow-red-200 hover:bg-red-600' : 'bg-blue-600 shadow-blue-200 hover:bg-blue-700'
                                        }`}
                                >
                                    {modal.confirmText || 'Potvrdi'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
