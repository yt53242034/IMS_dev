import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';

const { 
    X = () => null, 
    Save = () => null, 
    Package = () => null, 
    Plus = () => null 
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
        console.error("AddItemModal Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
                        <h3 className="text-lg font-bold text-red-600 mb-2">發生錯誤</h3>
                        <p className="text-sm text-gray-500 mb-4">無法顯示新增視窗，請稍後再試。</p>
                        <button onClick={this.props.onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">關閉</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const AddItemModalContent = ({ isOpen, onClose, onSave, categories, materials }) => {
    const { theme } = useContext(ThemeContext);
    
    // 初始狀態
    const initialFormState = {
        id: '',
        name: '',
        category: '',
        size: '',
        material: '',
        stock: 0,
        minStock: 10,
        price: 0,
        location: '',
        image: null
    };

    const [formData, setFormData] = useState(initialFormState);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    // 當開啟時重置表單
    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
            setPreviewImage(null);
        }
    }, [isOpen]);

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
    };

    return (
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
                className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border ${theme.colors.border} flex flex-col max-h-[90vh]`} 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.appBg}`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>新增物料</h3>
                    <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 scroller">
                    <form id="add-form" onSubmit={handleSubmit} className="space-y-6">
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
                                    <Plus className="w-8 h-8 text-white" />
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full">
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>品名 <span className="text-red-500">*</span></label>
                                <input name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain} focus:ring-2 focus:ring-blue-500/20 outline-none`} required placeholder="輸入物料名稱" />
                            </div>
                            
                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>編號 (ID)</label>
                                <input name="id" value={formData.id || ''} onChange={handleChange} placeholder="系統自動生成 (若留空)" className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>分類</label>
                                <input list="categories_add" name="category" value={formData.category} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} placeholder="選擇或輸入分類" />
                                <datalist id="categories_add">{categories.map(c => <option key={c} value={c} />)}</datalist>
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>規格</label>
                                <input name="size" value={formData.size} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} placeholder="例如: 16mm" />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>材質</label>
                                <input list="materials_add" name="material" value={formData.material} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} placeholder="例如: 304不鏽鋼" />
                                <datalist id="materials_add">{materials.map(m => <option key={m} value={m} />)}</datalist>
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>初始庫存</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>安全庫存</label>
                                <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>

                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>單價</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} />
                            </div>
                            
                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>儲位/位置</label>
                                <input name="location" value={formData.location} onChange={handleChange} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} placeholder="例如: A-01-02" />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t ${theme.colors.border} flex justify-end items-center ${theme.colors.appBg} space-x-3`}>
                    <button type="button" onClick={onClose} className={`px-4 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.textSub} font-bold text-sm active:bg-gray-50`}>取消</button>
                    <button type="submit" form="add-form" className={`px-6 py-2 rounded-lg ${theme.colors.primary} text-white font-bold text-sm shadow-lg active:opacity-90 flex items-center`}>
                        <Save className="w-4 h-4 mr-2" /> 確認新增
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AddItemModal = (props) => {
    return (
        <AnimatePresence>
            {props.isOpen && (
                <ErrorBoundary onClose={props.onClose}>
                    <AddItemModalContent {...props} />
                </ErrorBoundary>
            )}
        </AnimatePresence>
    );
};

export default AddItemModal;