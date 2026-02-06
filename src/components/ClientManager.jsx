import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Icons } from './Icons';

const { UserPlus, Search, Briefcase, Pencil, Trash2, Hash, Users, Phone, Mail, MapPin, X } = Icons;

const ClientManager = ({ clients, onAdd, onUpdate, onDelete }) => {
    const { theme } = useContext(ThemeContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter clients
    const filteredClients = clients.filter(c => 
        searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean).every(term => 
            (c.name || '').toLowerCase().includes(term) || 
            (c.contact || '').toLowerCase().includes(term) ||
            (c.phone || '').includes(term) ||
            (c.taxId && c.taxId.includes(term))
        )
    );

    const handleSave = (clientData) => {
        if (editingClient) {
            onUpdate({ ...editingClient, ...clientData });
        } else {
            onAdd(clientData);
        }
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const openEdit = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className={`px-8 py-5 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.panelBg} shadow-sm`}>
                <div>
                    <h1 className={`text-2xl font-extrabold ${theme.colors.textMain} tracking-tight`}>客戶資料管理</h1>
                    <p className={`text-xs ${theme.colors.textSub} mt-1 font-medium`}>管理您的客戶與供應商資訊</p>
                </div>
                <button 
                    onClick={() => { setEditingClient(null); setIsModalOpen(true); }} 
                    className={`${theme.colors.primary} ${theme.colors.primaryText} px-6 py-3 rounded-xl text-sm font-bold flex items-center hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 btn-touch`}
                >
                    <UserPlus className="w-5 h-5 mr-2" /> 新增客戶
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scroller p-6 md:p-8 space-y-6">
                {/* Search Bar */}
                <div className={`relative w-full md:w-96 ${theme.colors.textMain}`}>
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.colors.textSub}`} />
                    <input 
                        type="text" 
                        placeholder="搜尋客戶名稱、統編、聯絡人..." 
                        className={`w-full pl-12 pr-4 py-3 ${theme.colors.panelBg} border ${theme.colors.border} rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Client List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map(client => (
                        <div key={client.id} className={`${theme.colors.panelBg} ${theme.colors.cardShadow} p-6 rounded-2xl border ${theme.colors.border} hover:shadow-md transition-all group`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${theme.colors.appBg} ${theme.colors.accent}`}><Briefcase className="w-6 h-6" /></div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(client)} className={`p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors`}><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => { if(confirm('確定刪除此客戶？')) onDelete(client.id); }} className={`p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors`}><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <h3 className={`text-lg font-bold ${theme.colors.textMain} mb-1`}>{client.name}</h3>
                            
                            <div className="space-y-3 text-sm mt-4">
                                <div className={`flex items-center justify-between pb-2 border-b ${theme.colors.border} ${theme.colors.textSub}`}>
                                    <span className="flex items-center"><Hash className="w-4 h-4 mr-2 opacity-70" /> {client.taxId || '-'}</span>
                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">統編</span>
                                </div>
                                <div className={`flex items-center ${theme.colors.textSub}`}>
                                    <Users className="w-4 h-4 mr-2 opacity-70" /> {client.contact || '-'}
                                </div>
                                <div className={`flex items-center ${theme.colors.textSub}`}>
                                    <Phone className="w-4 h-4 mr-2 opacity-70" /> {client.phone || '-'}
                                </div>
                                <div className={`flex items-center ${theme.colors.textSub}`}>
                                    <Mail className="w-4 h-4 mr-2 opacity-70" /> {client.email || '-'}
                                </div>
                                <div className={`flex items-center ${theme.colors.textSub}`}>
                                    <MapPin className="w-4 h-4 mr-2 opacity-70" /> {client.address || '-'}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredClients.length === 0 && (
                        <div className={`col-span-full py-20 text-center ${theme.colors.textSub}`}>
                            <p>沒有找到符合的客戶資料</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Client Modal */}
            {isModalOpen && (
                <div className={`fixed inset-0 z-[80] flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm animate-in fade-in zoom-in-95`} onClick={() => setIsModalOpen(false)}>
                    <div className={`${theme.colors.panelBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border ${theme.colors.border}`} onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.appBg}`}>
                            <h3 className={`font-bold text-lg ${theme.colors.textMain}`}>{editingClient ? '編輯客戶' : '新增客戶'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleSave(Object.fromEntries(formData));
                        }} className="p-6 space-y-4">
                            <div><label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>公司/客戶名稱</label><input name="name" defaultValue={editingClient?.name} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} required /></div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>統一編號</label><input name="taxId" defaultValue={editingClient?.taxId} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                                <div><label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>聯絡人</label><input name="contact" defaultValue={editingClient?.contact} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>電話</label><input name="phone" defaultValue={editingClient?.phone} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                                <div><label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>Email</label><input name="email" defaultValue={editingClient?.email} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                            </div>
                            
                            <div><label className={`block text-xs font-bold ${theme.colors.textSub} uppercase mb-1`}>地址</label><input name="address" defaultValue={editingClient?.address} className={`w-full px-4 py-2 border ${theme.colors.border} rounded-lg ${theme.colors.inputBg} ${theme.colors.textMain}`} /></div>
                            
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.textSub}`}>取消</button>
                                <button type="submit" className={`px-4 py-2 rounded-lg ${theme.colors.primary} text-white`}>儲存</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManager;