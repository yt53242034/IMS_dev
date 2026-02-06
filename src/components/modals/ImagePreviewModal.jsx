import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';
import { loadImageFromDisk } from '../../utils/imageHandler';

const { X } = Icons;

const ImagePreviewModal = ({ item, onClose }) => {
    const { theme } = useContext(ThemeContext);
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        if (item?.image) {
            loadImageFromDisk(item.image).then(setImgSrc);
        }
    }, [item]);

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><X className="w-6 h-6" /></button>
            <img src={imgSrc || item.image} alt={item.name} className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white font-bold backdrop-blur-md">{item.name}</div>
        </div>
    );
};

export default ImagePreviewModal;