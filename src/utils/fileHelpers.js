import html2pdf from 'html2pdf.js';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const saveFileToDevice = async (blob, filename) => {
    try {
        const isNative = window.Capacitor && window.Capacitor.isNativePlatform();
        if (isNative) {
            try {
                const permStatus = await Filesystem.checkPermissions();
                if (permStatus.publicStorage !== 'granted') {
                    const request = await Filesystem.requestPermissions();
                    if (request.publicStorage !== 'granted') throw new Error("您拒絕了儲存權限，APP 無法下載檔案。");
                }
            } catch (permErr) {
                console.log("權限檢查略過或失敗:", permErr);
            }
            const base64Data = await blobToBase64(blob);
            await Filesystem.writeFile({
                path: filename,
                data: base64Data,
                directory: Directory.Documents,
                recursive: true
            });
            alert(`✅ 下載成功！\n\n檔案已儲存至：\nDocuments/${filename}\n\n(請到「檔案」APP > 文件 查看)`);
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } catch (error) {
        alert("⛔ 存檔失敗: " + error.message + "\n\n請嘗試到平板的「設定 > 應用程式 > 原彩IMS系統 > 權限」手動開啟儲存權限。");
        throw error;
    }
};

export const exportToCSV = async (data, filename, type = 'inventory') => {
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
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        await saveFileToDevice(blob, fullFileName);
    } catch (error) {
        alert("匯出錯誤: " + error.message);
    }
};

export const printReport = (data, title, type = 'inventory') => {
    if (typeof html2pdf === 'undefined') { alert('❌ PDF 工具未載入'); return Promise.reject('PDF tool missing'); }
    
    const loadingId = 'pdf-loading';
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

    return html2pdf().set(opt).from(content).output('blob').then(async (blob) => {
        document.getElementById(loadingId)?.remove();
        await saveFileToDevice(blob, `${title}.pdf`);
    }).catch(err => {
        alert('PDF 錯誤: '+err.message);
        document.getElementById(loadingId)?.remove();
        throw err;
    });
};