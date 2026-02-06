// c:\Users\Administrator\Desktop\proims-app\src\components\modals\SettingsModal.jsx
import React, { useContext } from 'react';
import { ThemeContext, THEMES } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';

const { Settings, X, Palette, CheckCircle2, RefreshCw } = Icons;

const SettingsModal = ({ isOpen, onClose, onReset, settings, onUpdateSettings, currentThemeId, onThemeChange }) => {
    const { theme } = useContext(ThemeContext);
    if (!isOpen) return null;
    
    return (
        <div className={`fixed inset-0 z-[80] flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm animate-in fade-in zoom-in-95`} onClick={onClose}>
            <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border ${theme.colors.border}`} onClick={e => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.appBg}`}>
                    <div className="flex items-center space-x-2">
                        <Settings className={`w-5 h-5 ${theme.colors.textSub}`} />
                        <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>系統設定</h3>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full ${theme.colors.hover} transition-colors`}><X className={`w-5 h-5 ${theme.colors.textSub}`} /></button>
                </div>
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto scroller">
                    {/* 主題選擇 */}
                    <div>
                        <h4 className={`text-xs font-bold ${theme.colors.textSub} mb-3 tracking-wide uppercase flex items-center`}><Palette className="w-3.5 h-3.5 mr-1.5"/> 介面主題</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {THEMES.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => onThemeChange(t.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${currentThemeId === t.id ? `ring-2 ring-offset-2 ring-blue-500 ${theme.colors.border}` : `border-transparent hover:bg-black/5 dark:hover:bg-white/5`}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-full shadow-sm border ${t.type === 'dark' ? 'border-slate-600' : 'border-slate-200'}`} style={{ backgroundColor: t.id === 'warm_light' ? '#fdfbf7' : (t.type === 'dark' ? '#1e293b' : '#ffffff') }}>
                                            <div className="w-full h-1/2 rounded-t-full" style={{ backgroundColor: t.id === 'blue_light' ? '#2563eb' : (t.id === 'warm_light' ? '#ea580c' : (t.id === 'green_light' ? '#059669' : (t.id === 'ocean_dark' ? '#3b82f6' : '#a1a1aa'))) }}></div>
                                        </div>
                                        <span className={`text-sm font-bold ${theme.colors.textMain}`}>{t.name}</span>
                                    </div>
                                    {currentThemeId === t.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className={`${theme.colors.border}`} />

                    <div>
                        <h4 className={`text-xs font-bold ${theme.colors.textSub} mb-3 tracking-wide uppercase`}>庫存規則</h4>
                        <div className={`flex items-center justify-between p-4 ${theme.colors.appBg} rounded-xl border ${theme.colors.border}`}>
                            <div className="flex flex-col">
                                <span className={`text-base font-bold ${theme.colors.textMain}`}>允許負庫存</span>
                                <span className={`text-xs ${theme.colors.textSub} mt-0.5`}>出庫時允許庫存小於 0</span>
                            </div>
                            <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    type="checkbox" 
                                    name="toggle" 
                                    id="negativeStockToggle" 
                                    className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer ${theme.colors.border}`}
                                    checked={settings.allowNegativeStock}
                                    onChange={(e) => onUpdateSettings({ ...settings, allowNegativeStock: e.target.checked })}
                                />
                                <label htmlFor="negativeStockToggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${settings.allowNegativeStock ? 'bg-blue-500' : 'bg-slate-300'}`}></label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className={`text-xs font-bold ${theme.colors.textSub} mb-3 tracking-wide uppercase`}>數據管理</h4>
                        <div className={`p-4 ${theme.type === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} border rounded-xl`}>
                            <p className={`text-xs ${theme.type === 'dark' ? 'text-red-300' : 'text-red-600/80'} mb-3 leading-relaxed`}>注意：重置將清除所有本地儲存的庫存與交易紀錄。</p>
                            <button onClick={onReset} className={`w-full py-3 ${theme.colors.panelBg} border ${theme.type === 'dark' ? 'border-red-800 text-red-300' : 'border-red-200 text-red-600'} rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm`}>
                                <RefreshCw className="w-4 h-4 inline mr-2"/> 重置所有數據
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
