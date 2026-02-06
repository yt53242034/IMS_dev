import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';
import { compressImage } from '../../utils/imageTools';

const { X, Save } = Icons;

const EditItemModal = ({ isOpen, onClose, item, onSave, categories, materials }) => {
    const { theme } = useContext(ThemeContext);
    if (!isOpen || !item) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // 處理圖片
        const file = formData.get('imageFile');
        if (file && file.size > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const compressed = await compressImage(e.target.result);
                onSave({ ...item, ...data, image: compressed });
            };
            reader.readAsDataURL(file);
        } else {
            onSave({ ...item, ...data });
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} onClick={onClose}>
            <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border ${theme.colors.border}`} onClick={e => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>編輯物料</h3>
                    <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>品名</label><input name="name" defaultValue={item.name} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>規格</label><input name="size" defaultValue={item.size} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                        <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>材質</label><input name="material" defaultValue={item.material} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                    </div>
                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>分類</label><select name="category" defaultValue={item.category} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`}>{categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>更換圖片</label><input type="file" name="imageFile" accept="image/*" className={`w-full text-sm ${theme.colors.textSub}`} /></div>
                    <div className="pt-4 flex justify-end"><button type="submit" className={`px-6 py-2 rounded-lg ${theme.colors.primary} text-white font-bold flex items-center`}><Save className="w-4 h-4 mr-2" /> 儲存變更</button></div>
                </form>
            </div>
        </div>
    );
};

export default EditItemModal;