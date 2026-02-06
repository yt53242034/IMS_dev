import { Filesystem, Directory } from '@capacitor/filesystem';

export const saveImageToDisk = async (base64Data) => {
    if (!base64Data || !base64Data.startsWith('data:')) return base64Data;

    const fileName = `img_${Date.now()}.jpeg`;
    try {
        const data = base64Data.split(',')[1];
        await Filesystem.writeFile({
            path: fileName,
            data: data,
            directory: Directory.Data
        });
        return fileName;
    } catch (e) {
        console.error('Error saving image', e);
        return base64Data;
    }
};

export const loadImageFromDisk = async (fileName) => {
    if (!fileName) return null;
    if (fileName.startsWith('data:') || fileName.startsWith('http') || fileName.startsWith('images/')) return fileName;
    
    try {
        const file = await Filesystem.readFile({ path: fileName, directory: Directory.Data });
        return `data:image/jpeg;base64,${file.data}`;
    } catch (e) {
        return fileName;
    }
};