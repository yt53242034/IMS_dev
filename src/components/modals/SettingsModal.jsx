import React, { useContext } from 'react';
import { ThemeContext, THEMES } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';

const { X, RefreshCw } = Icons;

const SettingsModal = ({ isOpen, onClose, onReset, settings, onUpdateSettings, currentThemeId, onThemeChange }) => {
    const { theme } = useContext(ThemeContext);
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} onClick={onClose}>
            <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border ${theme.colors.border}`} onClick={e => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>系統設定</h3>
                    <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className={`block text-sm font-bold ${theme.colors.textMain} mb-3`}>主題風格</label>
                        <div className="grid grid-cols-2 gap-3">
                            {THEMES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => onThemeChange(t.id)}
                                    className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${currentThemeId === t.id ? `border-blue-500 bg-blue-50 text-blue-700` : `${theme.colors.border} ${theme.colors.textSub} hover:bg-black/5`}`}
                                >
                                    {t.name}
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

                    <div className={`pt-4 border-t ${theme.colors.border}`}>
                        <button onClick={onReset} className="w-full py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold flex items-center justify-center transition-colors">
                            <RefreshCw className="w-4 h-4 mr-2" /> 重置所有數據
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;