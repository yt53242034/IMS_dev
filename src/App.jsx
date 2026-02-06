import { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import html2pdf from 'html2pdf.js';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { saveImageToDisk, loadImageFromDisk } from './utils/imageHandler';
import { ThemeContext, THEMES } from './contexts/ThemeContext';
import { Icons } from './components/Icons';
import { compressImage } from './utils/imageTools';
import InventoryListItem from './components/InventoryListItem';
import SettingsModal from './components/modals/SettingsModal';
import ImagePreviewModal from './components/modals/ImagePreviewModal';
import TransactionHistoryModal from './components/modals/TransactionHistoryModal';
import EditItemModal from './components/modals/EditItemModal';
import AddItemModal from './components/modals/AddItemModal';
import BatchTransactionModal from './components/modals/BatchTransactionModal';
import ClientManager from './components/ClientManager';
import OrderManager from './components/OrderManager';

// ▼▼▼ 下面接著貼上您的舊代碼 ▼▼▼
        const { 
            FileDown, Printer, ClipboardList,
            LayoutDashboard, Package, ArrowRightLeft, History, Settings, Search, Filter, 
            Plus, Minus, AlertTriangle, CheckCircle2, XCircle, X, Sparkles, Pencil, Save, 
            Trash2, Check, Calendar, Users, DollarSign, ArrowLeft, RefreshCw, AlertCircle, Info, List,
            ToggleLeft, ToggleRight, Palette, Briefcase, Phone, Mail, MapPin, UserPlus, Hash
        } = Icons;

        // --- 數據定義 ---
        const RAW_MATERIALS = [
            { name: "16不鏽鋼頂壓式無孔直接(快接)", size: "16mm", material: "304不鏽鋼" },
            { name: "16不鏽鋼頂壓式彎頭(快接)", size: "16mm", material: "304不鏽鋼" },
            { name: "16不鏽鋼頂壓式三通(快接)", size: "16mm", material: "304不鏽鋼" },
            { name: "16不鏽鋼頂壓式末端(快接)", size: "16mm", material: "304不鏽鋼" },
            { name: "16電鍍無孔直接(快接)", size: "16mm", material: "銅鍍鎳" },
            { name: "16電鍍彎頭(快接)", size: "16mm", material: "銅鍍鎳" },
            { name: "16電鍍三通(快接)", size: "16mm", material: "銅鍍鎳" },
            { name: "16電鍍無孔末端(快接)", size: "16mm", material: "銅鍍鎳" },
            { name: "三分電鍍無孔直接(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍直接單孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍直接雙孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍直接雙孔噴座120°(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍直接1/8單孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍直接1/8雙孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端無孔(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端單孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端雙孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端雙孔噴座120°(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端四孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端1/8彎頭噴座 (快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端1/8頂部噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端1/8雙孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍末端1/8 Y型雙孔噴座(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍1/4閥接(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍閥門(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍三通(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍四通(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "三分電鍍彎頭(快接)", size: "9.52mm", material: "銅鍍鎳" },
            { name: "2分外牙閥接(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分三孔蘑菇頭末端(卡接)", size: "9.52mm", material: "銅" },
            { name: "1/8內牙直接單孔末端(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分單孔末端(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分120°雙孔直接(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分180°雙孔末端(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分單孔直接(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分180°雙孔直接(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分無孔直接(卡接)", size: "9.52mm", material: "銅" },
            { name: "1/8內牙三通(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分彎頭(卡接)", size: "9.52mm", material: "銅" },
            { name: "1/8內牙彎頭(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分三通(卡接)", size: "9.52mm", material: "銅" },
            { name: "1/8末端雙噴座(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分末端(卡接)", size: "9.52mm", material: "銅" },
            { name: "3分四通(卡接)", size: "9.52mm", material: "銅" },
            { name: "1/4雙內牙球閥", size: "9.52mm", material: "銅" },
            { name: "2分內外牙球閥", size: "9.52mm", material: "銅" },
            { name: "3分無孔直接(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分直接單孔噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分直接雙孔噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分直接雙孔噴座120°(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分無孔末端(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分末端單孔噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分末端雙孔噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分末端雙孔噴座120°(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分末端頂部噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分直接1/8單孔噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分末端1/8彎頭噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分末端1/8頂部噴座(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分彎頭 (卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分三通 (卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分四通 (卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "1/4閥接(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "3分閥門(卡接)", size: "9.52mm", material: "304不鏽鋼" },
            { name: "4分-2分直接(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分-3分直接(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分-4分直接(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分-2分彎頭(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分-3分彎頭(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分-4分彎頭(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分直接(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分彎頭(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分三通(卡接)", size: "20.3mm", material: "304不鏽鋼" },
            { name: "4分-6mm直接(卡接)", size: "20.3mm", material: "銅" },
            { name: "4分-8mm直接(卡接)", size: "20.3mm", material: "銅" },
            { name: "4分-10mm直接(卡接)", size: "20.3mm", material: "銅" },
            { name: "4分-12mm直接(卡接)", size: "20.3mm", material: "銅" },
            { name: "4分-6mm彎頭(卡接)", size: "20.3mm", material: "銅" },
            { name: "4分-8mm彎頭(卡接)", size: "20.3mm", material: "銅" },
            { name: "4分-10mm彎頭(卡接)", size: "20.3mm", material: "銅" },
            { name: "4分-12mm彎頭(卡接)", size: "20.3mm", material: "銅" },
            { name: "16彎頭(卡接)", size: "16mm", material: "304不銹鋼" },
            { name: "16三通(卡接)", size: "16mm", material: "304不銹鋼" },
            { name: "16三通(卡接)", size: "16mm", material: "銅鍍鎳" },
            { name: "16彎頭(卡接)", size: "16mm", material: "銅" },
            { name: "六角內外牙補心(3分-2分)", size: "11.5mm", material: "304不鏽鋼" },
            { name: "六角內外牙補心(4分-1分)", size: "8.7mm", material: "304不鏽鋼" },
            { name: "六角內外牙補心(4分-2分)", size: "11.5mm", material: "304不鏽鋼" },
            { name: "六角內外牙補心(4分-3分)", size: "15.3mm", material: "304不鏽鋼" },
            { name: "六角內外牙補心(6分-4分)", size: "18.5mm", material: "304不鏽鋼" },
            { name: "八角內外牙補心(1寸-4分)", size: "18.5mm", material: "304不鏽鋼" },
            { name: "八角內外牙補心(1寸-6分)", size: "24.3mm", material: "304不鏽鋼" },
            { name: "八角內外牙補心(1.2寸-1寸)", size: "30mm", material: "304不鏽鋼" },
            { name: "八角內外牙補心(1.5寸-1寸)", size: "30mm", material: "304不鏽鋼" },
            { name: "八角內外牙補心(2寸-1寸)", size: "30mm", material: "304不鏽鋼" },
            { name: "外牙末端(1分)", size: "15mm", material: "304不鏽鋼" },
            { name: "外牙末端(2分)", size: "20.5mm", material: "304不鏽鋼" },
            { name: "外牙末端(3分)", size: "21.5mm", material: "304不鏽鋼" },
            { name: "外牙末端(4分)", size: "24.5mm", material: "304不鏽鋼" },
            { name: "外牙末端(6分)", size: "26.5mm", material: "304不鏽鋼" },
            { name: "外牙末端(1寸)", size: "29.5mm", material: "304不鏽鋼" },
            { name: "立布(2分轉1分)", size: "30.5mm", material: "304不鏽鋼" },
            { name: "立布(3分轉2分)", size: "35mm", material: "304不鏽鋼" },
            { name: "立布(4分轉2分)", size: "38mm", material: "304不鏽鋼" },
            { name: "立布(4分轉3分)", size: "39mm", material: "304不鏽鋼" },
            { name: "立布(6分轉4分)", size: "43mm", material: "304不鏽鋼" },
            { name: "立布(1寸轉4分)", size: "46mm", material: "304不鏽鋼" },
            { name: "立布(4分)", size: "41mm", material: "304不鏽鋼" },
            { name: "立布(6分)", size: "44mm", material: "304不鏽鋼" },
            { name: "立布(1吋)", size: "49mm", material: "304不鏽鋼" },
            { name: "內牙三通（1分）", size: "8.7mm", material: "304不鏽鋼" },
            { name: "內牙三通（2分）", size: "11.5mm", material: "304不鏽鋼" },
            { name: "內牙三通（3分）", size: "15.3mm", material: "304不鏽鋼" },
            { name: "內牙三通（4分）", size: "18.5mm", material: "304不鏽鋼" },
            { name: "內牙三通（1寸）", size: "30mm", material: "304不鏽鋼" },
            { name: "外牙三通（2分）", size: "13mm", material: "304不鏽鋼" },
            { name: "外牙三通（3分）", size: "16.6mm", material: "304不鏽鋼" },
            { name: "外牙三通（4分）", size: "21mm", material: "304不鏽鋼" },
            { name: "2分（內內外三通）", size: "11.5mm", material: "304不鏽鋼" },
            { name: "3分（內內外三通）", size: "15mm", material: "304不鏽鋼" },
            { name: "4分（內內外三通）", size: "19mm", material: "304不鏽鋼" },
            { name: "2分（內外外三通）", size: "11.5mm", material: "304不鏽鋼" },
            { name: "3分（內外外三通）", size: "15mm", material: "304不鏽鋼" },
            { name: "4分（內外外三通）", size: "19mm", material: "304不鏽鋼" },
            { name: "2分（外內外三通）", size: "11.5mm", material: "304不鏽鋼" },
            { name: "3分（外內外三通）", size: "15mm", material: "304不鏽鋼" },
            { name: "4分（外內外三通）", size: "19mm", material: "304不鏽鋼" },
            { name: "2分（內外內三通）", size: "11.5mm", material: "304不鏽鋼" },
            { name: "3分（內外內三通）", size: "15mm", material: "304不鏽鋼" },
            { name: "4分（內外內三通）", size: "19mm", material: "304不鏽鋼" },
            { name: "內牙彎頭(1分)", size: "9.5mm", material: "304不鏽鋼" },
            { name: "內牙彎頭(2分)", size: "11.5mm", material: "304不鏽鋼" },
            { name: "內牙彎頭(3分)", size: "15mm", material: "304不鏽鋼" },
            { name: "內牙彎頭(4分)", size: "19mm", material: "304不鏽鋼" },
            { name: "內牙彎頭(1寸)", size: "30mm", material: "304不鏽鋼" },
            { name: "內外牙彎頭(1分)", size: "8.5mm", material: "304不鏽鋼" },
            { name: "內外牙彎頭(2分)", size: "11.5mm", material: "304不鏽鋼" },
            { name: "內外牙彎頭(3分)", size: "15mm", material: "304不鏽鋼" },
            { name: "內外牙彎頭(4分)", size: "19mm", material: "304不鏽鋼" },
            { name: "內外牙彎頭(1寸)", size: "30mm", material: "304不鏽鋼" },
            { name: "內牙套管(1分)", size: "13mm", material: "304不鏽鋼" },
            { name: "內牙套管(2分)", size: "16mm", material: "304不鏽鋼" },
            { name: "內牙套管(3分)", size: "20mm", material: "304不鏽鋼" },
            { name: "內牙套管(4分)", size: "24mm", material: "304不鏽鋼" },
            { name: "內牙套管(6分)", size: "30mm", material: "304不鏽鋼" },
            { name: "內牙套管(1吋)", size: "37mm", material: "304不鏽鋼" },
            { name: "管帽(1分)", size: "8.5mm", material: "304不鏽鋼" },
            { name: "管帽(2分)", size: "11.5mm", material: "304不鏽鋼" },
            { name: "管帽(3分)", size: "15mm", material: "304不鏽鋼" },
            { name: "管帽(4分)", size: "19mm", material: "304不鏽鋼" },
            { name: "管帽(6分)", size: "24mm", material: "304不鏽鋼" },
            { name: "管帽(1吋)", size: "30mm", material: "304不鏽鋼" }
        ];

        // 生成圖片路徑陣列，與配料表一一對應。依序對應 I001.png, I002.png 等檔名。
        const IMAGE_PATHS = Array.from({ length: RAW_MATERIALS.length }, (_, idx) => {
            const num = String(idx + 1).padStart(3, '0');
            return `images/I${num}.png`;
        });

        const CATEGORIZE = (name) => {
            if (name.includes("噴座") || name.includes("噴嘴")) return "噴座";
            if (name.includes("閥") || name.includes("閥接") || name.includes("球閥")) return "閥門";
            if (name.includes("末端") || name.includes("管帽") || name.includes("蘑菇頭")) return "配件";
            return "接頭";
        };

        const INITIAL_DATA = RAW_MATERIALS.map((item, idx) => ({
            id: `I${(idx + 1).toString().padStart(3, '0')}`,
            name: item.name,
            size: item.size,
            material: item.material,
            price: 0,
            stock: 0,
            minStock: 10,
            category: CATEGORIZE(item.name),
            supplier: '',
            location: '',
            // 每個物料對應一張圖片；若沒有對應圖片則為 undefined
            image: IMAGE_PATHS[idx]
        }));

        // --- 子組件定義 ---
        
        // 庫存狀態標籤 (支援 Dark Mode)
        const StatusBadge = ({ stock, minStock, themeType }) => {
            const isDark = themeType === 'dark';
            
            if (stock < 0) return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-red-900/30 text-red-300 ring-1 ring-red-500/30' : 'bg-red-100 text-red-700 ring-1 ring-red-600/10'}`}><AlertCircle className="w-3.5 h-3.5 mr-1.5" /> 負庫存</span>;
            if (stock === 0) return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-rose-900/30 text-rose-300 ring-1 ring-rose-500/30' : 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/10'}`}><XCircle className="w-3.5 h-3.5 mr-1.5" /> 缺貨</span>;
            if (stock <= minStock) return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-amber-900/30 text-amber-300 ring-1 ring-amber-500/30' : 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/10'}`}><AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> 低庫存</span>;
            return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-emerald-900/30 text-emerald-300 ring-1 ring-emerald-500/30' : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/10'}`}><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 充足</span>;
        };

        // 數據卡片 (Dynamic Theme)
        const Card = ({ title, value, subtext, icon: Icon, onClick }) => {
            const { theme } = useContext(ThemeContext);

            return (
                <div 
                    onClick={onClick}
                    className={`${theme.colors.panelBg} ${theme.colors.cardShadow} p-6 rounded-2xl border ${theme.colors.border} transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer`}
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
        };

        // 快速庫存操作單元格 (加大按鈕 + Theme)
        const StockActionCell = ({ itemId, onStockChange, role = 'admin' }) => {
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
            const btnNormalClass = `${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-500'}`;

            return (
                <div className={`flex items-center justify-end space-x-2 ${role === 'admin' ? 'opacity-100' : 'opacity-40'}`}>
                    <button onClick={handleDecrement} disabled={role !== 'admin'} className={`${btnBaseClass} ${btnNormalClass}`}><Minus className="w-5 h-5" /></button>
                    <input 
                        type="text" 
                        value={pendingValue} 
                        onChange={handleChange} 
                        disabled={role !== 'admin'} 
                        className={`w-14 text-center text-base font-bold py-2 border rounded-xl focus:ring-2 outline-none transition-colors shadow-sm ${theme.colors.inputBg} ${theme.colors.textMain} ${theme.colors.border} ${isPending ? 'border-blue-500 text-blue-500' : ''}`} 
                        onClick={(e) => e.stopPropagation()} 
                        inputMode="numeric" 
                    />
                    <button onClick={handleIncrement} disabled={role !== 'admin'} className={`${btnBaseClass} ${btnNormalClass}`}><Plus className="w-5 h-5" /></button>
                    {isPending && role === 'admin' && (
                        <div className="flex items-center space-x-2 ml-1 animate-in fade-in slide-in-from-left-1 duration-200">
                            <button onClick={handleConfirm} className={`w-10 h-10 flex items-center justify-center text-white rounded-xl shadow-md btn-touch btn-hover ${theme.colors.primary}`}><Check className="w-5 h-5" /></button>
                            <button onClick={handleReset} className={`${btnBaseClass} ${theme.colors.panelBg} ${theme.colors.textSub}`}><X className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>
            );
        };
        // --- 主應用程式組件 ---
        const App = () => {
            const [orders, setOrders] = useState([]);
            const [activeView, setActiveView] = useState('dashboard');
            const [inventory, setInventory] = useState(INITIAL_DATA);
            const [clients, setClients] = useState([]); // Client Data State
            const [transactions, setTransactions] = useState([]);
            const [settings, setSettings] = useState({ allowNegativeStock: false });
            const [currentThemeId, setCurrentThemeId] = useState('blue_light');
            
            const [searchTerm, setSearchTerm] = useState('');
            const [activeCategory, setActiveCategory] = useState('all');
            
            // UI State
            const [batchMode, setBatchMode] = useState('transaction'); // 'transaction' | 'order'
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
            
            const currentTheme = useMemo(() => THEMES.find(t => t.id === currentThemeId) || THEMES[0], [currentThemeId]);

            const categories = ['all', ...Array.from(new Set(inventory.map(i => i.category)))];
            const filteredData = inventory.filter(item => {
                const term = searchTerm.toLowerCase().trim();
                let matchesCategory = false;
                if (activeCategory === 'all') matchesCategory = true;
                else if (activeCategory === '缺貨') matchesCategory = item.stock <= 0;
                else matchesCategory = item.category === activeCategory;
                
                if (term === '缺貨' || term === '缺貨') return matchesCategory && item.stock <= 0;
                if (term === '低庫存') return matchesCategory && item.stock <= item.minStock;
                if (term === '負庫存') return matchesCategory && item.stock < 0;
                if (term === '充足') return matchesCategory && item.stock > item.minStock;

                const terms = term.split(/\s+/).filter(Boolean);
                const matchesSearch = terms.length === 0 || terms.every(t => 
                    (item.name || '').toLowerCase().includes(t) || 
                    (item.id || '').toLowerCase().includes(t) ||
                    (item.size && item.size.toLowerCase().includes(t)) ||
                    (item.material && item.material.toLowerCase().includes(t))
                );

                return matchesCategory && matchesSearch;
            });

            // 資料持久化 (Local Storage)
            useEffect(() => {
                const savedOrders = localStorage.getItem('proims_orders');
                const savedInv = localStorage.getItem('proims_inventory');
                const savedTx = localStorage.getItem('proims_transactions');
                const savedSettings = localStorage.getItem('proims_settings');
                const savedTheme = localStorage.getItem('proims_theme');
                const savedClients = localStorage.getItem('proims_clients'); // Clients

                if (savedOrders) setOrders(JSON.parse(savedOrders) || []);
                if (savedInv) setInventory(JSON.parse(savedInv) || []);
                if (savedTx) setTransactions(JSON.parse(savedTx) || []);
                if (savedSettings) setSettings(JSON.parse(savedSettings));
                if (savedTheme) setCurrentThemeId(savedTheme);
                if (savedClients) setClients(JSON.parse(savedClients));
            }, []);

            useEffect(() => {
                localStorage.setItem('proims_orders', JSON.stringify(orders));
                localStorage.setItem('proims_inventory', JSON.stringify(inventory));
                localStorage.setItem('proims_transactions', JSON.stringify(transactions));
                localStorage.setItem('proims_settings', JSON.stringify(settings));
                localStorage.setItem('proims_theme', currentThemeId);
                localStorage.setItem('proims_clients', JSON.stringify(clients)); // Clients
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
                alert(`✅ 已加入${type === 'in' ? '進貨' : '出貨'}訂單`);
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
                alert('✅ 訂單執行完成！');
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

            const handleStockChange = (id, changeAmount, reason = '手動調整') => {
                const targetItem = inventory.find(i => i.id === id);
                if (!settings.allowNegativeStock && (targetItem.stock + changeAmount < 0)) { alert('操作失敗：系統設定不允許負庫存！'); return; }
                const newInv = inventory.map(item => item.id === id ? { ...item, stock: item.stock + changeAmount } : item);
                setInventory(newInv);
                setTransactions(prev => [{ id: Date.now(), date: new Date().toISOString().split('T')[0], type: changeAmount > 0 ? 'in' : 'out', items: [{ name: targetItem.name, qty: Math.abs(changeAmount) }], target: reason }, ...prev]);
            };

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
                    alert('✅ 訂單已建立');
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
                setShowBatchModal(false);
            };

            const handleUpdateItem = async (updatedItem) => {
                let finalItem = { ...updatedItem };
                // 若圖片為 Base64 (新上傳)，則儲存至硬碟
                if (updatedItem.image && updatedItem.image.startsWith('data:')) {
                    try {
                        const savedPath = await saveImageToDisk(updatedItem.image);
                        finalItem.image = savedPath;
                    } catch (e) {
                        console.error("儲存圖片失敗", e);
                        alert("儲存圖片失敗");
                        return;
                    }
                }
                setInventory(prev => prev.map(i => i.id === finalItem.id ? finalItem : i));
                setEditingItem(null);
            };

            // ▼▼▼ 修正後的 handleAddNewItem (客製化版) ▼▼▼
            const handleAddNewItem = async (newItemData) => {
                try {
                    // 1. 處理圖片：如果有圖，先存入硬碟拿到檔名
                    let imagePath = newItemData.image;
                    if (newItemData.image) {
                        console.log('正在儲存圖片到硬碟...');
                        // 呼叫我們剛剛寫好的工具
                        imagePath = await saveImageToDisk(newItemData.image);
                    }

                    // 2. 產生 ID (維持您原本的邏輯：I + 流水號)
                    const newId = `I${(inventory.length + 1).toString().padStart(3, '0')}`;

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
                    
                    // 提示一下 (可選)
                    // alert('新增成功！圖片已轉存硬碟。');
                    
                    return newItem;

                } catch (error) {
                    console.error("新增失敗:", error);
                    alert("儲存圖片時發生錯誤，請重試。");
                    return null;
                }
            };
            // ▲▲▲ 取代結束 ▲▲▲

            // 2. UI 邏輯：負責處理 Modal 的確認按鈕
            const handleCreateNewItem = (itemData) => {
                handleAddNewItem(itemData); // 呼叫上面的核心邏輯
                setShowAddModal(false);     // 關閉視窗
                setSearchTerm('');          // 清空搜尋，讓使用者看到新物料
                if (itemData.category) setActiveCategory(itemData.category); // 切換到該分類
            };

            const handleResetSystem = () => {
                if (window.confirm('確定要重置所有數據嗎？此操作無法復原。')) {
                    localStorage.clear();
                    const resetData = RAW_MATERIALS.map((item, idx) => ({ id: `I${(idx + 1).toString().padStart(3, '0')}`, name: item.name, size: item.size, material: item.material, price: 0, stock: 0, minStock: 10, category: CATEGORIZE(item.name), supplier: '', location: '' }));
                    setInventory(resetData);
                    setTransactions([]);
                    setClients([]);
                    setSettings({ allowNegativeStock: false });
                    setCurrentThemeId('blue_light');
                    setShowSettingsModal(false);
                }
            };
            
            const handleClearHistory = () => {
                if (window.confirm('確定要清空所有歷史紀錄嗎？')) {
                    setTransactions([]);
                }
            };

            // --- 1. 轉檔工具 (必備) ---
            const blobToBase64 = (blob) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            };

            // ★★★ 核心功能：存檔 (包含權限檢查) ★★★
            const saveFileToDevice = async (blob, filename) => {
                try {
                    // 1. 檢查是否為 APP 環境 (使用標準判斷方式)
                    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();
                    
                    if (isNative) {
                        
                        // 2. ★★★ 關鍵步驟：主動請求寫入權限 ★★★
                        // Android 不會自己給權限，必須要「問」
                        try {
                            const permStatus = await Filesystem.checkPermissions();
                            
                            // 如果權限不是 'granted' (已授權)，就跳出視窗請求
                            if (permStatus.publicStorage !== 'granted') {
                                const request = await Filesystem.requestPermissions();
                                if (request.publicStorage !== 'granted') {
                                    throw new Error("您拒絕了儲存權限，APP 無法下載檔案。");
                                }
                            }
                        } catch (permErr) {
                            console.log("權限檢查略過或失敗 (部分 Android 版本不需要此步驟):", permErr);
                        }

                        // 3. 轉檔並寫入
                        const base64Data = await blobToBase64(blob);
                        
                        // 嘗試寫入 Documents (使用 Directory Enum)
                        await Filesystem.writeFile({
                            path: filename,
                            data: base64Data,
                            directory: Directory.Documents,
                            recursive: true
                        });
                        
                        // 4. 成功提示 (顯示路徑)
                        alert(`✅ 下載成功！\n\n檔案已儲存至：\nDocuments/${filename}\n\n(請到「檔案」APP > 文件 查看)`);
                    } else {
                        // 電腦版下載
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                } catch (error) {
                    alert("⛔ 存檔失敗: " + error.message + "\n\n請嘗試到平板的「設定 > 應用程式 > ProIMS > 權限」手動開啟儲存權限。");
                }
            };

            // --- 3. 匯出 Excel (呼叫存檔) ---
            const exportToCSV = async (data, filename, type = 'inventory') => {
                try {
                    let headers = [], rows = [];
                    if (type === 'inventory') {
                        headers = ['ID', '品名', '規格', '材質', '分類', '庫存', '安全庫存', '單價', '總價值'];
                        rows = data.map(item => [item.id, item.name, item.size||'-', item.material||'-', item.category, item.stock, item.minStock, item.price, item.stock*item.price]);
                    } else {
                        headers = ['日期', '類型', '對象/原因', '品項明細', '總金額'];
                        rows = data.map(tx => [tx.date, tx.type==='in'?'入庫':'出庫', tx.target, (tx.items || []).map(i=>`${i.name} x${i.qty}`).join('; '), tx.amount||0]);
                    }

                    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
                    const fullFileName = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
                    
                    // 建立 Blob 並存檔
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    await saveFileToDevice(blob, fullFileName);

                } catch (error) {
                    alert("匯出錯誤: " + error.message);
                }
            };

            // --- 4. 列印 PDF (呼叫存檔) ---
            const printReport = (data, title, type = 'inventory') => {
                if (typeof html2pdf === 'undefined') { alert('❌ PDF 工具未載入'); return; }
                setIsPrinting(true);
                const loadingId = 'pdf-loading';
                
                // 顯示 Loading
                if(!document.getElementById(loadingId)) {
                    const t = document.createElement('div'); t.id = loadingId;
                    t.innerHTML = `<div class="flex items-center gap-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> PDF 製作中...</div>`;
                    t.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.8); color:white; padding:15px; border-radius:10px; z-index:9999;';
                    document.body.appendChild(t);
                }

                let tableHtml = '';
                if (type === 'inventory') {
                    tableHtml = `<thead><tr style="background:#f3f4f6; border-bottom: 2px solid #000;"><th style="padding:8px;">ID</th><th style="padding:8px;">品名</th><th style="padding:8px;">規格</th><th style="padding:8px; text-align:right;">庫存</th><th style="padding:8px; text-align:right;">小計</th></tr></thead><tbody>${data.map((item, index) => `<tr style="border-bottom: 1px solid #e5e7eb; background-color: ${index % 2 === 0 ? '#fff' : '#f9fafb'};"><td style="padding:8px;">${item.id}</td><td style="padding:8px; font-weight:bold;">${item.name}</td><td style="padding:8px;">${item.size || ''}</td><td style="padding:8px; text-align:right; font-weight:bold;">${item.stock}</td><td style="padding:8px; text-align:right;">${(item.stock * item.price).toLocaleString()}</td></tr>`).join('')}</tbody>`;
                } else {
                    tableHtml = `<thead><tr style="background:#f3f4f6; border-bottom: 2px solid #000;"><th style="padding:8px;">日期</th><th style="padding:8px;">類型</th><th style="padding:8px;">對象</th><th style="padding:8px;">明細</th></tr></thead><tbody>${data.map((tx, index) => `<tr style="border-bottom: 1px solid #e5e7eb; background-color: ${index % 2 === 0 ? '#fff' : '#f9fafb'};"><td style="padding:8px;">${tx.date}</td><td style="padding:8px;">${tx.type === 'in' ? '入庫' : '出庫'}</td><td style="padding:8px;">${tx.target}</td><td style="padding:8px;">${(tx.items || []).map(i => `${i.name} x${i.qty}`).join('<br>')}</td></tr>`).join('')}</tbody>`;
                }

                const content = document.createElement('div');
                content.style.width = '190mm'; content.style.margin='0 auto'; content.style.padding='10mm'; content.style.background='#fff';
                content.innerHTML = `<h1 style="font-size:24px; font-weight:bold; margin-bottom:10px;">${title}</h1><p style="font-size:12px; color:#666; margin-bottom:20px;">時間：${new Date().toLocaleString()}</p><table style="width:100%; border-collapse:collapse; font-size:12px;">${tableHtml}</table>`;

                const opt = { margin: 10, filename: `${title}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };

                html2pdf().set(opt).from(content).output('blob').then(async (blob) => {
                    document.getElementById(loadingId)?.remove();
                    setIsPrinting(false);
                    // 存檔
                    await saveFileToDevice(blob, `${title}.pdf`);
                }).catch(err => {
                    alert('PDF 錯誤: '+err.message);
                    setIsPrinting(false);
                    document.getElementById(loadingId)?.remove();
                });
            };
            // 將函式掛載到 window 以便 Modal 使用
            window.appExportCSV = exportToCSV;
            window.appPrintReport = printReport;

            const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;

            return (
                <ThemeContext.Provider value={{ theme: currentTheme }}>
                    <div className={`h-screen w-screen flex ${currentTheme.colors.appBg} overflow-hidden font-sans transition-colors duration-300`}>
                        {/* 側邊欄 */}
                        <div className={`hidden md:flex w-20 ${currentTheme.colors.sidebarBg} flex-col items-center py-8 space-y-8 z-20 shadow-2xl transition-colors duration-300`}>
                            <div className={`p-3 rounded-2xl text-white shadow-lg ${currentTheme.type === 'dark' ? 'bg-white/10' : 'bg-white/20'}`}><Package className="w-8 h-8" /></div>
                            <div className="flex-1 w-full flex flex-col items-center space-y-6">
                                <button onClick={() => setActiveView('dashboard')} className={`p-4 rounded-2xl backdrop-blur-sm btn-touch transition-all ${activeView === 'dashboard' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`} title="庫存儀表板"><LayoutDashboard className="w-6 h-6"/></button>
                                <button onClick={() => setActiveView('orders')} className={`p-4 rounded-2xl backdrop-blur-sm btn-touch transition-all ${activeView === 'orders' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`} title="訂單管理"><ClipboardList className="w-6 h-6"/></button>
                                <button onClick={() => setActiveView('clients')} className={`p-4 rounded-2xl backdrop-blur-sm btn-touch transition-all ${activeView === 'clients' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`} title="客戶管理"><Briefcase className="w-6 h-6"/></button>
                                <button onClick={() => setShowSettingsModal(true)} className="p-4 text-white/50 hover:text-white hover:bg-white/5 rounded-2xl transition-all btn-touch" title="設定"><Settings className="w-6 h-6"/></button>
                            </div>
                        </div>

                        {/* 主內容區 */}
                        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                            {activeView === 'dashboard' && (
                                <>
                                    {/* 頂部導航 (Header) */}
                                    <header className={`${currentTheme.colors.panelBg} border-b ${currentTheme.colors.border} px-8 py-5 flex justify-between items-center z-10 shadow-sm transition-colors duration-300`}>
                                        <div>
                                            <h1 className={`text-2xl font-extrabold ${currentTheme.colors.textMain} tracking-tight`}>庫存管理儀表板</h1>
                                            <p className={`text-xs ${currentTheme.colors.textSub} mt-1 font-medium`}>ProIMS v5.3</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {/* 1. 異動歷程按鈕 */}
                                            <button onClick={() => setShowHistoryModal(true)} className={`${currentTheme.colors.panelBg} border ${currentTheme.colors.border} ${currentTheme.colors.textSub} px-4 py-3 rounded-xl text-sm font-bold flex items-center ${currentTheme.colors.hover} transition-all shadow-sm btn-touch`} title="查看異動紀錄">
                                                <History className={`w-5 h-5 md:mr-2 ${currentTheme.colors.accent}`} /> <span className="hidden md:inline">異動歷程</span>
                                            </button>
                                            
                                            {/* 2. (新加入) 新增物料按鈕 */}
                                            <button onClick={() => setShowAddModal(true)} className={`${currentTheme.colors.panelBg} border ${currentTheme.colors.border} ${currentTheme.colors.textMain} px-4 py-3 rounded-xl text-sm font-bold flex items-center ${currentTheme.colors.hover} transition-all shadow-sm btn-touch`}>
                                                <Plus className="w-5 h-5 md:mr-2 text-green-600" /> <span className="hidden md:inline">新增物料</span>
                                            </button>

                                            {/* 3. 進出貨作業按鈕 */}
                                            <button onClick={() => { setBatchMode('transaction'); setShowBatchModal(true); }} className={`${currentTheme.colors.primary} ${currentTheme.colors.primaryText} px-6 py-3 rounded-xl text-sm font-bold flex items-center hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 btn-touch`}>
                                                <ArrowRightLeft className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">進出貨作業</span>
                                            </button>
                                        </div>
                                    </header>
                                    {/* 可捲動區域 */}
                                    <div className="flex-1 overflow-y-auto scroller p-6 md:p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <Card title="總品項數" value={inventory.length} icon={Package} subtext="系統登錄物料總數" />
                                            <Card title="低庫存警示" value={lowStockCount} icon={AlertTriangle} subtext="低於安全庫存水位" />
                                            <Card title="異動歷程" value={transactions.length} icon={History} subtext="點擊查看近期紀錄" onClick={() => setShowHistoryModal(true)} />
                                        </div>

                                        {/* 庫存列表區塊 */}
                                        <div className={`${currentTheme.colors.panelBg} rounded-3xl shadow-sm border ${currentTheme.colors.border} flex flex-col min-h-[600px] overflow-hidden transition-colors duration-300`}>
                                            <div className={`p-6 border-b ${currentTheme.colors.border} flex flex-col xl:flex-row justify-between gap-5 items-start xl:items-center`}>
                                                {/* 左側：分類篩選 */}
                                                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full xl:w-auto pb-1">
                                                    {categories.slice(0, 6).map(c => (
                                                        <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap border ${activeCategory === c ? `${currentTheme.colors.sidebarBg} text-white shadow-md` : `${currentTheme.colors.panelBg} ${currentTheme.colors.textSub} ${currentTheme.colors.border} ${currentTheme.colors.hover}`}`}>{c === 'all' ? '全部' : c}</button>
                                                    ))}
                                                    <div className={`w-px h-6 ${currentTheme.colors.border} border-l mx-1`}></div>
                                                    <button onClick={() => setActiveCategory('缺貨')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center border ${activeCategory === '缺貨' ? 'bg-red-600 text-white border-red-600 shadow-md' : `${currentTheme.colors.panelBg} ${currentTheme.colors.border} text-red-500 hover:bg-red-50`}`}><XCircle className="w-4 h-4 mr-1.5" /> 缺貨</button>
                                                </div>
                                                
                                                {/* 右側：搜尋與匯出功能 */}
                                                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                                                    <div className="relative flex-1 md:w-64">
                                                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${currentTheme.colors.textSub}`} />
                                                        <input type="text" placeholder="搜尋品名、編號..." className={`w-full pl-10 pr-4 py-2.5 ${currentTheme.colors.appBg} border ${currentTheme.colors.border} rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${currentTheme.colors.textMain}`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                                    </div>
                                                    
                                                    {/* --- 新增：匯出按鈕組 --- */}
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            onClick={() => exportToCSV(filteredData, '庫存清單', 'inventory')}
                                                            className={`px-4 py-2.5 ${currentTheme.colors.panelBg} border ${currentTheme.colors.border} ${currentTheme.colors.textMain} rounded-xl text-sm font-bold shadow-sm hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all flex items-center whitespace-nowrap`}
                                                            title="匯出 Excel (.csv)"
                                                        >
                                                            <FileDown className="w-4 h-4 mr-2" /> Excel
                                                        </button>
                                                        <button 
                                                            onClick={() => !isPrinting && printReport(filteredData, '庫存盤點報表', 'inventory')}
                                                            disabled={isPrinting}
                                                            className={`px-4 py-2.5 border rounded-xl text-sm font-bold shadow-sm transition-all flex items-center whitespace-nowrap ${
                                                                isPrinting 
                                                                    ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-wait' 
                                                                    : `${currentTheme.colors.panelBg} ${currentTheme.colors.border} ${currentTheme.colors.textMain} hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200`
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
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider`}>編號/品名</th>
                                                            <th className={`hidden lg:table-cell px-6 py-4 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider`}>規格/材質</th>
                                                            <th className={`hidden lg:table-cell px-6 py-4 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-right`}>單價</th>
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-right`}>庫存量</th>
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-right`}>快速調整</th>
                                                            <th className={`px-3 py-3 md:px-4 md:py-4 lg:px-6 text-xs font-extrabold ${currentTheme.colors.textSub} uppercase tracking-wider text-center`}>操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`divide-y ${currentTheme.type === 'dark' ? 'divide-gray-700' : 'divide-slate-100'}`}>
                                                        {filteredData.map(item => (
                                                            <tr key={item.id} className={`${currentTheme.colors.hover} transition-colors group`}>
                                                                <td className="px-3 py-4 md:px-4 lg:px-6 whitespace-nowrap w-24"><StatusBadge stock={item.stock} minStock={item.minStock} themeType={currentTheme.type} /></td>
                                                                <td className="px-3 py-4 md:px-4 lg:px-6">
                                                                    <div
                                                                        onClick={() => setPreviewItem(item)}
                                                                        className={`font-bold ${currentTheme.colors.textMain} text-base mb-1 cursor-pointer hover:underline`}
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
                                                                        <span className={`text-xs font-mono font-bold ${currentTheme.colors.textMain} ${currentTheme.type === 'dark' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'} px-1.5 py-0.5 rounded`}>
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
                                                                <td className="px-3 py-4 md:px-4 lg:px-6 text-right w-48"><StockActionCell itemId={item.id} onStockChange={handleStockChange} /></td>
                                                                <td className="px-3 py-4 md:px-4 lg:px-6 text-center w-24"><button onClick={() => setEditingItem(item)} className={`p-3 ${currentTheme.colors.textSub} hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent btn-touch`}><Pencil className="w-5 h-5" /></button></td>
                                                            </tr>
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
                                </>
                            )}

                            {activeView === 'clients' && (
                                <ClientManager clients={clients} onAdd={handleAddClient} onUpdate={handleUpdateClient} onDelete={handleDeleteClient} />
                            )}

                            {activeView === 'orders' && (
                                <div className="flex-1 flex flex-col h-full overflow-hidden">
                                    <div className={`px-8 py-5 border-b ${currentTheme.colors.border} flex justify-between items-center ${currentTheme.colors.panelBg} shadow-sm`}>
                                        <div>
                                            <h1 className={`text-2xl font-extrabold ${currentTheme.colors.textMain} tracking-tight`}>訂單管理</h1>
                                            <p className={`text-xs ${currentTheme.colors.textSub} mt-1 font-medium`}>檢視與執行進出貨訂單</p>
                                        </div>
                                        <button onClick={() => { setBatchMode('order'); setShowBatchModal(true); }} className={`${currentTheme.colors.primary} ${currentTheme.colors.primaryText} px-6 py-3 rounded-xl text-sm font-bold flex items-center hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 btn-touch`}>
                                            <Plus className="w-5 h-5 mr-2" /> 新增訂單
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto scroller p-6 md:p-8">
                                        <OrderManager orders={orders} onExecute={handleExecuteOrder} onDelete={handleDeleteOrder} />
                                    </div>
                                </div>
                            )}
                        </main>

                        <BatchTransactionModal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} inventory={inventory} onConfirm={handleBatchConfirm} onAddNewItem={handleAddNewItem} categories={categories} allowNegativeStock={settings.allowNegativeStock} mode={batchMode} />
                        {/* --- 修改開始：傳遞分類與材質清單給視窗 --- */}
                        <EditItemModal 
                            isOpen={!!editingItem} 
                            onClose={() => setEditingItem(null)} 
                            item={editingItem} 
                            onSave={handleUpdateItem} 
                            categories={categories} // 傳入分類
                            // 即時計算不重複的材質列表
                            materials={Array.from(new Set(inventory.map(i => i.material).filter(Boolean)))}
                        />
                        
                        <AddItemModal 
                            isOpen={showAddModal} 
                            onClose={() => setShowAddModal(false)} 
                            onSave={handleCreateNewItem} 
                            categories={categories} // 傳入分類
                            // 即時計算不重複的材質列表
                            materials={Array.from(new Set(inventory.map(i => i.material).filter(Boolean)))}
                        />
                        {/* --- 修改結束 --- */}
                        {/* 補回：設定視窗 */}
                        <SettingsModal 
                            isOpen={showSettingsModal} 
                            onClose={() => setShowSettingsModal(false)} 
                            onReset={handleResetSystem} 
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
                        {/* 顯示圖片預覽的 Modal */}
                        <ImagePreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
                    </div>
                </ThemeContext.Provider>
            );
        };
        export default App;