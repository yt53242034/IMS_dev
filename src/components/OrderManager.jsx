// c:\Users\Administrator\Desktop\proims-app\src\components\OrderManager.jsx
import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Icons } from './Icons';

const { Search, Check, Trash2 } = Icons;

const OrderManager = ({ orders, onExecute, onDelete }) => {
    const { theme } = useContext(ThemeContext);
    const [tab, setTab] = useState('pending'); // pending | completed
    const [searchTerm, setSearchTerm] = useState('');

    const displayOrders = orders.filter(o => {
        if (o.status !== tab) return false;
        const term = searchTerm.toLowerCase();
        return o.id.toLowerCase().includes(term) || o.items.some(i => i.name.toLowerCase().includes(term));
    });

    return (
        <div className="space-y-6">
            {/* Header: 分頁切換 + 搜尋 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex space-x-2 p-1 bg-slate-200/50 rounded-xl w-fit">
                    <button onClick={()=>setTab('pending')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab==='pending' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>待處理 ({orders.filter(o=>o.status==='pending').length})</button>
                    <button onClick={()=>setTab('completed')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab==='completed' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}>歷史紀錄</button>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.colors.textSub}`} />
                    <input type="text" placeholder="搜尋單號或品項..." className={`w-full pl-9 pr-4 py-2 ${theme.colors.panelBg} border ${theme.colors.border} rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${theme.colors.textMain}`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* 訂單列表 */}
            <div className="grid gap-4">
                {displayOrders.length === 0 ? <div className={`text-center py-10 ${theme.colors.textSub}`}>無資料</div> : displayOrders.map(order => (
                    <div key={order.id} className={`${theme.colors.panelBg} p-5 rounded-2xl border ${theme.colors.border} shadow-sm relative overflow-hidden`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${order.type === 'in' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        <div className="flex justify-between items-start mb-3 pl-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${order.type === 'in' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {order.type === 'in' ? '進貨單' : '出貨單'}
                                    </span>
                                    <span className={`text-xs ${theme.colors.textSub}`}>{order.date}</span>
                                </div>
                                <h3 className={`font-bold text-lg mt-1 ${theme.colors.textMain}`}>
                                    {(order.items || []).map(i => `${i.name} x${i.qty}`).join(', ')}
                                </h3>
                            </div>
                            {tab === 'pending' && (
                                <button onClick={() => onExecute(order.id)} className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-green-600 active:scale-95 transition-transform flex items-center">
                                    <Check className="w-4 h-4 mr-1"/> 執行
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-end pl-3">
                            <div className={`text-xs ${theme.colors.textSub}`}>單號: {order.id}</div>
                            <button onClick={() => onDelete(order.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManager;
