import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../Icons';
import { loadImageFromDisk } from '../../utils/imageHandler';

const { X = () => null, Package = () => null } = Icons || {};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ImagePreviewModal Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
                        <h3 className="text-lg font-bold text-red-600 mb-2">發生錯誤</h3>
                        <p className="text-sm text-gray-500 mb-4">無法顯示圖片預覽，請稍後再試。</p>
                        <button onClick={this.props.onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">關閉</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const ImagePreviewModalContent = ({ item, onClose }) => {
    const { theme } = useContext(ThemeContext);
    const [displayImage, setDisplayImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const isDark = theme.type === 'dark';

    useEffect(() => {
        if (!item) return;
        
        // 重置狀態，避免顯示上一張圖片
        setDisplayImage(null);
        setLoading(true);

        const path = item.image;
        // 簡化邏輯：直接判斷是否為 Web 路徑或 Base64，減少非同步干擾
        if (path && (path.includes('/') || path.startsWith('data:'))) {
            setDisplayImage(path);
            setLoading(false);
        } else if (path) {
            loadImageFromDisk(path).then(url => {
                setDisplayImage(url);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [item]);

    if (!item) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.colors.modalOverlay} backdrop-blur-sm`} 
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                className={`${theme.colors.panelBg} rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col border ${theme.colors.border} overflow-hidden`} 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`px-6 py-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.appBg}`}>
                    <h3 className={`font-bold text-lg ${theme.colors.textMain} flex items-center`}>
                        <Package className="w-5 h-5 mr-2 opacity-70"/>
                        {item.name}
                    </h3>
                    <button onClick={onClose} className={`p-2 rounded-full ${theme.colors.hover} transition-colors`}><X className={`w-6 h-6 ${theme.colors.textSub}`} /></button>
                </div>
                
                {/* Content */}
                <div className="p-6 flex justify-center bg-black/5 dark:bg-black/20">
                    {displayImage ? (
                        <div className={`relative rounded-xl overflow-hidden border-4 ${theme.colors.border} shadow-sm bg-white`}>
                            <img 
                                src={displayImage} 
                                alt={item.name} 
                                className="max-w-full max-h-[70vh] object-contain block" 
                                onError={() => setDisplayImage(null)} 
                            />
                        </div>
                    ) : (
                        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${theme.colors.textSub}`}>
                            {loading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-2"></div>
                            ) : (
                                <Package className="w-16 h-16 mb-2 opacity-20" />
                            )}
                            <span>{loading ? '載入中...' : '無圖片預覽'}</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

const ImagePreviewModal = (props) => {
    return (
        <AnimatePresence>
            {props.item && (
                <ErrorBoundary onClose={props.onClose}>
                    <ImagePreviewModalContent {...props} />
                </ErrorBoundary>
            )}
        </AnimatePresence>
    );
};

export default ImagePreviewModal;