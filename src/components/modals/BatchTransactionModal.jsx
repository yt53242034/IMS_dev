// c:\Users\Administrator\Desktop\proims-app\src\components\modals\BatchTransactionModal.jsx
import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';
import InventoryListItem from '../InventoryListItem';

const { 
    X = () => null, 
    Search = () => null, 
    Plus = () => null, 
    ArrowRightLeft = () => null, 
    ArrowLeft = () => null, 
    Calendar = () => null, 
    Users = () => null, 
    DollarSign = () => null, 
    Trash2 = () => null, 
    Sparkles = () => null, 
    CheckCircle2 = () => null, 
    AlertCircle = () => null 
} = Icons || {};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("BatchTransactionModal Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center border border-gray-200">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">發生錯誤</h3>
                        <p className="text-sm text-gray-500 mb-6">無法載入視窗內容。請嘗試重新操作或聯絡管理員。</p>
                        <button onClick={this.props.onClose} className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                            關閉
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const BatchTransactionModalContent = ({ isOpen, onClose, inventory, onConfirm, onAddNewItem, categories = [], allowNegativeStock, mode, initialType = 'out' }) => {
    const { theme } = useContext(ThemeContext);
    const [pendingItems, setPendingItems] = useState([]);
    const [transactionType, setTransactionType] = useState(initialType);
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showQuickCreate, setShowQuickCreate] = useState(false);
    const [newMaterial, setNewMaterial] = useState({ name: '', size: '', material: '', category: '接頭' });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [txData, setTxData] = useState({ target: '', date: new Date().toISOString().split('T')[0], amount: '' });
    const dropdownRef = useRef(null);

    // 當 Modal 開啟時重置狀態
    useEffect(() => { 
        if (isOpen) { 
            setPendingItems([]); 
            setTransactionType(initialType); 
            setSearchTerm(''); 
            setFilterCategory('all'); 
            setStep(1);
            setTxData({ target: '', date: new Date().toISOString().split('T')[0], amount: '' }); 
            setIsDropdownOpen(false);
        } 
    }, [isOpen, initialType]);

    // 點擊外部關閉下拉選單
    useEffect(() => { 
        const handleClickOutside = (event) => { 
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !showQuickCreate) setIsDropdownOpen(false); 
        }; 
        if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside); 
        return () => document.removeEventListener("mousedown", handleClickOutside); 
    }, [isDropdownOpen, showQuickCreate]);

    if (!theme) return null;

    // 切換物料選取狀態
    const toggleItemSelection = (item) => {
        setPendingItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) return prev.filter(i => i.id !== item.id);
            else return [...prev, { ...item, addQty: 0 }];
        });
    };

    // 更新數量
    const handleQtyChange = (id, qty) => {
        setPendingItems(prev => prev.map(item => item.id === id ? { ...item, addQty: parseInt(qty) || 0 } : item));
    };

    // 處理快速新增物料
    const handleConfirmCreate = () => {
        if (!newMaterial.name) return;
        if (onAddNewItem) {
            const newItem = onAddNewItem(newMaterial);
            if (newItem) {
                toggleItemSelection(newItem);
                setShowQuickCreate(false);
                setSearchTerm('');
                setIsDropdownOpen(false);
                setNewMaterial({ name: '', size: '', material: '', category: '接頭' });
            }
        }
    };

    // 確認提交
    const handleConfirm = () => {
        const validItems = pendingItems.filter(i => i.addQty > 0);
        if (validItems.length === 0) return;
        
        // 檢查負庫存 (僅在出庫且不允許負庫存時檢查)
        if (transactionType === 'out' && !allowNegativeStock) {
            const invalidItems = validItems.filter(i => i.stock - i.addQty < 0);
            if (invalidItems.length > 0) { 
                alert(`錯誤：庫存不足且不允許負庫存：\n${invalidItems.map(i => i.name).join('\n')}`); 
                return; 
            }
        }
        onConfirm(validItems, transactionType, txData);
    };

    // 使用 useMemo 優化過濾效能
    const filteredInventory = useMemo(() => {
        return (Array.isArray(inventory) ? inventory : []).filter(i => {
            if (!i) return false;
            const matchesCategory = filterCategory === 'all' || i.category === filterCategory;
            const term = searchTerm.toLowerCase();
            const matchesSearch = String(i.name || '').toLowerCase().includes(term) || String(i.id || '').toLowerCase().includes(term);
            return matchesCategory && matchesSearch;
        });
    }, [inventory, filterCategory, searchTerm]);

    const isOutbound = transactionType === 'out';
    const inputClass = `w-full px-3 py-2.5 border ${theme.colors.border} rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${theme.colors.inputBg} ${theme.colors.textMain}`;
    const isDark = theme.type === 'dark';

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} 
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]`} 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`px-6 py-5 border-b ${theme.colors.border} flex justify-between items-center ${isOutbound ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                    <div>
                        <h3 className={`font-bold text-xl ${isOutbound ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-blue-400' : 'text-blue-600')}`}>
                            {step === 1 ? `選擇${isOutbound ? '出庫' : '入庫'}物料` : `${isOutbound ? '出庫' : '入庫'}單據確認`}
                        </h3>
                        <div className={`text-xs mt-1 font-bold opacity-60 ${isOutbound ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-blue-400' : 'text-blue-600')}`}>
                            {mode === 'order' ? '建立訂單' : '批次作業'} - 步驟 {step} / 2
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full ${theme.colors.hover} transition-colors`}><X className={`w-6 h-6 ${isOutbound ? (isDark ? 'text-red-300' : 'text-red-400') : (isDark ? 'text-blue-300' : 'text-blue-400')}`} /></button>
                </div>

                <div className={`flex-1 overflow-hidden flex flex-col min-h-0 ${theme.colors.appBg}`}>
                    {step === 1 ? (
                        // 步驟 1: 選擇物料
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className={`px-6 py-4 border-b ${theme.colors.border} space-y-4 ${theme.colors.panelBg} z-10 shadow-sm`}>
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                    <div className={`flex ${theme.colors.appBg} p-1.5 rounded-xl w-full md:w-48 shrink-0`}>
                                        <button onClick={() => setTransactionType('in')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isOutbound ? `${theme.colors.panelBg} text-blue-500 shadow-sm` : `${theme.colors.textSub} active:text-slate-700`}`}>入庫</button>
                                        <button onClick={() => setTransactionType('out')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isOutbound ? `${theme.colors.panelBg} text-red-500 shadow-sm` : `${theme.colors.textSub} active:text-slate-700`}`}>出庫</button>
                                    </div>
                                    <div className="flex-1 flex gap-2">
                                        <div className="relative flex-1" ref={dropdownRef}>
                                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.colors.textSub}`} />
                                            <input className={inputClass + " pl-11 pr-4"} placeholder="搜尋物料名稱..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }} onFocus={() => setIsDropdownOpen(true)} />
                                            {isDropdownOpen && (
                                                <div className={`absolute top-full left-0 w-full mt-1 ${theme.colors.panelBg} border ${theme.colors.border} rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto scroller`}>
                                                    {filteredInventory.length > 0 ? (
                                                        filteredInventory.map(item => (
                                                            <InventoryListItem
                                                                key={item.id}
                                                                item={item}
                                                                isSelected={!!pendingItems.find(p => p.id === item.id)}
                                                                onClick={() => toggleItemSelection(item)}
                                                            />
                                                        ))
                                                    ) : (<div className={`p-4 text-center ${theme.colors.textSub} text-sm`}>找不到相關物料</div>)}
                                                    {searchTerm && <div onClick={() => { setNewMaterial(prev => ({...prev, name: searchTerm})); setShowQuickCreate(true); setIsDropdownOpen(false); }} className={`p-4 ${theme.colors.panelBg} cursor-pointer text-center text-blue-500 text-sm font-bold border-t ${theme.colors.border} sticky bottom-0`}><Plus className="w-4 h-4 inline mr-1" /> 新增 "{searchTerm}"</div>}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => { setShowQuickCreate(true); setIsDropdownOpen(false); }} className={`px-4 py-2.5 ${theme.colors.primary} ${theme.colors.primaryText} rounded-xl text-sm font-bold shadow-md active:opacity-90 whitespace-nowrap flex items-center transition-all btn-touch`}><Plus className="w-5 h-5 mr-1"/> 新增</button>
                                    </div>
                                </div>
                                <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar scroller">
                                    {categories.map(c => (
                                        <button key={c} onClick={() => setFilterCategory(c)} className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all border ${filterCategory === c ? `${theme.colors.textMain} ${theme.colors.border} bg-black/10` : `${theme.colors.panelBg} ${theme.colors.textSub} ${theme.colors.border}`}`}>{c === 'all' ? '全部' : c}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-scroll scroller p-6 pb-32">
                                {showQuickCreate ? (
                                    <div className={`max-w-md mx-auto ${theme.colors.panelBg} p-6 rounded-2xl border ${theme.colors.border} shadow-lg animate-in zoom-in-95`}>
                                        <h4 className={`font-bold ${theme.colors.textMain} flex items-center mb-5 text-lg`}><Sparkles className="w-5 h-5 mr-2 text-blue-500"/>快速新增物料</h4>
                                        <div className="space-y-4">
                                            <div><label className={`text-xs font-bold ${theme.colors.textSub} uppercase mb-1 block`}>品名</label><input className={inputClass} value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} /></div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div><label className={`text-xs font-bold ${theme.colors.textSub} uppercase mb-1 block`}>規格</label><input className={inputClass} value={newMaterial.size} onChange={e => setNewMaterial({...newMaterial, size: e.target.value})} /></div>
                                                <div><label className={`text-xs font-bold ${theme.colors.textSub} uppercase mb-1 block`}>分類</label><select className={inputClass} value={newMaterial.category} onChange={e => setNewMaterial({...newMaterial, category: e.target.value})}>{categories.filter(c => c!=='all').map(c => <option key={c} value={c}>{c}</option>)}<option value="其他">其他</option></select></div>
                                            </div>
                                            <div><label className={`text-xs font-bold ${theme.colors.textSub} uppercase mb-1 block`}>材質</label><input className={inputClass} value={newMaterial.material} onChange={e => setNewMaterial({...newMaterial, material: e.target.value})} /></div>
                                            <div className={`flex justify-end space-x-2 pt-3 border-t ${theme.colors.border} mt-2`}><button onClick={() => setShowQuickCreate(false)} className={`px-4 py-3 ${theme.colors.textSub} text-sm font-bold ${theme.colors.hover} rounded-lg btn-touch`}>取消</button><button onClick={handleConfirmCreate} className={`px-4 py-3 ${theme.colors.primary} ${theme.colors.primaryText} rounded-lg text-sm font-bold shadow-md btn-touch`}>新增並選取</button></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {filteredInventory.map(item => {
                                            const isSelected = !!pendingItems.find(p => p.id === item.id);
                                            const isStockout = item.stock <= 0;
                                            let cardClass = `item-card p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between min-h-[8rem] relative group transition-all duration-200 active:scale-[0.97] `;
                                            
                                            if (isSelected) {
                                                cardClass += 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20';
                                            } else if (isStockout) {
                                                cardClass += theme.type === 'dark' ? 'border-red-900/50 bg-red-900/10' : 'border-red-100 bg-red-50/50';
                                            } else {
                                                cardClass += `${theme.colors.border} ${theme.colors.panelBg} active:border-blue-300`;
                                            }

                                            return (
                                                <div key={item.id} onClick={() => toggleItemSelection(item)} className={cardClass}>
                                                    {isStockout && (
                                                        <span className={`absolute top-3 left-3 text-[10px] font-bold px-1.5 py-0.5 rounded ${theme.type === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-600'}`}>
                                                            缺貨
                                                        </span>
                                                    )}
                                                    <div className="pt-4">
                                                        <div className={`text-sm font-bold leading-snug line-clamp-2 ${isSelected ? 'text-blue-600' : theme.colors.textMain}`}>{item.name}</div>
                                                        <div className={`text-xs ${theme.colors.textSub} mt-1 font-mono`}>{item.id}</div>
                                                    </div>
                                                    <div className="flex justify-between items-end mt-3"><span className={`text-[10px] px-2 py-0.5 ${theme.colors.appBg} rounded ${theme.colors.textSub} font-medium`}>{item.size}</span><span className={`text-xs font-mono font-bold ${theme.colors.textMain}`}>Stock: {item.stock}</span></div>
                                                    {isSelected && <div className="absolute top-3 right-3 text-blue-500"><CheckCircle2 className="w-6 h-6" /></div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // 步驟 2: 確認數量與資訊
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className={`p-6 ${theme.colors.panelBg} border-b ${theme.colors.border} z-10 shadow-sm`}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1.5 flex items-center uppercase tracking-wide`}><Calendar className="w-3.5 h-3.5 mr-1.5 opacity-50"/>操作日期</label><input type="date" className={inputClass} value={txData.date} onChange={e => setTxData({...txData, date: e.target.value})} /></div>
                                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1.5 flex items-center uppercase tracking-wide`}><Users className="w-3.5 h-3.5 mr-1.5 opacity-50"/>{isOutbound ? '領料人/專案' : '供應商來源'}</label><input type="text" className={inputClass} placeholder={isOutbound ? "例如: 工程A部" : "例如: 廠商B"} value={txData.target} onChange={e => setTxData({...txData, target: e.target.value})} /></div>
                                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1.5 flex items-center uppercase tracking-wide`}><DollarSign className="w-3.5 h-3.5 mr-1.5 opacity-50"/>單據金額</label><input type="number" min="0" className={inputClass} placeholder="0" value={txData.amount} onChange={e => setTxData({...txData, amount: e.target.value})} /></div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-scroll scroller p-6 pb-32">
                                <h4 className={`font-bold ${theme.colors.textMain} mb-4 flex items-center justify-between text-lg`}><span>已選物料清單</span><span className={`text-xs font-bold ${theme.colors.appBg} ${theme.colors.textSub} px-2 py-1 rounded-full`}>共 {pendingItems.length} 項</span></h4>
                                {pendingItems.length > 0 ? (
                                    <div className="space-y-3">
                                        {pendingItems.map(i => (
                                            <div key={i.id} className={`flex items-center p-4 border rounded-2xl shadow-sm transition-all ${theme.colors.panelBg} ${isOutbound && !allowNegativeStock && (i.stock - i.addQty < 0) ? 'border-red-500/50 bg-red-500/5' : theme.colors.border}`}>
                                                <div className="flex-1">
                                                    <div className={`font-bold text-base ${theme.colors.textMain}`}>{i.name}</div>
                                                    <div className={`text-xs ${theme.colors.textSub} font-mono mt-0.5`}>{i.id} | 目前庫存: <span className="font-bold">{i.stock}</span></div>
                                                    {isOutbound && !allowNegativeStock && (i.stock - i.addQty < 0) && (<div className="text-xs text-red-500 font-bold mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>庫存不足 (缺 {Math.abs(i.stock - i.addQty)})</div>)}
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex flex-col items-end">
                                                        <label className={`text-[10px] font-bold ${theme.colors.textSub} uppercase mb-1`}>{isOutbound ? '出庫' : '入庫'}數</label>
                                                        <input type="number" min="0" className={`w-24 border rounded-lg p-2 text-right font-bold text-lg focus:ring-2 outline-none transition-all ${theme.colors.inputBg} ${theme.colors.textMain} ${isOutbound && !allowNegativeStock && (i.stock - i.addQty < 0) ? 'border-red-500 text-red-500' : theme.colors.border}`} placeholder="0" value={i.addQty || ''} onChange={e => handleQtyChange(i.id, e.target.value)} autoFocus={pendingItems.indexOf(i) === 0}/>
                                                    </div>
                                                    <button onClick={() => toggleItemSelection(i)} className="p-3 text-slate-400 active:text-red-500 active:bg-red-500/10 rounded-xl transition-colors btn-touch"><Trash2 className="w-6 h-6" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (<div className={`text-center py-16 ${theme.colors.textSub}`}><p>未選擇任何物料，請返回上一步選取。</p></div>)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`p-5 border-t ${theme.colors.border} ${theme.colors.panelBg} flex justify-between items-center rounded-b-2xl`}>
                    {step === 1 ? (
                        <><div className={`text-sm font-medium ${theme.colors.textSub}`}>已選取 <span className="font-bold text-blue-500 text-lg mx-1">{pendingItems.length}</span> 項物料</div><button onClick={() => setStep(2)} disabled={pendingItems.length === 0} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center btn-touch ${pendingItems.length > 0 ? `${theme.colors.sidebarBg} text-white shadow-lg` : `${theme.colors.appBg} ${theme.colors.textSub} cursor-not-allowed`}`}>下一步 <ArrowRightLeft className="w-4 h-4 ml-2" /></button></>
                    ) : (
                        <><button onClick={() => setStep(1)} className={`px-5 py-3 ${theme.colors.textSub} text-sm font-bold ${theme.colors.hover} rounded-xl flex items-center transition-colors btn-touch`}><ArrowLeft className="w-4 h-4 mr-2"/> 返回選取</button><button onClick={handleConfirm} className={`px-8 py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all btn-touch ${isOutbound ? 'bg-red-600' : 'bg-blue-600'}`}>確認{isOutbound ? '出庫' : '入庫'}</button></>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

const BatchTransactionModal = (props) => {
    return (
        <AnimatePresence>
            {props.isOpen && (
                <ErrorBoundary onClose={props.onClose}>
                    <BatchTransactionModalContent {...props} />
                </ErrorBoundary>
            )}
        </AnimatePresence>
    );
};

export default BatchTransactionModal;
