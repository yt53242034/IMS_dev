// c:\Users\Administrator\Desktop\proims-app\src\components\InventoryListItem.jsx
import React, { useState, useEffect, useContext, memo } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Icons } from './Icons';
import { loadImageFromDisk } from '../utils/imageHandler';

const { CheckCircle2 = () => null } = Icons || {};

const InventoryListItem = memo(({ item, isSelected, onClick }) => {
    const { theme } = useContext(ThemeContext); 
    const [displayImage, setDisplayImage] = useState(item?.image);

    useEffect(() => {
        if (!item) return;

        let isMounted = true;
        const load = async () => {
            try {
                if (item.image && typeof loadImageFromDisk === 'function') {
                    const realImage = await loadImageFromDisk(item.image);
                    if (isMounted) setDisplayImage(realImage || item.image);
                } else {
                    if (isMounted) setDisplayImage(item.image || null);
                }
            } catch (e) {
                console.error("Image load error:", e);
                if (isMounted) setDisplayImage(item.image);
            }
        };
        load();
        return () => { isMounted = false; };
    }, [item?.image]);

    if (!item || !theme) return null;

    return (
        <div 
            onClick={onClick} 
            className={`px-4 py-4 cursor-pointer border-b ${theme.colors.border} last:border-0 flex justify-between items-center group transition-colors ${isSelected ? (theme.type === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50') : 'hover:bg-black/5'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg border ${theme.colors.border} overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center`}>
                    {displayImage ? (
                        <img 
                            src={displayImage} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            onError={() => setDisplayImage(null)}
                        />
                    ) : (
                        <span className="text-xs text-gray-400">無圖</span>
                    )}
                </div>
                <div>
                    <div className={`text-sm font-bold ${theme.colors.textMain}`}>{item.name}</div>
                    <div className={`text-xs ${theme.colors.textSub} mt-0.5`}>
                        {item.id} | Stock: {item.stock}
                    </div>
                </div>
            </div>
            {isSelected ? (
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
            ) : (
                <div className={`w-6 h-6 border-2 ${theme.colors.border} rounded-full`}></div>
            )}
        </div>
    );
}, (prevProps, nextProps) => prevProps.isSelected === nextProps.isSelected && prevProps.item === nextProps.item);

export default InventoryListItem;
