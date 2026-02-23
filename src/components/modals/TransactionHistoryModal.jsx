import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';

const { 
    X = () => null, 
    Trash2 = () => null, 
    FileDown = () => null, 
    ChevronRight = () => null, 
    ChevronDown = () => null 
} = Icons || {};

// 獨立的列組件以處理展開狀態
const TransactionRow = ({ tx, theme }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const ITEMS_LIMIT = 3; // 設定預設顯示的物料數量上限
    const items = tx.items || []; // 防呆：確保 items 是一個陣列
    const hasMore = items.length > ITEMS_LIMIT;

    return (
        <tr 
            onClick={() => hasMore && setIsExpanded(!isExpanded)}
            className={`${theme.colors.hover} transition-colors border-b ${theme.colors.border} ${hasMore ? 'cursor-pointer' : ''}`}
        >
            <td className={`px-6 py-4 ${theme.colors.textSub} align-top`}>
                <div className="flex items-start gap-2">
                    {hasMore && (
                        <div className="mt-0.5 opacity-50">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                    )}
                    <span>{tx.date}</span>
                </div>
            </td>
            <td className="px-6 py-4 align-top"><span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'in' ? (theme.type === 'dark' ? 'bg-green-500/20 text-green-200' : 'bg-green-100 text-green-700') : (theme.type === 'dark' ? 'bg-orange-500/20 text-orange-200' : 'bg-orange-100 text-orange-700')}`}>{tx.type === 'in' ? '入庫' : '出庫'}</span></td>
            <td className={`px-6 py-4 ${theme.colors.textMain} align-top`}>
                <div className="space-y-1">
                    {(isExpanded ? items : items.slice(0, ITEMS_LIMIT)).map((i, idx) => (
                        <div key={idx}>{i.name} x{i.qty}</div>
                    ))}
                    {!isExpanded && hasMore && <div className={`text-xs ${theme.colors.textSub} opacity-70 italic`}>... 還有 {items.length - ITEMS_LIMIT} 項</div>}
                </div>
            </td>
            <td className={`px-6 py-4 ${theme.colors.textSub} align-top`}>{tx.target}</td>
        </tr>
    );
};

const TransactionHistoryModal = ({ isOpen, onClose, transactions, onClear }) => {
    const { theme } = useContext(ThemeContext);
    if (!theme) return null;

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
                    className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col border ${theme.colors.border}`} 
                    onClick={e => e.stopPropagation()}
                >
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>異動歷程</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => window.appExportCSV && window.appExportCSV(transactions, '異動紀錄', 'history')} className={`p-2 active:bg-black/5 rounded-lg ${theme.colors.textSub}`} title="匯出"><FileDown className="w-5 h-5" /></button>
                        <button onClick={onClear} className={`p-2 active:bg-red-50 text-red-500 rounded-lg`} title="清空"><Trash2 className="w-5 h-5" /></button>
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
                            {transactions.map(tx => <TransactionRow key={tx.id} tx={tx} theme={theme} />)}
                            {transactions.length === 0 && <tr><td colSpan="4" className={`px-6 py-8 text-center ${theme.colors.textSub}`}>無紀錄</td></tr>}
                        </tbody>
                    </table>
                </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TransactionHistoryModal;