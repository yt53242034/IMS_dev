import { Filesystem, Directory } from '@capacitor/filesystem';

export const saveImageToDisk = async (base64Data, customFileName = null) => {
    // 如果不是 Base64 (例如已經是路徑)，直接回傳
    if (!base64Data || !base64Data.startsWith('data:')) return base64Data;

    // 若有提供 customFileName (例如 ID)，則使用它，否則產生隨機檔名
    const fileName = customFileName 
        ? `${customFileName}.jpg` 
        : `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;

    // 檢查是否為 Native 環境
    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

    if (isNative) {
        try {
            // 去除前綴 data:image/jpeg;base64,
            const data = base64Data.split(',')[1];
            await Filesystem.writeFile({
                path: fileName,
                data: data,
                directory: Directory.Data
            });
            return fileName; // 回傳檔名，之後用 loadImageFromDisk 讀取
        } catch (e) {
            console.error('Save image failed', e);
            return base64Data; // 失敗則回傳原字串
        }
    } else {
        // Web 環境：直接回傳 Base64
        return base64Data;
    }
};

export const loadImageFromDisk = async (path) => {
    if (!path) return null;
    if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('images/')) return path;

    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

    if (isNative) {
        try {
            const readFile = await Filesystem.readFile({
                path: path,
                directory: Directory.Data
            });
            return `data:image/jpeg;base64,${readFile.data}`;
        } catch (e) {
            return null;
        }
    }
    return null;
};