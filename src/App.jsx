import React, { useState, useEffect, useMemo, useRef, createContext, useContext, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveFileToDevice, exportToCSV, printReport } from './utils/fileHelpers';
import { saveImageToDisk, loadImageFromDisk } from './utils/imageHandler';
import { ThemeContext, THEMES } from './contexts/ThemeContext';
import { Icons } from './components/Icons';
import SettingsModal from './components/modals/SettingsModal';
import ImagePreviewModal from './components/modals/ImagePreviewModal';
import TransactionHistoryModal from './components/modals/TransactionHistoryModal';
import EditItemModal from './components/modals/EditItemModal';
import AddItemModal from './components/modals/AddItemModal';
import BatchTransactionModal from './components/modals/BatchTransactionModal';
import ClientManager from './components/ClientManager';
import OrderManager from './components/OrderManager';
import { INITIAL_INVENTORY } from './data/inventoryData';
import { generateNextId } from './utils/idGenerator';

// ▼▼▼ 下面接著貼上您的舊代碼 ▼▼▼
        const { 
            FileDown, Printer, ClipboardList,
            LayoutDashboard, Package, ArrowRightLeft, History, Settings, Search, Filter, 
            Plus, Minus, AlertTriangle, CheckCircle2, XCircle, X, Sparkles, Pencil, Save, 
            Trash2, Check, Calendar, Users, DollarSign, ArrowLeft, RefreshCw, AlertCircle, Info, List,
            ToggleLeft, ToggleRight, Palette, Briefcase, Phone, Mail, MapPin, UserPlus, Hash,
            Database, Upload, FileUp
        } = Icons || {};

        // --- 子組件定義 ---
        
        // 列表縮圖組件 (修復圖片顯示)
        const TableThumbnail = React.memo(({ image, name }) => {
            const [src, setSrc] = useState(null);
            useEffect(() => {
                setSrc(null); // 切換圖片時先重置，避免顯示上一張圖
                if (!image) return setSrc(null);
                // 簡化判斷：含路徑符號或 data: 即視為直接可用的資源，否則讀取磁碟
                if (image.includes('/') || image.startsWith('data:')) {
                    setSrc(image);
                } else {
                    loadImageFromDisk(image).then(url => url && setSrc(url));
                }
            }, [image]);
            return (
                <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    {src ? <img src={src} alt={name} loading="lazy" className="w-full h-full object-cover" onError={() => setSrc(null)} /> : <Package className="w-5 h-5 text-gray-300" />}
                </div>
            );
        });

        // 還原選擇視窗 (新增組件)
        const RestoreModal = ({ data, onClose, onConfirm }) => {
            const { theme } = useContext(ThemeContext);
            const [selection, setSelection] = useState({
                inventory: !!data.inventory,
                orders: !!data.orders,
                transactions: !!data.transactions,
                clients: !!data.clients,
                settings: !!data.settings
            });

            return (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`}>
                    <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border ${theme.colors.border}`}>
                        <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center`}>
                            <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>選擇還原項目</h3>
                            <button onClick={onClose}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className={`text-sm ${theme.colors.textSub}`}>備份日期: {data.date ? new Date(data.date).toLocaleString() : '未知'}{data.note && <><br/>備註: {data.note}</>}</p>
                            <div className="space-y-2">
                                {[
                                    { key: 'inventory', label: `物料庫存 (${data.inventory?.length || 0} 筆)` },
                                    { key: 'orders', label: `訂單紀錄 (${data.orders?.length || 0} 筆)` },
                                    { key: 'transactions', label: `出入庫紀錄 (${data.transactions?.length || 0} 筆)` },
                                    { key: 'clients', label: `客戶資料 (${data.clients?.length || 0} 筆)` },
                                    { key: 'settings', label: '系統設定' }
                                ].map(item => data[item.key] && (
                                    <label key={item.key} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selection[item.key] ? 'border-blue-500 bg-blue-50' : `${theme.colors.border} active:bg-gray-50`}`}><input type="checkbox" checked={selection[item.key]} onChange={() => setSelection(p => ({...p, [item.key]: !p[item.key]}))} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3" /><span className={`font-bold ${theme.colors.textMain}`}>{item.label}</span></label>
                                ))}
                            </div>
                            <div className="pt-4 flex gap-3"><button onClick={onClose} className={`flex-1 py-3 rounded-xl border ${theme.colors.border} font-bold ${theme.colors.textSub}`}>取消</button><button onClick={() => onConfirm(selection)} className={`flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold shadow-lg active:bg-rose-600`}>確認還原</button></div>
                        </div>
                    </div>
                </div>
            );
        };

        // 庫存狀態標籤 (支援 Dark Mode)
        const StatusBadge = React.memo(({ stock, minStock, themeType }) => {
            const isDark = themeType === 'dark';
            const stockNum = Number(stock);
            const minStockNum = Number(minStock);
            
            if (stockNum < 0) return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-red-500/20 text-red-200 ring-1 ring-red-500/40' : 'bg-red-100 text-red-700 ring-1 ring-red-600/10'}`}><AlertCircle className="w-3.5 h-3.5 mr-1.5" /> 負庫存</span>;
            if (stockNum === 0) return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/40' : 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/10'}`}><XCircle className="w-3.5 h-3.5 mr-1.5" /> 缺貨</span>;
            if (stockNum <= minStockNum) return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/40' : 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/10'}`}><AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> 低庫存</span>;
            return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/40' : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/10'}`}><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 充足</span>;
        });

        // 數據卡片 (Dynamic Theme)
        const Card = React.memo(({ title, value, subtext, icon: Icon, onClick }) => {
            const { theme } = useContext(ThemeContext);

            return (
                <div 
                    onClick={onClick}
                    className={`${theme.colors.panelBg} ${theme.colors.cardShadow} p-6 rounded-2xl border ${theme.colors.border} transition-all active:scale-[0.98] cursor-pointer`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-semibold tracking-wide ${theme.colors.textSub}`}>{title}</h3>
                        <div className={`p-2.5 rounded-xl ${theme.colors.appBg}`}>
                            <Icon className={`w-5 h-5 ${theme.colors.textSub}`} />
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <h2 className={`text-4xl font-extrabold tracking-tight ${theme.colors.textMain}`}>{value}</h2>
                    </div>
                    {subtext && <p className={`text-xs font-medium mt-2 ${theme.colors.textSub}`}>{subtext}</p>}
                </div>
            );
        });

        // 快速庫存操作單元格 (加大按鈕 + Theme)
        const StockActionCell = React.memo(({ itemId, onStockChange, role = 'admin' }) => {
            const [pendingValue, setPendingValue] = useState(0);
            const { theme } = useContext(ThemeContext);
            const isDark = theme.type === 'dark';

            const handleChange = (e) => { 
                const valStr = e.target.value;
                if (valStr === '' || valStr === '-') { setPendingValue(valStr); } else { const val = parseInt(valStr); if (!isNaN(val)) setPendingValue(val); }
            };
            const handleIncrement = () => setPendingValue(prev => (parseInt(prev) || 0) + 1);
            const handleDecrement = () => setPendingValue(prev => (parseInt(prev) || 0) - 1);
            const handleReset = () => setPendingValue(0);
            const handleConfirm = () => { const val = parseInt(pendingValue) || 0; if (val !== 0) { onStockChange(itemId, val, '快速調整'); setPendingValue(0); } };
            const numericValue = parseInt(pendingValue) || 0; const isPending = numericValue !== 0;

            const btnBaseClass = `w-10 h-10 flex items-center justify-center rounded-xl border transition-colors btn-touch btn-hover ${theme.colors.border}`;
            const btnNormalClass = `${isDark ? 'bg-white/5 active:bg-white/10 text-slate-200' : 'bg-slate-50 active:bg-slate-100 text-slate-500'}`;

            return (
                <div className={`flex items-center justify-center space-x-2 ${role === 'admin' ? 'opacity-100' : 'opacity-40'}`}>
                    {isPending && role === 'admin' && (
                        <div className="flex items-center space-x-2 mr-1 animate-in fade-in slide-in-from-right-1 duration-200">
                            <button onClick={handleReset} className={`${btnBaseClass} ${theme.colors.panelBg} ${theme.colors.textSub}`}><X className="w-5 h-5" /></button>
                            <button onClick={handleConfirm} className={`w-10 h-10 flex items-center justify-center text-white rounded-xl shadow-md btn-touch btn-hover ${theme.colors.primary}`}><Check className="w-5 h-5" /></button>
                        </div>
                    )}
                    <button onClick={handleDecrement} disabled={role !== 'admin'} className={`${btnBaseClass} ${btnNormalClass}`}><Minus className="w-5 h-5" /></button>
                    <input 
                        type="text" 
                        value={pendingValue} 
                        onChange={handleChange} 
                        disabled={role !== 'admin'} 
                        className={`w-14 text-center text-base font-bold py-2 border rounded-xl focus:ring-2 outline-none transition-colors shadow-sm ${theme.colors.inputBg} ${theme.colors.textMain} ${theme.colors.border} ${isPending ? 'border-blue-500 text-blue-500' : ''}`} 
                        onClick={(e) => e.stopPropagation()} 
                    />
                    <button onClick={handleIncrement} disabled={role !== 'admin'} className={`${btnBaseClass} ${btnNormalClass}`}><Plus className="w-5 h-5" /></button>
                </div>
            );
        });

        // 獨立的表格列組件 (效能優化關鍵：避免搜尋時整表重繪)
        const InventoryRow = React.memo(({ item, settings, currentTheme, setPreviewItem, handleStockChange, setEditingItem }) => {
            return (
                <tr className={`transition-colors group active:bg-black/5 dark:active:bg-white/5`}>
                    <td className="px-3 py-4 md:px-4 lg:px-6 whitespace-nowrap w-24"><StatusBadge stock={item.stock} minStock={item.minStock} themeType={currentTheme.type} /></td>
                    {settings.showThumbnails && <td className="px-3 py-4 md:px-4 lg:px-6 w-16"><div onClick={() => setPreviewItem(item)} className="cursor-pointer active:opacity-80 transition-opacity"><TableThumbnail image={item.image} name={item.name} /></div></td>}
                    <td className="px-3 py-4 md:px-4 lg:px-6">
                        <div
                            onClick={() => setPreviewItem(item)}
                            className={`font-bold ${currentTheme.colors.textMain} text-base mb-1 cursor-pointer active:underline`}
                        >
                            {item.name}
                        </div>
                        <div className={`text-xs ${currentTheme.colors.textSub} font-mono tracking-wide`}>{item.id}</div>
                        {/* Mobile/Tablet View for Spec/Material & Price */}
                        <div className="lg:hidden mt-2 flex flex-wrap gap-y-1 gap-x-2 items-center">
                            <div className="flex gap-1.5">
                                <span className={`text-[10px] font-bold ${currentTheme.colors.textSub} ${currentTheme.colors.appBg} inline-block px-1.5 py-0.5 rounded border ${currentTheme.colors.border}`}>{item.size}</span>
                                <span className={`text-[10px] ${currentTheme.colors.textSub} font-medium flex items-center`}>{item.material}</span>
                            </div>
                            <span className={`text-xs font-mono font-bold ${currentTheme.colors.textMain} ${currentTheme.type === 'dark' ? 'bg-yellow-500/20 text-yellow-200' : 'bg-yellow-50 text-yellow-700'} px-1.5 py-0.5 rounded`}>
                                ${item.price?.toLocaleString()}
                            </span>
                        </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                            <span className={`text-xs font-bold ${currentTheme.colors.textSub} ${currentTheme.colors.appBg} inline-block px-2 py-1 rounded-md self-start border ${currentTheme.colors.border}`}>{item.size}</span>
                            <span className={`text-xs ${currentTheme.colors.textSub} font-medium`}>{item.material}</span>
                        </div>
                    </td>
                    <td className={`hidden lg:table-cell px-6 py-5 text-right font-mono font-medium ${currentTheme.colors.textMain}`}>
                        ${item.price?.toLocaleString()}
                    </td>
                    <td className={`px-3 py-4 md:px-4 lg:px-6 text-right font-mono text-xl font-bold ${currentTheme.colors.textMain}`}>{item.stock}</td>
                    <td className="px-3 py-4 md:px-4 lg:px-6 text-center w-48"><StockActionCell itemId={item.id} onStockChange={handleStockChange} /></td>
                    <td className="px-3 py-4 md:px-4 lg:px-6 text-center w-24"><button onClick={() => setEditingItem(item)} className={`p-3 ${currentTheme.colors.textSub} active:text-blue-500 active:bg-blue-500/10 rounded-xl transition-all border border-transparent btn-touch`}><Pencil className="w-5 h-5" /></button></td>
                </tr>
            );
        });

        // --- 主應用程式組件 ---
        const App = () => {
            const [orders, setOrders] = useState([]);
            const [activeView, setActiveView] = useState('dashboard');
            const [inventory, setInventory] = useState(INITIAL_INVENTORY);
            const [clients, setClients] = useState([]); // Client Data State
            const [transactions, setTransactions] = useState([]);
            const [settings, setSettings] = useState({ allowNegativeStock: true, showThumbnails: true });
            const [currentThemeId, setCurrentThemeId] = useState('light');
            
            const [searchTerm, setSearchTerm] = useState('');
            const [activeCategory, setActiveCategory] = useState('all');
            const [backupNote, setBackupNote] = useState(''); // 備份備註狀態
            const [exportOptions, setExportOptions] = useState({ inventory: true, orders: true, transactions: true, clients: true, settings: true });
            const [restoreData, setRestoreData] = useState(null);
            
            // UI State
            const [batchMode, setBatchMode] = useState('transaction'); // 'transaction' | 'order'
            const [batchInitialType, setBatchInitialType] = useState('in'); // 'in' | 'out'
            const [showBatchModal, setShowBatchModal] = useState(false);
            const [editingItem, setEditingItem] = useState(null);
            const [showSettingsModal, setShowSettingsModal] = useState(false);
            const [showHistoryModal, setShowHistoryModal] = useState(false);
            // 預覽圖片的 UI 狀態
            const [previewItem, setPreviewItem] = useState(null);
            // 新增物料 UI 狀態
            const [showAddModal, setShowAddModal] = useState(false);
            // 列印狀態 (用於按鈕回饋)
            const [isPrinting, setIsPrinting] = useState(false);
            const excelInputRef = useRef(null);
            const fileInputRef = useRef(null);
            
            const currentTheme = useMemo(() => THEMES.find(t => t.id === currentThemeId) || THEMES[0], [currentThemeId]);

            const categories = useMemo(() => ['all', ...Array.from(new Set(inventory.map(i => i.category)))], [inventory]);
            const filteredData = useMemo(() => inventory.filter(item => {
                const term = searchTerm.toLowerCase().trim();
                let matchesCategory = false;
                if (activeCategory === 'all') matchesCategory = true;
                else if (activeCategory === '缺貨') matchesCategory = item.stock <= 0;
                else matchesCategory = item.category === activeCategory;
                
                const stockNum = Number(item.stock);
                const minStockNum = Number(item.minStock);

                if (term === '缺貨' || term === '缺貨') return matchesCategory && stockNum <= 0;
                if (term === '低庫存') return matchesCategory && stockNum <= minStockNum;
                if (term === '負庫存') return matchesCategory && stockNum < 0;
                if (term === '充足') return matchesCategory && stockNum > minStockNum;

                const terms = term.split(/\s+/).filter(Boolean);
                const matchesSearch = terms.length === 0 || terms.every(t => 
                    String(item.name || '').toLowerCase().includes(t) || 
                    String(item.id || '').toLowerCase().includes(t) ||
                    (item.size && String(item.size).toLowerCase().includes(t)) ||
                    (item.material && String(item.material).toLowerCase().includes(t))
                );

                return matchesCategory && matchesSearch;
            }), [inventory, searchTerm, activeCategory]);

            // 資料持久化 (Local Storage)
            useEffect(() => {
                const savedOrders = localStorage.getItem('proims_orders');
                const savedInv = localStorage.getItem('proims_inventory');
                const savedTx = localStorage.getItem('proims_transactions');
                const savedSettings = localStorage.getItem('proims_settings');
                const savedTheme = localStorage.getItem('proims_theme');
                const savedClients = localStorage.getItem('proims_clients'); // Clients
                
                if (savedOrders) setOrders(JSON.parse(savedOrders) || []);
                if (savedInv) {
                    try {
                        const parsedInv = JSON.parse(savedInv) || [];
                        // 自動去重：使用 Map 以 ID 為鍵，後面的資料會覆蓋前面的，確保 ID 唯一
                        const uniqueInvMap = new Map();
                        parsedInv.forEach(item => {
                            if (item && item.id) uniqueInvMap.set(item.id, item);
                        });
                        setInventory(Array.from(uniqueInvMap.values()));
                    } catch (e) {
                        setInventory([]);
                    }
                }
                if (savedTx) setTransactions(JSON.parse(savedTx) || []);
                if (savedSettings) setSettings({ allowNegativeStock: true, showThumbnails: true, ...JSON.parse(savedSettings) });
                if (savedTheme) {
                    // 檢查儲存的主題 ID 是否仍然有效，否則使用預設值
                    const isValidTheme = THEMES.some(t => t.id === savedTheme);
                    setCurrentThemeId(isValidTheme ? savedTheme : 'light');
                }
                if (savedClients) setClients(JSON.parse(savedClients) || []);
            }, []);

            useEffect(() => {
                // 使用 Debounce 避免頻繁寫入導致卡頓
                const handler = setTimeout(() => {
                    localStorage.setItem('proims_orders', JSON.stringify(orders));
                    localStorage.setItem('proims_inventory', JSON.stringify(inventory));
                    localStorage.setItem('proims_transactions', JSON.stringify(transactions));
                    localStorage.setItem('proims_settings', JSON.stringify(settings));
                    localStorage.setItem('proims_theme', currentThemeId);
                    localStorage.setItem('proims_clients', JSON.stringify(clients));
                }, 500);
                
                return () => clearTimeout(handler);
            }, [inventory, transactions, settings, currentThemeId, clients]);

            const handleThemeChange = (id) => setCurrentThemeId(id);

            // Client Handlers
            // --- 新增功能：加入訂單 ---
            const handleAddToOrder = (itemId, qty, type = 'out') => {
                const targetItem = inventory.find(i => i.id === itemId);
                if (!targetItem) return;
                
                const newOrder = {
                    id: 'ORD-' + Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    status: 'pending', // 待處理
                    type: type, // 'in' 進貨單, 'out' 出貨單
                    items: [{
                        id: itemId,
                        name: targetItem.name,
                        qty: Math.abs(qty),
                        currentStock: targetItem.stock
                    }]
                };
                setOrders(prev => [newOrder, ...prev]);
                toast.success(`已加入${type === 'in' ? '進貨' : '出貨'}訂單`);
            };

            // --- 新增功能：執行訂單 (無視負庫存設定) ---
            const handleExecuteOrder = (orderId) => {
                const order = orders.find(o => o.id === orderId);
                if (!order) return;

                // 更新庫存
                const newInv = inventory.map(item => {
                    const orderItem = order.items.find(oi => oi.id === item.id);
                    if (orderItem) {
                        // 邏輯：如果是出貨(out)，就扣庫存；進貨(in)就加庫存
                        // ★★★ 關鍵：這裡完全不檢查 allowNegativeStock，直接執行 ★★★
                        const change = order.type === 'in' ? orderItem.qty : -orderItem.qty;
                        return { ...item, stock: item.stock + change };
                    }
                    return item;
                });

                setInventory(newInv);

                // 寫入異動紀錄
                const txType = order.type;
                const txItems = order.items.map(i => ({ name: i.name, qty: i.qty }));
                setTransactions(prev => [{ 
                    id: Date.now(), 
                    date: new Date().toISOString().split('T')[0], 
                    type: txType, 
                    items: txItems, 
                    target: '訂單執行 (' + orderId + ')' 
                }, ...prev]);

                // 更新訂單狀態為已完成
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed', executeDate: new Date().toISOString() } : o));
                toast.success('訂單執行完成！');
            };
            
            // 刪除訂單
            const handleDeleteOrder = (orderId) => {
                if(confirm('確定刪除此訂單？')) {
                    setOrders(prev => prev.filter(o => o.id !== orderId));
                }
            };
            const handleAddClient = (newClient) => {
                const client = { id: `C${Date.now()}`, ...newClient };
                setClients(prev => [...prev, client]);
            };

            const handleUpdateClient = (updatedClient) => {
                setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
            };

            const handleDeleteClient = (clientId) => {
                setClients(prev => prev.filter(c => c.id !== clientId));
            };

            const handleStockChange = useCallback((id, changeAmount, reason = '手動調整') => {
                const targetItem = inventory.find(i => i.id === id);
                if (!settings.allowNegativeStock && (targetItem.stock + changeAmount < 0)) { toast.error('操作失敗：系統設定不允許負庫存！'); return; }
                const newInv = inventory.map(item => item.id === id ? { ...item, stock: item.stock + changeAmount } : item);
                setInventory(newInv);
                setTransactions(prev => [{ id: Date.now(), date: new Date().toISOString().split('T')[0], type: changeAmount > 0 ? 'in' : 'out', items: [{ name: targetItem.name, qty: Math.abs(changeAmount) }], target: reason }, ...prev]);
            }, [inventory, settings.allowNegativeStock]);

            const handleBatchConfirm = (items, type, meta) => {
                // ★★★ 新增：如果是訂單模式，則建立訂單而不直接扣庫存 ★★★
                if (batchMode === 'order') {
                    const newOrder = {
                        id: 'ORD-' + Date.now(),
                        date: meta.date,
                        status: 'pending',
                        type: type,
                        items: items.map(i => ({
                            id: i.id,
                            name: i.name,
                            qty: i.addQty,
                            currentStock: i.stock
                        }))
                    };
                    setOrders(prev => [newOrder, ...prev]);
                    toast.success('訂單已建立');
                    setShowBatchModal(false);
                    return;
                }

                const newInv = [...inventory];
                items.forEach(batchItem => {
                    const idx = newInv.findIndex(i => i.id === batchItem.id);
                    if (idx > -1) {
                        const change = type === 'in' ? batchItem.addQty : -batchItem.addQty;
                        newInv[idx] = { ...newInv[idx], stock: newInv[idx].stock + change };
                    }
                });
                setInventory(newInv);
                setTransactions(prev => [{ id: Date.now(), date: meta.date, type: type, items: items.map(i => ({name: i.name, qty: i.addQty})), target: meta.target, amount: meta.amount }, ...prev]);
                toast.success('批量操作完成');
                setShowBatchModal(false);
            };

            const handleUpdateItem = async (updatedItem) => {
                // 1. 取得原始資料以比對差異
                const originalId = editingItem.id;
                const originalItem = inventory.find(i => i.id === originalId);
                
                if (!updatedItem.id || !updatedItem.id.trim()) {
                    toast.error("編號不能為空");
                    return;
                }

                // 檢查 ID 是否變更且是否重複
                if (updatedItem.id !== originalId) {
                    if (inventory.some(i => i.id === updatedItem.id)) {
                        toast.error(`錯誤：編號 "${updatedItem.id}" 已存在`);
                        return;
                    }
                }

                let finalItem = { 
                    ...updatedItem,
                    // ★★★ 修正1：確保數值型別正確 (避免字串串接錯誤) ★★★
                    stock: Number(updatedItem.stock),
                    minStock: Number(updatedItem.minStock),
                    price: Number(updatedItem.price)
                };

                // 若圖片為 Base64 (新上傳)，則儲存至硬碟
                if (updatedItem.image && updatedItem.image.startsWith('data:')) {
                    try {
                        const savedPath = await saveImageToDisk(updatedItem.image);
                        finalItem.image = savedPath;
                    } catch (e) {
                        console.error("儲存圖片失敗", e);
                        toast.error("儲存圖片失敗");
                        return;
                    }
                }

                // ★★★ 修正2：若庫存有變動，自動寫入異動紀錄 ★★★
                if (originalItem && finalItem.stock !== originalItem.stock) {
                    const diff = finalItem.stock - originalItem.stock;
                    setTransactions(prev => [{ 
                        id: Date.now(), 
                        date: new Date().toISOString().split('T')[0], 
                        type: diff > 0 ? 'in' : 'out', 
                        items: [{ name: finalItem.name, qty: Math.abs(diff) }], 
                        target: '編輯修正', 
                        amount: 0 
                    }, ...prev]);
                }

                setInventory(prev => prev.map(i => i.id === originalId ? finalItem : i));

                // 若 ID 有變更，同步更新訂單中的參照
                if (updatedItem.id !== originalId) {
                    setOrders(prev => prev.map(order => ({
                        ...order,
                        items: order.items.map(item => item.id === originalId ? { ...item, id: updatedItem.id } : item)
                    })));
                }

                setEditingItem(null);
                toast.success("物料已更新");
            };

            // ▼▼▼ 修正後的 handleAddNewItem (客製化版) ▼▼▼
            const handleAddNewItem = async (newItemData) => {
                // 1. 同步檢查 ID
                    // 1. 產生 ID (優先使用使用者手動輸入的 ID)
                    let newId = newItemData.id ? newItemData.id.trim() : '';

                    // 若使用者沒有手動輸入，則自動生成
                    if (!newId) {
                        if (newItemData.category) {
                            // 使用分類與規格碼產生
                            newId = generateNextId(newItemData.category, newItemData.code || Date.now().toString().slice(-4));
                        } else {
                            // 最終備案：使用時間戳記
                            newId = `I${Date.now()}`;
                        }
                    }

                    // 檢查 ID 是否重複 (避免覆蓋現有資料)
                    if (inventory.some(item => item.id === newId)) {
                        toast.error(`錯誤：物料編號 "${newId}" 已存在！`);
                        return null;
                    }

                const addItemPromise = async () => {
                    // 2. 處理圖片：如果有圖，先存入硬碟拿到檔名 (使用 newId 作為檔名)
                    let imagePath = newItemData.image;
                    if (newItemData.image && newItemData.image.startsWith('data:')) {
                        console.log('正在儲存圖片到硬碟...', newId);
                        // 呼叫工具並傳入 ID 作為檔名
                        imagePath = await saveImageToDisk(newItemData.image, newId);
                    }

                    // 3. 組合新資料
                    const newItem = { 
                        id: newId, 
                        ...newItemData, 
                        image: imagePath, // 這裡存的是檔名 (例如 174888.jpg)
                        
                        // 確保數值正確 (優先使用輸入的數值，沒有才用預設值)
                        stock: Number(newItemData.stock || 0), 
                        price: Number(newItemData.price || 0), 
                        minStock: Number(newItemData.minStock || 10), 
                        supplier: newItemData.supplier || '', 
                        location: newItemData.location || '',
                        
                        // 加入歷史紀錄 (讓庫存歷程能顯示)
                        history: [
                            {
                                date: new Date().toISOString(),
                                action: '建立',
                                amount: Number(newItemData.stock || 0),
                                balance: Number(newItemData.stock || 0),
                                note: '初始庫存'
                            }
                        ]
                    };

                    // 4. 更新狀態 (使用您原本的 setInventory)
                    setInventory(prev => [newItem, ...prev]);
                    
                    // ★★★ 修正3：新增物料時，若有初始庫存，寫入全域異動紀錄 ★★★
                    if (newItem.stock > 0) {
                        setTransactions(prev => [{ 
                            id: Date.now(), 
                            date: new Date().toISOString().split('T')[0], 
                            type: 'in', 
                            items: [{ name: newItem.name, qty: newItem.stock }], 
                            target: '初始庫存', 
                            amount: newItem.stock * newItem.price 
                        }, ...prev]);
                    }

                    return newItem;
                };

                return toast.promise(
                    addItemPromise(),
                    {
                        loading: '正在建立物料...',
                        success: '新增成功！',
                        error: '新增失敗，請重試。',
                    }
                ).catch(error => {
                    console.error("新增失敗:", error);
                    return null;
                });
            };
            // ▲▲▲ 取代結束 ▲▲▲
            
            // --- 新增功能：JSON 備份與還原 ---
            const handleExportBackup = () => {
                const exportTask = async () => {
                    const zip = new JSZip();
                    const backupData = {
                        version: '1.0',
                        date: new Date().toISOString(),
                        note: backupNote, // 將備註寫入備份檔
                    };

                    // 處理庫存圖片備份 (改為 ZIP 打包模式)
                    if (exportOptions.inventory) {
                        const imgFolder = zip.folder("images");
                        // 備份資料本身只保留檔名，不嵌入 Base64
                        backupData.inventory = inventory;

                        // 另外將圖片實體加入 ZIP
                        await Promise.all(inventory.map(async (item) => {
                            if (item.image && !item.image.startsWith('data:') && !item.image.includes('/')) {
                                try {
                                    const url = await loadImageFromDisk(item.image);
                                    if (url) {
                                        const res = await fetch(url);
                                        const blob = await res.blob();
                                        imgFolder.file(item.image, blob);
                                    }
                                } catch (e) {
                                    console.warn('備份圖片失敗:', newItem.name);
                                }
                            }
                        }));
                    }

                    if (exportOptions.orders) backupData.orders = orders;
                    if (exportOptions.transactions) backupData.transactions = transactions;
                    if (exportOptions.clients) backupData.clients = clients;
                    if (exportOptions.settings) { backupData.settings = settings; backupData.themeId = currentThemeId; }

                    // 將 JSON 資料加入 ZIP
                    zip.file("backup_data.json", JSON.stringify(backupData, null, 2));

                    // 產生 ZIP 檔案
                    const content = await zip.generateAsync({ type: "blob" });
                    
                    const now = new Date();
                    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
                    const noteSuffix = backupNote ? `_${backupNote.replace(/[\\/:*?"<>|]/g, '')}` : '';
                    
                    await saveFileToDevice(content, `IMS庫存備份${noteSuffix}_${timestamp}.zip`);
                };

                toast.promise(
                    exportTask(),
                    {
                        loading: '正在壓縮並匯出備份...',
                        success: (<b>備份已下載！<br/>格式為 ZIP 壓縮檔。</b>),
                        error: '匯出失敗',
                    }
                );
            };

            const handleImportBackup = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                
                const processFile = async () => {
                    try {
                        let data = null;
                        let imagesMap = new Map();

                        // 嘗試作為 ZIP 讀取
                        try {
                            const zip = await JSZip.loadAsync(file);
                            // 讀取 JSON 資料
                            const jsonFile = zip.file("backup_data.json");
                            if (jsonFile) {
                                const jsonStr = await jsonFile.async("string");
                                data = JSON.parse(jsonStr);
                                
                                // 準備圖片資料 (暫存於 Map 中，等待確認還原)
                                const imgFolder = zip.folder("images");
                                if (imgFolder) {
                                    const imageFiles = [];
                                    imgFolder.forEach((relativePath, file) => {
                                        imageFiles.push({ path: relativePath, file });
                                    });
                                    
                                    // 平行處理圖片轉換 (轉回 Base64 以便 saveImageToDisk 使用)
                                    await Promise.all(imageFiles.map(async ({ path, file }) => {
                                        const base64 = await file.async("base64");
                                        // 簡單判斷 mime type
                                        const ext = path.split('.').pop().toLowerCase();
                                        const mime = ext === 'png' ? 'image/png' : (ext === 'webp' ? 'image/webp' : 'image/jpeg');
                                        imagesMap.set(path, `data:${mime};base64,${base64}`);
                                    }));
                                }
                            }
                        } catch (e) {
                            // 如果不是 ZIP，嘗試作為舊版 JSON 讀取
                            const text = await file.text();
                            data = JSON.parse(text);
                        }

                        if (data) {
                            // 將圖片 Map 附加到資料物件上傳遞給還原函式
                            data.imagesMap = imagesMap;
                            setRestoreData(data);
                        } else {
                            throw new Error("無法讀取資料");
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('備份檔案格式錯誤或損毀');
                    }
                };
                
                processFile();
                event.target.value = ''; // 重置 input
            };

            const handleConfirmRestore = (selection) => {
                if (!restoreData) return;
                
                const restoreTask = async () => {
                    if (selection.inventory && restoreData.inventory) {
                        // 處理圖片還原
                        if (restoreData.imagesMap && restoreData.imagesMap.size > 0) {
                            await Promise.all(restoreData.inventory.map(async (item) => {
                                // 如果該物料有圖片檔名，且該圖片存在於 ZIP 中
                                if (item.image && restoreData.imagesMap.has(item.image)) {
                                    try {
                                        const base64Data = restoreData.imagesMap.get(item.image);
                                        // 寫入平板硬碟 (IndexedDB/OPFS)
                                        await saveImageToDisk(base64Data, item.id);
                                    } catch (e) {
                                        console.warn("還原圖片失敗", item.name);
                                    }
                                }
                            }));
                        }
                        
                        // 舊版相容：如果 JSON 內直接包含 Base64 (舊備份檔)，也嘗試寫入
                        const finalInventory = await Promise.all(restoreData.inventory.map(async (item) => {
                            if (item.image && item.image.startsWith('data:')) {
                                try {
                                    const savedPath = await saveImageToDisk(item.image, item.id);
                                    return { ...item, image: savedPath };
                                } catch (e) { return item; }
                            }
                            return item;
                        }));

                        setInventory(finalInventory);
                    }
                    
                    if (selection.orders && restoreData.orders) setOrders(restoreData.orders);
                    if (selection.transactions && restoreData.transactions) setTransactions(restoreData.transactions);
                    if (selection.clients && restoreData.clients) setClients(restoreData.clients);
                    if (selection.settings) { if (restoreData.settings) setSettings(restoreData.settings); if (restoreData.themeId) setCurrentThemeId(restoreData.themeId); }
                    setRestoreData(null);
                };

                toast.promise(
                    restoreTask(),
                    {
                        loading: '正在還原資料與圖片...',
                        success: '系統還原成功！',
                        error: '還原失敗',
                    }
                );
            };

            // --- 新增功能：刪除物料 ---
            const handleDeleteItem = (itemId) => {
                if (confirm('確定要刪除此物料嗎？\n\n⚠️ 此操作無法復原！')) {
                    setInventory(prev => prev.filter(i => i.id !== itemId));
                    setEditingItem(null);
                    // 記錄刪除操作
                    const targetItem = inventory.find(i => i.id === itemId);
                    setTransactions(prev => [{ id: Date.now(), date: new Date().toISOString().split('T')[0], type: 'out', items: [{ name: targetItem?.name || itemId, qty: 0 }], target: '系統刪除', amount: 0 }, ...prev]);
                    toast.success('物料已刪除');
                }
            };

            // --- 新增功能：Excel 匯入 ---
            const handleExcelImportClick = () => {
                excelInputRef.current?.click();
            };

            const handleExcelFileChange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (evt) => {
                    try {
                        const data = new Uint8Array(evt.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);

                        if (!jsonData || jsonData.length === 0) {
                            toast.error('檔案內容為空或格式不正確');
                            return;
                        }

                        let importCount = 0;
                        let updateCount = 0;

                        setInventory(prev => {
                            const newInventory = [...prev];
                            const idMap = new Map(newInventory.map((item, index) => [item.id, index]));

                            jsonData.forEach(row => {
                                // 欄位對應 (支援中文與英文欄位名)
                                const name = row['品名'] || row['Name'] || row['name'];
                                if (!name) return; // 略過無品名資料

                                const category = row['分類'] || row['Category'] || row['category'] || '未分類';
                                // 嘗試取得 ID，若無則自動產生
                                let id = row['編號'] || row['ID'] || row['id'];
                                if (!id) {
                                    id = generateNextId(category, Date.now().toString().slice(-4) + Math.floor(Math.random() * 100));
                                }
                                id = String(id).trim();

                                const newItem = {
                                    id: id,
                                    name: String(name).trim(),
                                    category: String(category).trim(),
                                    size: String(row['規格'] || row['Size'] || row['size'] || ''),
                                    material: String(row['材質'] || row['Material'] || row['material'] || ''),
                                    stock: Number(row['庫存'] || row['Stock'] || row['stock'] || 0),
                                    minStock: Number(row['安全庫存'] || row['MinStock'] || row['min_stock'] || 10),
                                    price: Number(row['單價'] || row['Price'] || row['price'] || 0),
                                    location: String(row['儲位'] || row['Location'] || row['location'] || ''),
                                    image: null, // 匯入不處理圖片
                                    history: []
                                };

                                if (idMap.has(id)) {
                                    // 更新現有物料
                                    const index = idMap.get(id);
                                    newItem.image = newInventory[index].image; // 保留原圖
                                    newItem.history = newInventory[index].history; // 保留歷史
                                    newInventory[index] = { ...newInventory[index], ...newItem };
                                    updateCount++;
                                } else {
                                    // 新增物料
                                    newItem.history = [{
                                        date: new Date().toISOString(),
                                        action: '匯入',
                                        amount: newItem.stock,
                                        balance: newItem.stock,
                                        note: 'Excel 匯入'
                                    }];
                                    newInventory.push(newItem);
                                    // ★★★ 修正：新增後立即更新 Map，防止同批次匯入重複 ID ★★★
                                    idMap.set(id, newInventory.length - 1);
                                    importCount++;
                                }
                            });
                            return newInventory;
                        });
                        toast.success(`匯入完成！\n新增: ${importCount} 筆\n更新: ${updateCount} 筆`, { duration: 5000 });
                    } catch (error) {
                        console.error("Excel Import Error:", error);
                        toast.error("匯入失敗：請確認檔案是否為有效的 Excel (.xlsx/.xls) 或 CSV 格式。");
                    }
                };
                reader.readAsArrayBuffer(file);
                e.target.value = ''; // 清空 input 以便重複選取同檔
            };

            // 2. UI 邏輯：負責處理 Modal 的確認按鈕
            const handleCreateNewItem = (itemData) => {
                handleAddNewItem(itemData); // 呼叫上面的核心邏輯
                setShowAddModal(false);     // 關閉視窗
                setSearchTerm('');          // 清空搜尋，讓使用者看到新物料
                if (itemData.category) setActiveCategory(itemData.category); // 切換到該分類
            };

            const handleClearHistory = () => {
                if (window.confirm('確定要清空所有歷史紀錄嗎？')) {
                    setTransactions([]);
                }
            };

            // 包裝 printReport 以處理 Loading 狀態
            const handlePrintReport = async (data, title, type) => {
                setIsPrinting(true);
                try {
                    await printReport(data, title, type);
                } catch (e) {
                    console.error("Print error:", e);
                } finally {
                    setIsPrinting(false);
                }
            };

            // 將函式掛載到 window 以便 Modal 使用
            window.appExportCSV = exportToCSV;
            window.appPrintReport = handlePrintReport;

            const lowStockCount = useMemo(() => inventory.filter(i => {
                const stock = Number(i.stock);
                const min = Number(i.minStock);
                return stock <= min;
            }).length, [inventory]);

            return (
                <ThemeContext.Provider value={{ theme: currentTheme }}>
                    <Toaster 
                        position="top-center"
                        toastOptions={{
                            className: currentTheme.type === 'dark' ? '!bg-slate-800 !text-white !border !border-slate-700' : '!bg-white !text-slate-800 !border !border-slate-100',
                            style: {
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            },
                            success: {
                                iconTheme: {
                                    primary: currentTheme.type === 'dark' ? '#34d399' : '#10b981',
                                    secondary: currentTheme.type === 'dark' ? '#0f172a' : 'white',
                                },
                            },
                        }}
                    />
                    <div className={`h-screen w-screen flex ${currentTheme.colors.appBg} overflow-hidden font-sans transition-colors duration-300`}>
                        {/* 側邊欄 */}
                        <div className={`hidden md:flex w-20 ${currentTheme.colors.sidebarBg} flex-col items-center py-8 space-y-8 z-20 shadow-2xl transition-colors duration-300`}>
                            <div className={`p-3 rounded-2xl text-white shadow-lg ${currentTheme.type === 'dark' ? 'bg-white/10' : 'bg-white/20'}`}><Package className="w-8 h-8" /></div>
                            <div className="flex-1 w-full flex flex-col items-center space-y-6">
                                <button onClick={() => setActiveView('dashboard')} className={`p-4 rounded-2xl backdrop-blur-sm btn-touch transition-all transform ${activeView === 'dashboard' ? 'text-white bg-white/20 scale-110 shadow-md' : 'text-white/50 active:text-white active:bg-white/5 active:scale-95'}`} title="庫存儀表板"><LayoutDashboard className="w-6 h-6"/></button>
                                <button onClick={() => setActiveView('orders')} className={`p-4 rounded-2xl backdrop-blur-sm btn-touch transition-all transform ${activeView === 'orders' ? 'text-white bg-white/20 scale-110 shadow-md' : 'text-white/50 active:text-white active:bg-white/5 active:scale-95'}`} title="訂單管理"><ClipboardList className="w-6 h-6"/></button>
                                <button onClick={() => setActiveView('clients')} className={`p-4 rounded-2xl backdrop-blur-sm btn-touch transition-all transform ${activeView === 'clients' ? 'text-white bg-white/20 scale-110 shadow-md' : 'text-white/50 active:text-white active:bg-white/5 active:scale-95'}`} title="客戶管理"><Briefcase className="w-6 h-6"/></button>
                                <button onClick={() => setActiveView('backup')} className={`p-4 rounded-2xl backdrop-blur-sm btn-touch transition-all transform ${activeView === 'backup' ? 'text-white bg-white/20 scale-110 shadow-md' : 'text-white/50 active:text-white active:bg-white/5 active:scale-95'}`} title="資料備份"><Database className="w-6 h-6"/></button>
                                <button onClick={() => setShowSettingsModal(true)} className="p-4 text-white/50 active:text-white active:bg-white/5 rounded-2xl transition-all transform btn-touch active:scale-95" title="設定"><Settings className="w-6 h-6"/></button>
                            </div>
                        </div>

                        {/* 主內容區 */}
                        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                            <AnimatePresence mode="wait">
                            {activeView === 'dashboard' && (
                                <motion.div 
                                    key="dashboard"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 flex flex-col h-full overflow-hidden"
                                >
                                    {/* 頂部導航 (Header) */}
                                    <header className={`${currentTheme.colors.panelBg} border-b ${currentTheme.colors.border} px-8 py-5 flex justify-between items-center z-10 shadow-sm transition-colors duration-300`}>
                                        <div>
                                            <h1 className={`text-2xl font-extrabold ${currentTheme.colors.textMain} tracking-tight`}>庫存管理儀表板</h1>
                                            <p className={`text-xs ${currentTheme.colors.textSub} mt-1 font-medium`}>原彩IMS系統 v5.3</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {/* 1. 異動歷程按鈕 */}
                                            <button onClick={() => setShowHistoryModal(true)} className={`${currentTheme.colors.panelBg} border ${currentTheme.colors.border} ${currentTheme.colors.textSub} px-4 py-3 rounded-xl text-sm font-bold flex items-center active:bg-black/5 dark:active:bg-white/5 transition-all shadow-sm btn-touch`} title="查看異動紀錄">
                                                <History className={`w-5 h-5 md:mr-2 ${currentTheme.colors.accent}`} /> <span className="hidden md:inline">異動歷程</span>
                                            </button>
                                            
                                            {/* 2. (新加入) 新增物料按鈕 */}
                                            <button onClick={() => setShowAddModal(true)} className={`${currentTheme.colors.panelBg} border ${currentTheme.colors.border} ${currentTheme.colors.textMain} px-4 py-3 rounded-xl text-sm font-bold flex items-center active:bg-black/5 dark:active:bg-white/5 transition-all shadow-sm btn-touch`}>
                                                <Plus className="w-5 h-5 md:mr-2 text-green-600" /> <span className="hidden md:inline">新增物料</span>
                                            </button>

                                            {/* 3. 入庫作業按鈕 (原進貨作業) */}
                                            <button onClick={() => { setBatchMode('transaction'); setBatchInitialType('in'); setShowBatchModal(true); }} className={`${currentTheme.colors.primary} ${currentTheme.colors.primaryText} px-6 py-3 rounded-xl text-sm font-bold flex items-center active:opacity-90 transition-all shadow-lg active:shadow-xl active:-translate-y-0.5 btn-touch`}>
                                                <ArrowRightLeft className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">入庫作業</span>
                                            </button>

                                            {/* 4. 出庫作業按鈕 */}
                                            <button onClick={() => { setBatchMode('transaction'); setBatchInitialType('out'); setShowBatchModal(true); }} className={`bg-rose-500 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center active:bg-rose-600 transition-all shadow-lg active:shadow-xl active:-translate-y-0.5 btn-touch`}>
                                                <FileUp className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">出庫作業</span>
                                            </button>
                                        </div>
                                    </header>
                                    {/* 可捲動區域 */}
                                    <div className="flex-1 overflow-y-auto scroller p-6 md:p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Card 
                                                title="總品項數" 
                                                value={inventory.length} 
                                                icon={Package} 
                                                subtext="系統登錄物料總數" 
                                                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                                            />
                                            <Card 
                                                title="低庫存警示" 
                                                value={lowStockCount} 
                                                icon={AlertTriangle} 
                                                subtext="低於安全庫存水位" 
                                                onClick={() => { setSearchTerm(''); setActiveCategory('缺貨'); }}
                                            />
                                            <Card title="異動歷程" value={transactions.length} icon={History} subtext="點擊查看近期紀錄" onClick={() => setShowHistoryModal(true)} />
                                        </div>

                                        {/* 庫存列表區塊 */}
                                        <div className={`${currentTheme.colors.panelBg} rounded-3xl shadow-sm border ${currentTheme.colors.border} flex flex-col min-h-[600px] overflow-hidden transition-colors duration-300`}>
                                            <div className={`p-6 border-b ${currentTheme.colors.border} flex flex-col xl:flex-row justify-between gap-5 items-start xl:items-center`}>
                                                {/* 左側：分類篩選 */}
                                                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full xl:w-auto pb-1">
                                                    {categories.slice(0, 6).map(c => (
                                                        <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap border ${activeCategory === c ? `${currentTheme.colors.sidebarBg} text-white shadow-md` : `${currentTheme.colors.panelBg} ${currentTheme.colors.textSub} ${currentTheme.colors.border} active:bg-black/5 dark:active:bg-white/5`}`}>{c === 'all' ? '全部' : c}</button>
                                                    ))}
                                                    <div className={`w-px h-6 ${currentTheme.colors.border} border-l mx-1`}></div>
                                                    <button onClick={() => setActiveCategory('缺貨')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center border ${activeCategory === '缺貨' ? 'bg-red-600 text-white border-red-600 shadow-md' : `${currentTheme.colors.panelBg} ${currentTheme.colors.border} text-red-500 active:bg-red-50`}`}><XCircle className="w-4 h-4 mr-1.5" /> 缺貨</button>
                                                </div>
                                                
                                                {/* 右側：搜尋與匯出功能 */}
                                                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                                                    <div className="relative flex-1 md:w-64">
                                                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${currentTheme.colors.textSub}`} />
                                                        <input type="text" placeholder="搜尋品名、編號..." className={`w-full pl-10 pr-4 py-2.5 ${currentTheme.colors.appBg} border ${currentTheme.colors.border} rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${currentTheme.colors.textMain}`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                                    </div>
                                                    
                                                    {/* --- 新增：匯出按鈕組 --- */}
                                                    <div className="flex space-x-2">
                                                        <input type="file" ref={excelInputRef} onChange={handleExcelFileChange} accept=".xlsx, .xls, .csv" className="hidden" />
                                                        <button 
                                                            onClick={handleExcelImportClick}
                                                            className={`px-4 py-2.5 ${currentTheme.colors.panelBg} border ${currentTheme.colors.border} ${currentTheme.colors.textMain} rounded-xl text-sm font-bold shadow-sm active:bg-blue-50 active:text-blue-600 active:border-blue-200 transition-all flex items-center whitespace-nowrap`}
                                                            title="匯入 Excel"
                                                        >
                                                            <Upload className="w-4 h-4 mr-2" /> 匯入
                                                        </button>
                                                        <button 
                                                            onClick={() => exportToCSV(filteredData, '庫存清單', 'inventory')}
                                                            className={`px-4 py-2.5 ${currentTheme.colors.panelBg} border ${currentTheme.colors.border} ${currentTheme.colors.textMain} rounded-xl text-sm font-bold shadow-sm active:bg-green-50 active:text-green-600 active:border-green-200 transition-all flex items-center whitespace-nowrap`}
                                                            title="匯出 Excel (.csv)"
                                                        >
                                                            <FileDown className="w-4 h-4 mr-2" /> Excel
                                                        </button>
                                                        <button 
                                                            onClick={() => !isPrinting && handlePrintReport(filteredData, '庫存盤點報表', 'inventory')}
                                                            disabled={isPrinting}
                                                            className={`px-4 py-2.5 border rounded-xl text-sm font-bold shadow-sm transition-all flex items-center whitespace-nowrap ${
                                                                isPrinting 
                                                                    ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-wait' 
                                                                    : `${currentTheme.colors.panelBg} ${currentTheme.colors.border} ${currentTheme.colors.textMain} active:bg-blue-50 active:text-blue-600 active:border-blue-200`
                                                            }`}
                                                            title="列印或另存 PDF"
                                                        >
                                                            {isPrinting ? (
                                                                <>
                                                                    {/* 轉圈圈動畫圖示 */}
                                                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2"></div> 
                                                                    <span>處理中...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {/* 原本的印表機圖示 */}
                                                                    <Printer className="w-4 h-4 mr-2" /> 
                                                                    <span>列印/PDF</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    {/* ----------------------- */}
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-auto scroller">
                                                <table className="w-full text-left border-collapse">
                                                    <thead className={`${currentTheme.colors.appBg} sticky top-0 z-10 backdrop-blur-sm border-b ${currentTheme.colors.border}`}>
                                                        <tr>
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider`}>狀態</th>
                                                            {settings.showThumbnails && <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider`}>圖片</th>}
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider`}>編號/品名</th>
                                                            <th className={`hidden lg:table-cell px-6 py-4 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider`}>規格/材質</th>
                                                            <th className={`hidden lg:table-cell px-6 py-4 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-right`}>單價</th>
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-right`}>庫存量</th>
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-center`}>快速調整</th>
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-center`}>操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`divide-y ${currentTheme.type === 'dark' ? 'divide-gray-700' : 'divide-slate-100'}`}>
                                                        {filteredData.map(item => (
                                                            <InventoryRow 
                                                                key={item.id} 
                                                                item={item} 
                                                                settings={settings} 
                                                                currentTheme={currentTheme} 
                                                                setPreviewItem={setPreviewItem} 
                                                                handleStockChange={handleStockChange} 
                                                                setEditingItem={setEditingItem} 
                                                            />
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {filteredData.length === 0 && (
                                                    <div className="p-16 text-center">
                                                        <div className={`w-24 h-24 ${currentTheme.colors.appBg} rounded-full flex items-center justify-center mx-auto mb-4 opacity-50`}><Search className={`w-10 h-10 ${currentTheme.colors.textSub}`}/></div>
                                                        <p className={`${currentTheme.colors.textSub} font-medium`}>找不到符合的物料</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`p-4 border-t ${currentTheme.colors.border} ${currentTheme.colors.appBg} text-xs font-medium ${currentTheme.colors.textSub} text-center`}>顯示 {filteredData.length} 筆資料</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'clients' && (
                                <motion.div 
                                    key="clients"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 flex flex-col h-full overflow-hidden"
                                >
                                    <ClientManager clients={clients} onAdd={handleAddClient} onUpdate={handleUpdateClient} onDelete={handleDeleteClient} />
                                </motion.div>
                            )}

                            {activeView === 'orders' && (
                                <motion.div 
                                    key="orders"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 flex flex-col h-full overflow-hidden"
                                >
                                    <div className={`px-8 py-5 border-b ${currentTheme.colors.border} flex justify-between items-center ${currentTheme.colors.panelBg} shadow-sm`}>
                                        <div>
                                            <h1 className={`text-2xl font-extrabold ${currentTheme.colors.textMain} tracking-tight`}>訂單管理</h1>
                                            <p className={`text-xs ${currentTheme.colors.textSub} mt-1 font-medium`}>檢視與執行進出貨訂單</p>
                                        </div>
                                        <button onClick={() => { setBatchMode('order'); setShowBatchModal(true); }} className={`${currentTheme.colors.primary} ${currentTheme.colors.primaryText} px-6 py-3 rounded-xl text-sm font-bold flex items-center active:opacity-90 transition-all shadow-lg active:shadow-xl active:-translate-y-0.5 btn-touch`}>
                                            <Plus className="w-5 h-5 mr-2" /> 新增訂單
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto scroller p-6 md:p-8">
                                        <OrderManager orders={orders} onExecute={handleExecuteOrder} onDelete={handleDeleteOrder} />
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'backup' && (
                                <motion.div 
                                    key="backup"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 flex flex-col h-full overflow-hidden"
                                >
                                    <div className={`px-8 py-5 border-b ${currentTheme.colors.border} flex justify-between items-center ${currentTheme.colors.panelBg} shadow-sm`}>
                                        <div>
                                            <h1 className={`text-2xl font-extrabold ${currentTheme.colors.textMain} tracking-tight`}>資料備份與還原</h1>
                                            <p className={`text-xs ${currentTheme.colors.textSub} mt-1 font-medium`}>匯出完整系統數據或從備份檔還原</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto scroller p-6 md:p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
                                            {/* 匯出區塊 */}
                                            <div className={`${currentTheme.colors.panelBg} p-8 rounded-3xl border ${currentTheme.colors.border} shadow-sm flex flex-col items-center text-center space-y-6 active:shadow-md transition-all`}>
                                                <div className={`p-6 rounded-full ${currentTheme.colors.appBg} mb-2`}>
                                                    <FileDown className={`w-12 h-12 ${currentTheme.colors.primaryText === 'text-white' ? 'text-blue-500' : currentTheme.colors.primaryText}`} />
                                                </div>
                                                <h3 className={`text-xl font-bold ${currentTheme.colors.textMain}`}>匯出備份 (JSON)</h3>
                                                <p className={`${currentTheme.colors.textSub} text-sm max-w-xs`}>將所有庫存、訂單、客戶及設定資料打包成一個 JSON 檔案下載。</p>
                                                <div className="w-full text-left">
                                                    <label className={`block text-xs font-bold ${currentTheme.colors.textSub} mb-1 ml-1`}>備份備註 (選填)</label>
                                                    <input 
                                                        type="text" 
                                                        value={backupNote} 
                                                        onChange={e => setBackupNote(e.target.value)} 
                                                        placeholder="例如：盤點前備份..." 
                                                        className={`w-full px-4 py-2 border ${currentTheme.colors.border} rounded-xl text-sm ${currentTheme.colors.inputBg} ${currentTheme.colors.textMain} focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`} 
                                                    />
                                                </div>
                                                <div className="w-full grid grid-cols-2 gap-2 text-left">
                                                    {['inventory:物料庫存', 'orders:訂單紀錄', 'transactions:出入庫紀錄', 'clients:客戶資料', 'settings:系統設定'].map(opt => {
                                                        const [key, label] = opt.split(':');
                                                        return <label key={key} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={exportOptions[key]} onChange={() => setExportOptions(p => ({...p, [key]: !p[key]}))} className="rounded text-blue-600 focus:ring-blue-500" /><span className={`text-sm ${currentTheme.colors.textMain}`}>{label}</span></label>;
                                                    })}
                                                </div>
                                                <button onClick={handleExportBackup} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg btn-touch ${currentTheme.colors.primary} active:opacity-90`}>
                                                    下載備份檔案
                                                </button>
                                            </div>

                                            {/* 還原區塊 */}
                                            <div className={`${currentTheme.colors.panelBg} p-8 rounded-3xl border ${currentTheme.colors.border} shadow-sm flex flex-col items-center text-center space-y-6 active:shadow-md transition-all`}>
                                                <div className={`p-6 rounded-full ${currentTheme.colors.appBg} mb-2`}>
                                                    <Upload className="w-12 h-12 text-rose-500" />
                                                </div>
                                                <h3 className={`text-xl font-bold ${currentTheme.colors.textMain}`}>還原數據</h3>
                                                <p className={`${currentTheme.colors.textSub} text-sm max-w-xs`}>選取先前的備份檔案 (.json) 進行還原。注意：此操作將覆蓋現有資料。</p>
                                                <input type="file" ref={fileInputRef} onChange={handleImportBackup} className="hidden" />
                                                <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 rounded-xl font-bold text-white bg-rose-500 shadow-lg active:bg-rose-600 btn-touch">
                                                    選取檔案並還原
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </main>

                        <BatchTransactionModal 
                            isOpen={showBatchModal} 
                            onClose={() => setShowBatchModal(false)} 
                            inventory={inventory} 
                            onConfirm={handleBatchConfirm} 
                            onAddNewItem={handleAddNewItem} 
                            categories={categories} 
                            allowNegativeStock={settings.allowNegativeStock} 
                            mode={batchMode} 
                            initialType={batchInitialType}
                        />
                        {/* --- 修改開始：傳遞分類與材質清單給視窗 --- */}
                        <EditItemModal 
                            isOpen={!!editingItem} 
                            onClose={() => setEditingItem(null)} 
                            item={editingItem} 
                            onSave={handleUpdateItem} 
                            onDelete={handleDeleteItem}
                            categories={categories} // 傳入分類
                            // 即時計算不重複的材質列表
                            materials={Array.from(new Set(inventory.map(i => i.material).filter(Boolean)))}
                            transactions={transactions}
                            inventoryList={filteredData} // 傳入目前的篩選列表
                            onItemChange={setEditingItem} // 允許 Modal 切換物料
                        />
                        
                        <AddItemModal 
                            isOpen={showAddModal} 
                            onClose={() => setShowAddModal(false)} 
                            onSave={handleCreateNewItem} 
                            categories={categories} // 傳入分類
                            generateNextId={generateNextId} // 傳入 ID 產生器供 Modal 使用
                            // 即時計算不重複的材質列表
                            materials={Array.from(new Set(inventory.map(i => i.material).filter(Boolean)))}
                        />
                        {/* --- 修改結束 --- */}
                        {/* 補回：設定視窗 */}
                        <SettingsModal 
                            isOpen={showSettingsModal} 
                            onClose={() => setShowSettingsModal(false)} 
                            settings={settings} 
                            onUpdateSettings={setSettings} 
                            currentThemeId={currentThemeId} 
                            onThemeChange={handleThemeChange} 
                        />

                        {/* 補回：異動歷程視窗 */}
                        <TransactionHistoryModal 
                            isOpen={showHistoryModal} 
                            onClose={() => setShowHistoryModal(false)} 
                            transactions={transactions} 
                            onClear={handleClearHistory} 
                        />
                        {/* 還原選擇視窗 */}
                        {restoreData && <RestoreModal data={restoreData} onClose={() => setRestoreData(null)} onConfirm={handleConfirmRestore} />}
                        {/* 顯示圖片預覽的 Modal */}
                        <ImagePreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
                    </div>
                </ThemeContext.Provider>
            );
        };
        export default App;