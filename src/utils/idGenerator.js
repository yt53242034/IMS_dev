// c:\Users\Administrator\Desktop\proims-app\src\utils\idGenerator.js
/**
 * 智能 ID 產生器
 * @param {string} category - 物料分類
 * @param {string} specificType - 使用者手動輸入的規格碼 (可選)
 * @returns {string} 完整的 ID (前綴 + 規格碼)
 */
export const generateNextId = (category, specificType = '') => {
    let prefix = '';
    
    switch (category) {
        case '接頭':
            prefix = 'LI-';
            break;
        case '管材':
            prefix = 'LY';
            break;
        case '噴嘴':
            prefix = 'L';
            break;
        case '主機':
            prefix = 'LP-';
            break;
        default:
            // 若無匹配分類，可回傳空字串或預設前綴，這裡視需求而定
            prefix = ''; 
            break;
    }

    // 若有提供 specificType，則組合回傳；若無，則只回傳前綴供 UI 顯示
    return `${prefix}${specificType}`;
};
