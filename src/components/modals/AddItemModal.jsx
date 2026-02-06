import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';
import { compressImage } from '../../utils/imageTools';

const { X, Plus } = Icons;

const AddItemModal = ({ isOpen, onClose, onSave, categories }) => {
    const { theme } = useContext(ThemeContext);
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const file = formData.get('imageFile');
        if (file && file.size > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const compressed = await compressImage(e.target.result);
                onSave({ ...data, image: compressed, stock: Number(data.stock), price: Number(data.price) });
            };
            reader.readAsDataURL(file);
        } else {
            onSave({ ...data, image: null, stock: Number(data.stock), price: Number(data.price) });
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} onClick={onClose}>
            <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border ${theme.colors.border}`} onClick={e => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>新增物料</h3>
                    <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>品名</label><input name="name" className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>規格</label><input name="size" className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                        <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>材質</label><input name="material" className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>初始庫存</label><input type="number" name="stock" defaultValue="0" className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                        <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>單價</label><input type="number" name="price" defaultValue="0" className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                    </div>
                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>圖片</label><input type="file" name="imageFile" accept="image/*" className={`w-full text-sm ${theme.colors.textSub}`} /></div>
                    <div className="pt-4 flex justify-end"><button type="submit" className={`px-6 py-2 rounded-lg ${theme.colors.primary} text-white font-bold flex items-center`}><Plus className="w-4 h-4 mr-2" /> 新增</button></div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;