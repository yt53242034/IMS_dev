import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';

const { X, Trash2, FileDown } = Icons;

const TransactionHistoryModal = ({ isOpen, onClose, transactions, onClear }) => {
    const { theme } = useContext(ThemeContext);
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} onClick={onClose}>
            <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col border ${theme.colors.border}`} onClick={e => e.stopPropagation()}>
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>異動歷程</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => window.appExportCSV(transactions, '異動紀錄', 'history')} className={`p-2 hover:bg-black/5 rounded-lg ${theme.colors.textSub}`} title="匯出"><FileDown className="w-5 h-5" /></button>
                        <button onClick={onClear} className={`p-2 hover:bg-red-50 text-red-500 rounded-lg`} title="清空"><Trash2 className="w-5 h-5" /></button>
                        <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left text-sm">
                        <thead className={`${theme.colors.appBg} sticky top-0`}>
                            <tr>
                                <th className={`px-6 py-3 font-bold ${theme.colors.textSub}`}>時間</th>
                                <th className={`px-6 py-3 font-bold ${theme.colors.textSub}`}>類型</th>
                                <th className={`px-6 py-3 font-bold ${theme.colors.textSub}`}>項目</th>
                                <th className={`px-6 py-3 font-bold ${theme.colors.textSub}`}>備註</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border}`}>
                            {transactions.map(tx => (
                                <tr key={tx.id} className={theme.colors.hover}>
                                    <td className={`px-6 py-3 ${theme.colors.textSub}`}>{tx.date}</td>
                                    <td className="px-6 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{tx.type === 'in' ? '入庫' : '出庫'}</span></td>
                                    <td className={`px-6 py-3 ${theme.colors.textMain}`}>{tx.items.map(i => `${i.name} x${i.qty}`).join(', ')}</td>
                                    <td className={`px-6 py-3 ${theme.colors.textSub}`}>{tx.target}</td>
                                </tr>
                            ))}
                            {transactions.length === 0 && <tr><td colSpan="4" className={`px-6 py-8 text-center ${theme.colors.textSub}`}>無紀錄</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistoryModal;