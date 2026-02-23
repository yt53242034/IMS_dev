import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext, THEMES } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';

const { X, Check } = Icons || {};

const SettingsModal = ({ isOpen, onClose, settings, onUpdateSettings, currentThemeId, onThemeChange }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <AnimatePresence>
            {isOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} 
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border ${theme.colors.border}`} 
                    onClick={e => e.stopPropagation()}
                >
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>系統設定</h3>
                    <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className={`block text-sm font-bold ${theme.colors.textMain} mb-3`}>主題風格</label>
                        <div className="flex gap-4">
                            {THEMES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => onThemeChange(t.id)}
                                    className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${currentThemeId === t.id ? `border-blue-500 shadow-md scale-110` : `${theme.colors.border} hover:scale-105`}`}
                                    style={{ backgroundColor: t.id === 'light' ? '#f8fafc' : '#0f172a' }}
                                    title={t.name}
                                >
                                    {currentThemeId === t.id && <Check className={`w-6 h-6 ${t.id === 'light' ? 'text-slate-800' : 'text-white'}`} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${theme.colors.textMain}`}>允許負庫存</span>
                        <button 
                            onClick={() => onUpdateSettings({ ...settings, allowNegativeStock: !settings.allowNegativeStock })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowNegativeStock ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.allowNegativeStock ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${theme.colors.textMain}`}>顯示物料縮圖</span>
                        <button 
                            onClick={() => onUpdateSettings({ ...settings, showThumbnails: !settings.showThumbnails })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showThumbnails ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.showThumbnails ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;