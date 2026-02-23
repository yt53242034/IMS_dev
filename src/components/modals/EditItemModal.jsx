import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';
import { toast } from 'react-hot-toast';

const { 
    X = () => null, 
    Save = () => null, 
    Trash2 = () => null, 
    Package = () => null, 
    Pencil = () => null, 
    History = () => null,
    ChevronLeft = () => null,
    ChevronRight = () => null
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
        console.error("EditItemModal Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
                        <h3 className="text-lg font-bold text-red-600 mb-2">發生錯誤</h3>
                        <p className="text-sm text-gray-500 mb-4">無法顯示編輯視窗，請稍後再試。</p>
                        <button onClick={this.props.onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">關閉</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// 圖片預載入組件 (隱藏渲染)
const PreloadImages = ({ currentIndex, inventoryList }) => {
    if (!inventoryList || inventoryList.length === 0) return null;
    const prevItem = inventoryList[currentIndex - 1];
    const nextItem = inventoryList[currentIndex + 1];
    
    return (
        <div className="hidden" aria-hidden="true">
            {prevItem?.image && <img src={prevItem.image} alt="preload-prev" />}
            {nextItem?.image && <img src={nextItem.image} alt="preload-next" />}
        </div>
    );
};

const EditItemModalContent = ({ isOpen, onClose, item, onSave, onDelete, categories, materials, transactions, inventoryList = [], onItemChange }) => {
    const { theme } = useContext(ThemeContext);
    const [formData, setFormData] = useState({});
    const [baselineData, setBaselineData] = useState({}); // 新增：比對基準資料
    const [previewImage, setPreviewImage] = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // info | history
    const fileInputRef = useRef(null);
    const [direction, setDirection] = useState(0); // 動畫方向: 1 (右進), -1 (左進)

    useEffect(() => {
        if (item) {
            setFormData({ ...item });
            setBaselineData({ ...item }); // 初始化基準資料
            setPreviewImage(item.image);
        }
        if (isOpen) setActiveTab('info'); // 每次開啟時重置為基本資料分頁
    }, [item]);

    if (!item) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setBaselineData({ ...formData }); // 儲存後更新基準，清除編輯狀態
    };

    // 篩選此物料的歷史紀錄
    const itemHistory = useMemo(() => {
        if (!item || !transactions) return [];
        return transactions.filter(tx => 
            tx.items && tx.items.some(i => i.name === item.name)
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [item, transactions]);

    // --- 輔助函式：檢查單一欄位是否被修改 ---
    const isFieldModified = (fieldName) => {
        if (!baselineData) return false;
        const original = baselineData[fieldName];
        const current = formData[fieldName];
        
        // 轉為字串比對，忽略型別差異 (例如 10 與 "10") 與 null/undefined 差異
        const v1 = original === null || original === undefined ? '' : String(original);
        const v2 = current === null || current === undefined ? '' : String(current);
        return v1 !== v2;
    };

    // --- Dirty Check (全域未儲存變更偵測) ---
    const isDirty = useMemo(() => {
        const keys = ['name', 'id', 'category', 'size', 'material', 'stock', 'minStock', 'price', 'location', 'image'];
        return keys.some(key => isFieldModified(key));
    }, [baselineData, formData]);

    // --- 新增：導航邏輯 ---
    const currentIndex = useMemo(() => {
        if (!item || !inventoryList) return -1;
        return inventoryList.findIndex(i => i.id === item.id);
    }, [item, inventoryList]);

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < inventoryList.length - 1;

    const handlePrev = () => {
        if (isDirty) {
            toast.error("您有未儲存的變更，請先儲存！");
            return;
        }
        if (hasPrev && onItemChange) {
            setDirection(-1);
            onItemChange(inventoryList[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (isDirty) {
            toast.error("您有未儲存的變更，請先儲存！");
            return;
        }
        if (hasNext && onItemChange) {
            setDirection(1);
            onItemChange(inventoryList[currentIndex + 1]);
        }
    };

    // --- 新增：手勢邏輯 ---
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

    const onDragEnd = (e, { offset, velocity }) => {
        const swipe = swipePower(offset.x, velocity.x);
        if (swipe < -swipeConfidenceThreshold && hasNext) handleNext();
        else if (swipe > swipeConfidenceThreshold && hasPrev) handlePrev();
    };

    // --- 新增：關閉攔截 (防呆機制) ---
    const handleClose = () => {
        if (isDirty) {
            if (window.confirm("您有未儲存的變更，確定要放棄編輯並關閉嗎？")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    // --- 新增：動畫參數 ---
    const variants = {
        enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0, position: 'absolute' }),
        center: { zIndex: 1, x: 0, opacity: 1, position: 'relative' },
        // exit 的方向要與 enter 相反：往右滑(上一頁)時，舊的往右飛出；往左滑(下一頁)時，舊的往左飛出
        // 注意：這裡使用 absolute 讓舊卡片在飛出時不會佔據空間，達成重疊滑動效果
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0, position: 'absolute' })
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} 
            onClick={handleClose}
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="relative w-full max-w-2xl flex items-center justify-center"
                onClick={e => e.stopPropagation()}
            >
                {/* Left Arrow (Outside) */}
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    className={`flex absolute left-2 lg:-left-16 z-10 p-2 rounded-full bg-black/20 lg:bg-white/10 hover:bg-black/40 lg:hover:bg-white/20 text-white transition-all ${!hasPrev ? 'opacity-0 pointer-events-none' : ''}`}
                    title="上一個"
                >
                    <ChevronLeft className="w-10 h-10" />
                </button>

                <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full overflow-hidden border ${theme.colors.border} flex flex-col h-[85vh]`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.appBg}`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>編輯物料</h3>
                    <button onClick={handleClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 relative overflow-hidden bg-inherit">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={item.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={onDragEnd}
                            className="absolute inset-0 w-full h-full overflow-y-auto p-6 scroller"
                        >
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl mb-6 border border-gray-200">
                        <button 
                            type="button"
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center ${activeTab === 'info' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 active:bg-gray-200/50'}`}
                        >
                            <Pencil className="w-4 h-4 mr-2" /> 基本資料
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center ${activeTab === 'history' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 active:bg-gray-200/50'}`}
                        >
                            <History className="w-4 h-4 mr-2" /> 異動紀錄
                        </button>
                    </div>

                    {activeTab === 'info' ? (
                    <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Section */}
                        <div className="flex justify-center">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className={`w-32 h-32 rounded-xl border-2 border-dashed ${theme.colors.border} flex items-center justify-center overflow-hidden bg-gray-50`}>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Package className="w-8 h-8 mx-auto mb-1" />
                                            <span className="text-xs">上傳圖片</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 active:opacity-100 transition-opacity rounded-xl">
                                    <Pencil className="w-6 h-6 text-white" />
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full">
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    品名
                                    {isFieldModified('name') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input name="name" value={formData.name || ''} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain} focus:ring-2 focus:ring-blue-500/20 outline-none`} required />
                            </div>
                            
                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    編號 (ID)
                                    {isFieldModified('id') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input name="id" value={formData.id || ''} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} required />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    分類
                                    {isFieldModified('category') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input list="categories_edit" name="category" value={formData.category || ''} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                                <datalist id="categories_edit">{categories.map(c => <option key={c} value={c} />)}</datalist>
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    規格
                                    {isFieldModified('size') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input name="size" value={formData.size || ''} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    材質
                                    {isFieldModified('material') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input list="materials_edit" name="material" value={formData.material || ''} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                                <datalist id="materials_edit">{materials.map(m => <option key={m} value={m} />)}</datalist>
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    庫存數量
                                    {isFieldModified('stock') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    安全庫存
                                    {isFieldModified('minStock') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input type="number" name="minStock" value={formData.minStock || 10} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    單價
                                    {isFieldModified('price') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input type="number" name="price" value={formData.price || 0} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>
                            
                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>
                                    儲位/位置
                                    {isFieldModified('location') && <span className="text-red-500 text-xs ml-2 font-bold">(已編輯)</span>}
                                </label>
                                <input name="location" value={formData.location || ''} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>
                        </div>
                    </form>
                    ) : (
                        <div className="space-y-3">
                            {itemHistory.length > 0 ? (
                                itemHistory.map(tx => {
                                    const txItem = tx.items.find(i => i.name === item.name);
                                    const qty = txItem ? txItem.qty : 0;
                                    return (
                                        <div key={tx.id} className={`p-4 rounded-xl border ${theme.colors.border} ${theme.colors.appBg} flex justify-between items-center`}>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${tx.type === 'in' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {tx.type === 'in' ? '入庫' : '出庫'}
                                                    </span>
                                                    <span className={`text-xs ${theme.colors.textSub}`}>{tx.date}</span>
                                                </div>
                                                <div className={`text-sm font-medium ${theme.colors.textMain}`}>{tx.target || '無備註'}</div>
                                            </div>
                                            <div className={`text-lg font-bold font-mono ${tx.type === 'in' ? 'text-blue-600' : 'text-orange-600'}`}>
                                                {tx.type === 'in' ? '+' : '-'}{qty}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={`text-center py-12 ${theme.colors.textSub}`}>
                                    <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>尚無異動紀錄</p>
                                </div>
                            )}
                        </div>
                    )}
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* 預載入前後圖片 */}
                    <PreloadImages currentIndex={currentIndex} inventoryList={inventoryList} />
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t ${theme.colors.border} flex justify-between items-center ${theme.colors.appBg}`}>
                    {/* Delete Button (Corner) */}
                    {onDelete && activeTab === 'info' && (
                        <button 
                            type="button" 
                            onClick={() => onDelete(item.id)} 
                            className="flex items-center px-4 py-2 text-red-500 active:bg-red-50 rounded-lg transition-colors font-bold text-sm"
                            title="刪除此物料"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> 刪除物料
                        </button>
                    )}
                    
                    <div className="flex space-x-3 ml-auto">
                        <button type="button" onClick={handleClose} className={`px-4 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.textSub} font-bold text-sm active:bg-gray-50`}>取消</button>
                        {activeTab === 'info' && (
                            <button 
                                type="submit" 
                                form="edit-form" 
                                className={`px-6 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center transition-all ${isDirty ? `${theme.colors.primary} text-white active:opacity-90` : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            >
                                <Save className={`w-4 h-4 mr-2 ${isDirty ? '' : 'opacity-50'}`} /> 儲存變更
                            </button>
                        )}
                    </div>
                </div>
                </div>

                {/* Right Arrow (Outside) */}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasNext}
                    className={`flex absolute right-2 lg:-right-16 z-10 p-2 rounded-full bg-black/20 lg:bg-white/10 hover:bg-black/40 lg:hover:bg-white/20 text-white transition-all ${!hasNext ? 'opacity-0 pointer-events-none' : ''}`}
                    title="下一個"
                >
                    <ChevronRight className="w-10 h-10" />
                </button>
            </motion.div>
        </motion.div>
    );
};

const EditItemModal = (props) => {
    return (
        <AnimatePresence>
            {props.isOpen && props.item && (
                <ErrorBoundary onClose={props.onClose}>
                    <EditItemModalContent {...props} />
                </ErrorBoundary>
            )}
        </AnimatePresence>
    );
};

export default EditItemModal;
