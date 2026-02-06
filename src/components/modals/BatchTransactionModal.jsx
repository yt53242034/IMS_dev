import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';
import InventoryListItem from '../InventoryListItem';

const { X, Check, Search, Plus } = Icons;

const BatchTransactionModal = ({ isOpen, onClose, inventory, onConfirm, mode }) => {
    const { theme } = useContext(ThemeContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [target, setTarget] = useState('');

    if (!isOpen) return null;

    const filteredInventory = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleItemClick = (item) => {
        if (selectedItems.find(i => i.id === item.id)) return;
        setSelectedItems([...selectedItems, { ...item, addQty: 1 }]);
    };

    const updateQty = (id, qty) => {
        setSelectedItems(selectedItems.map(i => i.id === id ? { ...i, addQty: Number(qty) } : i));
    };

    const handleConfirm = () => {
        onConfirm(selectedItems, mode === 'transaction' ? (target.includes('入') ? 'in' : 'out') : 'out', { target, date: new Date().toISOString().split('T')[0] });
        setSelectedItems([]);
        setTarget('');
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} onClick={onClose}>
            <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col border ${theme.colors.border}`} onClick={e => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>{mode === 'order' ? '建立訂單' : '批次作業'}</h3>
                    <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div className={`w-1/2 border-r ${theme.colors.border} flex flex-col`}>
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.colors.textSub}`} />
                                <input type="text" placeholder="搜尋物料..." className={`w-full pl-9 pr-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {filteredInventory.map(item => (
                                <InventoryListItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col p-4 bg-gray-50/50">
                        <div className="mb-4">
                            <label className={`block text-xs font-bold ${theme.colors.textSub} mb-1`}>{mode === 'order' ? '訂單備註' : '作業原因/對象'}</label>
                            <input value={target} onChange={e => setTarget(e.target.value)} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} placeholder="例如：進貨、客戶A..." />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {selectedItems.map(item => (
                                <div key={item.id} className={`p-3 bg-white rounded-lg shadow-sm border ${theme.colors.border} flex justify-between items-center`}>
                                    <span className={`font-bold ${theme.colors.textMain}`}>{item.name}</span>
                                    <input type="number" value={item.addQty} onChange={e => updateQty(item.id, e.target.value)} className="w-20 px-2 py-1 border rounded text-center" />
                                    <button onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}><X className="w-4 h-4 text-red-400" /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleConfirm} disabled={selectedItems.length === 0} className={`mt-4 w-full py-3 rounded-xl ${theme.colors.primary} text-white font-bold flex items-center justify-center disabled:opacity-50`}><Check className="w-5 h-5 mr-2" /> 確認提交</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchTransactionModal;