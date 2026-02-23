// src/data/inventoryData.js

/**
 * 雄高科技/原彩實業 物料數據庫
 * 
 * 編碼憲法 (Coding Standards):
 * 1. 接頭類 (LI/LD/LM/LL): [系列]-[尺寸][形狀]
 *    - LI: 快插, LD: 鎖式/高壓, LM: 雙外牙, LL: 牙口彎頭
 *    - 尺寸: 2(2分), 3(3分), 4(4分), 16(16mm)
 *    - 形狀: 00(直通), 07(彎頭), 08(三通), 05(末端), 01/15(單孔), 02/12(雙孔), 04(內牙), 14(外牙), 48(四通)
 * 2. 閥門 (IVHG/PU): IVHG-[尺寸]
 * 3. 其他 (OTH): 無法精確對應規則或特殊材質變體
 */

export const INITIAL_INVENTORY = [
    // --- 16mm 系列 (不鏽鋼/高壓 - LD) ---
    {
        id: "LD-1600",
        name: "16不鏽鋼頂壓式無孔直接(快接)",
        size: "16mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LD-1600.png"
    },
    {
        id: "LD-1607",
        name: "16不鏽鋼頂壓式彎頭(快接)",
        size: "16mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LD-1607.png"
    },
    {
        id: "LD-1608",
        name: "16不鏽鋼頂壓式三通(快接)",
        size: "16mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LD-1608.png"
    },
    {
        id: "LD-1605",
        name: "16不鏽鋼頂壓式末端(快接)",
        size: "16mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/LD-1605.png"
    },

    // --- 16mm 系列 (電鍍 - LI) ---
    {
        id: "LI-1600",
        name: "16電鍍無孔直接(快接)",
        size: "16mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-1600.png"
    },
    {
        id: "LI-1607",
        name: "16電鍍彎頭(快接)",
        size: "16mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-1607.png"
    },
    {
        id: "LI-1608",
        name: "16電鍍三通(快接)",
        size: "16mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-1608.png"
    },
    {
        id: "LI-1605",
        name: "16電鍍無孔末端(快接)",
        size: "16mm",
        material: "銅鍍鎳",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/LI-1605.png"
    },

    // --- 3分系列 (電鍍 - LI 標準品) ---
    {
        id: "LI-300",
        name: "三分電鍍無孔直接(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-300.png"
    },
    {
        id: "LI-301",
        name: "三分電鍍直接單孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/LI-301.png"
    },
    {
        id: "LI-302",
        name: "三分電鍍直接雙孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/LI-302.png"
    },
    {
        id: "LI-312",
        name: "三分電鍍直接雙孔噴座120°(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/LI-312.png"
    },
    {
        id: "OTH-001", // 特殊規格: 1/8牙
        name: "三分電鍍直接1/8單孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-001.png"
    },
    {
        id: "OTH-002", // 特殊規格: 1/8牙
        name: "三分電鍍直接1/8雙孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-002.png"
    },
    {
        id: "LI-305",
        name: "三分電鍍末端無孔(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/LI-305.png"
    },
    {
        id: "LI-315", // 15: 單孔座(末端)
        name: "三分電鍍末端單孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/LI-315.png"
    },
    {
        id: "OTH-003", // 特殊形狀: 末端雙孔
        name: "三分電鍍末端雙孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-003.png"
    },
    {
        id: "OTH-004", // 特殊形狀: 末端雙孔120度
        name: "三分電鍍末端雙孔噴座120°(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-004.png"
    },
    {
        id: "OTH-005", // 特殊形狀: 末端四孔
        name: "三分電鍍末端四孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-005.png"
    },
    {
        id: "OTH-006", // 特殊規格: 1/8彎頭
        name: "三分電鍍末端1/8彎頭噴座 (快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-006.png"
    },
    {
        id: "OTH-007", // 特殊規格: 1/8頂部
        name: "三分電鍍末端1/8頂部噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-007.png"
    },
    {
        id: "OTH-008", // 特殊規格: 1/8雙孔
        name: "三分電鍍末端1/8雙孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-008.png"
    },
    {
        id: "OTH-009", // 特殊規格: Y型
        name: "三分電鍍末端1/8 Y型雙孔噴座(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-009.png"
    },
    {
        id: "OTH-010", // 閥接 (非標準 LI/LD)
        name: "三分電鍍1/4閥接(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "閥門",
        stock: 0,
        price: 0,
        image: "/images/OTH-010.png"
    },
    {
        id: "IVHG-3", // 閥門規則
        name: "三分電鍍閥門(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "閥門",
        stock: 0,
        price: 0,
        image: "/images/IVHG-3.png"
    },
    {
        id: "LI-308",
        name: "三分電鍍三通(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-308.png"
    },
    {
        id: "LI-348", // 48: 十字四通
        name: "三分電鍍四通(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-348.png"
    },
    {
        id: "LI-307",
        name: "三分電鍍彎頭(快接)",
        size: "9.52mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-307.png"
    },

    // --- 銅/其他材質變體 (歸類為 OTH 以避免 ID 衝突) ---
    {
        id: "LI-214", // 14: 外牙
        name: "2分外牙閥接(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "閥門",
        stock: 0,
        price: 0,
        image: "/images/LI-214.png"
    },
    {
        id: "OTH-011",
        name: "3分三孔蘑菇頭末端(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-011.png"
    },
    {
        id: "OTH-012",
        name: "1/8內牙直接單孔末端(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-012.png"
    },
    {
        id: "OTH-013", // 銅變體
        name: "3分單孔末端(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-013.png"
    },
    {
        id: "OTH-014", // 銅變體
        name: "3分120°雙孔直接(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-014.png"
    },
    {
        id: "OTH-015", // 銅變體
        name: "3分180°雙孔末端(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-015.png"
    },
    {
        id: "OTH-016", // 銅變體
        name: "3分單孔直接(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-016.png"
    },
    {
        id: "OTH-017", // 銅變體
        name: "3分180°雙孔直接(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-017.png"
    },
    {
        id: "OTH-018", // 銅變體
        name: "3分無孔直接(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-018.png"
    },
    {
        id: "OTH-019", // 1/8內牙
        name: "1/8內牙三通(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-019.png"
    },
    {
        id: "OTH-020", // 銅變體
        name: "3分彎頭(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-020.png"
    },
    {
        id: "OTH-021", // 1/8內牙
        name: "1/8內牙彎頭(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-021.png"
    },
    {
        id: "OTH-022", // 銅變體
        name: "3分三通(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-022.png"
    },
    {
        id: "OTH-023", // 特殊規格
        name: "1/8末端雙噴座(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-023.png"
    },
    {
        id: "OTH-024", // 銅變體
        name: "3分末端(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-024.png"
    },
    {
        id: "OTH-025", // 銅變體
        name: "3分四通(卡接)",
        size: "9.52mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-025.png"
    },
    {
        id: "IVHG-2", // 1/4" = 2分
        name: "1/4雙內牙球閥",
        size: "9.52mm",
        material: "銅",
        category: "閥門",
        stock: 0,
        price: 0,
        image: "/images/IVHG-2.png"
    },
    {
        id: "OTH-026",
        name: "2分內外牙球閥",
        size: "9.52mm",
        material: "銅",
        category: "閥門",
        stock: 0,
        price: 0,
        image: "/images/OTH-026.png"
    },

    // --- 不鏽鋼變體 (歸類為 OTH 以避免 ID 衝突) ---
    {
        id: "OTH-027", // SS變體
        name: "3分無孔直接(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-027.png"
    },
    {
        id: "OTH-028", // SS變體
        name: "3分直接單孔噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-028.png"
    },
    {
        id: "OTH-029", // SS變體
        name: "3分直接雙孔噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-029.png"
    },
    {
        id: "OTH-030", // SS變體
        name: "3分直接雙孔噴座120°(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-030.png"
    },
    {
        id: "OTH-031", // SS變體
        name: "3分無孔末端(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-031.png"
    },
    {
        id: "OTH-032", // SS變體
        name: "3分末端單孔噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-032.png"
    },
    {
        id: "OTH-033", // SS變體
        name: "3分末端雙孔噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-033.png"
    },
    {
        id: "OTH-034", // SS變體
        name: "3分末端雙孔噴座120°(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-034.png"
    },
    {
        id: "OTH-035", // SS變體
        name: "3分末端頂部噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-035.png"
    },
    {
        id: "OTH-036", // SS變體
        name: "3分直接1/8單孔噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-036.png"
    },
    {
        id: "OTH-037", // SS變體
        name: "3分末端1/8彎頭噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-037.png"
    },
    {
        id: "OTH-038", // SS變體
        name: "3分末端1/8頂部噴座(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "噴座",
        stock: 0,
        price: 0,
        image: "/images/OTH-038.png"
    },
    {
        id: "OTH-039", // SS變體
        name: "3分彎頭 (卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-039.png"
    },
    {
        id: "OTH-040", // SS變體
        name: "3分三通 (卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-040.png"
    },
    {
        id: "OTH-041", // SS變體
        name: "3分四通 (卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-041.png"
    },
    {
        id: "OTH-042", // SS變體
        name: "1/4閥接(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "閥門",
        stock: 0,
        price: 0,
        image: "/images/OTH-042.png"
    },
    {
        id: "OTH-043", // SS變體
        name: "3分閥門(卡接)",
        size: "9.52mm",
        material: "304不鏽鋼",
        category: "閥門",
        stock: 0,
        price: 0,
        image: "/images/OTH-043.png"
    },

    // --- 4分系列與變徑 (OTH) ---
    {
        id: "OTH-044", // 變徑
        name: "4分-2分直接(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-044.png"
    },
    {
        id: "OTH-045", // 變徑
        name: "4分-3分直接(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-045.png"
    },
    {
        id: "LI-400", // 4分直通
        name: "4分-4分直接(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-400.png"
    },
    {
        id: "OTH-046", // 變徑
        name: "4分-2分彎頭(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-046.png"
    },
    {
        id: "OTH-047", // 變徑
        name: "4分-3分彎頭(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-047.png"
    },
    {
        id: "LI-407", // 4分彎頭
        name: "4分-4分彎頭(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-407.png"
    },
    {
        id: "LI-400A", // 重複項目，使用後綴區分
        name: "4分直接(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-400A.png"
    },
    {
        id: "LI-407A", // 重複項目，使用後綴區分
        name: "4分彎頭(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-407A.png"
    },
    {
        id: "LI-408",
        name: "4分三通(卡接)",
        size: "20.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/LI-408.png"
    },
    {
        id: "OTH-050", // 變徑
        name: "4分-6mm直接(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-050.png"
    },
    {
        id: "OTH-051", // 變徑
        name: "4分-8mm直接(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-051.png"
    },
    {
        id: "OTH-052", // 變徑
        name: "4分-10mm直接(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-052.png"
    },
    {
        id: "OTH-053", // 變徑
        name: "4分-12mm直接(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-053.png"
    },
    {
        id: "OTH-054", // 變徑
        name: "4分-6mm彎頭(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-054.png"
    },
    {
        id: "OTH-055", // 變徑
        name: "4分-8mm彎頭(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-055.png"
    },
    {
        id: "OTH-056", // 變徑
        name: "4分-10mm彎頭(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-056.png"
    },
    {
        id: "OTH-057", // 變徑
        name: "4分-12mm彎頭(卡接)",
        size: "20.3mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-057.png"
    },

    // --- 16mm 其他材質 (OTH) ---
    {
        id: "OTH-058", // 16mm SS 卡接 (非 LD)
        name: "16彎頭(卡接)",
        size: "16mm",
        material: "304不銹鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-058.png"
    },
    {
        id: "OTH-059", // 16mm SS 卡接 (非 LD)
        name: "16三通(卡接)",
        size: "16mm",
        material: "304不銹鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-059.png"
    },
    {
        id: "OTH-060", // 16mm 銅鍍鎳 (重複項目)
        name: "16三通(卡接)",
        size: "16mm",
        material: "銅鍍鎳",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-060.png"
    },
    {
        id: "OTH-061", // 16mm 銅
        name: "16彎頭(卡接)",
        size: "16mm",
        material: "銅",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-061.png"
    },

    // --- 五金配件 (補心/立布/管帽) ---
    {
        id: "OTH-062",
        name: "六角內外牙補心(3分-2分)",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-062.png"
    },
    {
        id: "OTH-063",
        name: "六角內外牙補心(4分-1分)",
        size: "8.7mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-063.png"
    },
    {
        id: "OTH-064",
        name: "六角內外牙補心(4分-2分)",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-064.png"
    },
    {
        id: "OTH-065",
        name: "六角內外牙補心(4分-3分)",
        size: "15.3mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-065.png"
    },
    {
        id: "OTH-066",
        name: "六角內外牙補心(6分-4分)",
        size: "18.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-066.png"
    },
    {
        id: "OTH-067",
        name: "八角內外牙補心(1寸-4分)",
        size: "18.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-067.png"
    },
    {
        id: "OTH-068",
        name: "八角內外牙補心(1寸-6分)",
        size: "24.3mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-068.png"
    },
    {
        id: "OTH-069",
        name: "八角內外牙補心(1.2寸-1寸)",
        size: "30mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-069.png"
    },
    {
        id: "OTH-070",
        name: "八角內外牙補心(1.5寸-1寸)",
        size: "30mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-070.png"
    },
    {
        id: "OTH-071",
        name: "八角內外牙補心(2寸-1寸)",
        size: "30mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-071.png"
    },
    {
        id: "OTH-072",
        name: "外牙末端(1分)",
        size: "15mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-072.png"
    },
    {
        id: "OTH-073",
        name: "外牙末端(2分)",
        size: "20.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-073.png"
    },
    {
        id: "OTH-074",
        name: "外牙末端(3分)",
        size: "21.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-074.png"
    },
    {
        id: "OTH-075",
        name: "外牙末端(4分)",
        size: "24.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-075.png"
    },
    {
        id: "OTH-076",
        name: "外牙末端(6分)",
        size: "26.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-076.png"
    },
    {
        id: "OTH-077",
        name: "外牙末端(1寸)",
        size: "29.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-077.png"
    },
    {
        id: "OTH-078", // 變徑立布
        name: "立布(2分轉1分)",
        size: "30.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-078.png"
    },
    {
        id: "OTH-079", // 變徑立布
        name: "立布(3分轉2分)",
        size: "35mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-079.png"
    },
    {
        id: "OTH-080", // 變徑立布
        name: "立布(4分轉2分)",
        size: "38mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-080.png"
    },
    {
        id: "OTH-081", // 變徑立布
        name: "立布(4分轉3分)",
        size: "39mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-081.png"
    },
    {
        id: "OTH-082", // 變徑立布
        name: "立布(6分轉4分)",
        size: "43mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-082.png"
    },
    {
        id: "OTH-083", // 變徑立布
        name: "立布(1寸轉4分)",
        size: "46mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-083.png"
    },
    {
        id: "LM-400", // 4分立布 (雙外牙)
        name: "立布(4分)",
        size: "41mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/LM-400.png"
    },
    {
        id: "OTH-084", // 6分立布
        name: "立布(6分)",
        size: "44mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-084.png"
    },
    {
        id: "OTH-085", // 1寸立布
        name: "立布(1吋)",
        size: "49mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-085.png"
    },
    {
        id: "OTH-086",
        name: "內牙三通（1分）",
        size: "8.7mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-086.png"
    },
    {
        id: "OTH-087",
        name: "內牙三通（2分）",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-087.png"
    },
    {
        id: "OTH-088",
        name: "內牙三通（3分）",
        size: "15.3mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-088.png"
    },
    {
        id: "OTH-089",
        name: "內牙三通（4分）",
        size: "18.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-089.png"
    },
    {
        id: "OTH-090",
        name: "內牙三通（1寸）",
        size: "30mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-090.png"
    },
    {
        id: "OTH-091",
        name: "外牙三通（2分）",
        size: "13mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-091.png"
    },
    {
        id: "OTH-092",
        name: "外牙三通（3分）",
        size: "16.6mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-092.png"
    },
    {
        id: "OTH-093",
        name: "外牙三通（4分）",
        size: "21mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-093.png"
    },
    {
        id: "OTH-094",
        name: "2分（內內外三通）",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-094.png"
    },
    {
        id: "OTH-095",
        name: "3分（內內外三通）",
        size: "15mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-095.png"
    },
    {
        id: "OTH-096",
        name: "4分（內內外三通）",
        size: "19mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-096.png"
    },
    {
        id: "OTH-097",
        name: "2分（內外外三通）",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-097.png"
    },
    {
        id: "OTH-098",
        name: "3分（內外外三通）",
        size: "15mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-098.png"
    },
    {
        id: "OTH-099",
        name: "4分（內外外三通）",
        size: "19mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-099.png"
    },
    {
        id: "OTH-100",
        name: "2分（外內外三通）",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-100.png"
    },
    {
        id: "OTH-101",
        name: "3分（外內外三通）",
        size: "15mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-101.png"
    },
    {
        id: "OTH-102",
        name: "4分（外內外三通）",
        size: "19mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-102.png"
    },
    {
        id: "OTH-103",
        name: "2分（內外內三通）",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-103.png"
    },
    {
        id: "OTH-104",
        name: "3分（內外內三通）",
        size: "15mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-104.png"
    },
    {
        id: "OTH-105",
        name: "4分（內外內三通）",
        size: "19mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-105.png"
    },
    {
        id: "OTH-106",
        name: "內牙彎頭(1分)",
        size: "9.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-106.png"
    },
    {
        id: "OTH-107",
        name: "內牙彎頭(2分)",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-107.png"
    },
    {
        id: "OTH-108",
        name: "內牙彎頭(3分)",
        size: "15mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-108.png"
    },
    {
        id: "OTH-109",
        name: "內牙彎頭(4分)",
        size: "19mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-109.png"
    },
    {
        id: "OTH-110",
        name: "內牙彎頭(1寸)",
        size: "30mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-110.png"
    },
    {
        id: "OTH-111",
        name: "內外牙彎頭(1分)",
        size: "8.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-111.png"
    },
    {
        id: "OTH-112",
        name: "內外牙彎頭(2分)",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-112.png"
    },
    {
        id: "OTH-113",
        name: "內外牙彎頭(3分)",
        size: "15mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-113.png"
    },
    {
        id: "OTH-114",
        name: "內外牙彎頭(4分)",
        size: "19mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-114.png"
    },
    {
        id: "OTH-115",
        name: "內外牙彎頭(1寸)",
        size: "30mm",
        material: "304不鏽鋼",
        category: "接頭",
        stock: 0,
        price: 0,
        image: "/images/OTH-115.png"
    },
    {
        id: "OTH-116",
        name: "內牙套管(1分)",
        size: "13mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-116.png"
    },
    {
        id: "OTH-117",
        name: "內牙套管(2分)",
        size: "16mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-117.png"
    },
    {
        id: "OTH-118",
        name: "內牙套管(3分)",
        size: "20mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-118.png"
    },
    {
        id: "OTH-119",
        name: "內牙套管(4分)",
        size: "24mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-119.png"
    },
    {
        id: "OTH-120",
        name: "內牙套管(6分)",
        size: "30mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-120.png"
    },
    {
        id: "OTH-121",
        name: "內牙套管(1吋)",
        size: "37mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-121.png"
    },
    {
        id: "OTH-122",
        name: "管帽(1分)",
        size: "8.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-122.png"
    },
    {
        id: "OTH-123",
        name: "管帽(2分)",
        size: "11.5mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-123.png"
    },
    {
        id: "OTH-124",
        name: "管帽(3分)",
        size: "15mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-124.png"
    },
    {
        id: "OTH-125",
        name: "管帽(4分)",
        size: "19mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-125.png"
    },
    {
        id: "OTH-126",
        name: "管帽(6分)",
        size: "24mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-126.png"
    },
    {
        id: "OTH-127",
        name: "管帽(1吋)",
        size: "30mm",
        material: "304不鏽鋼",
        category: "配件",
        stock: 0,
        price: 0,
        image: "/images/OTH-127.png"
    }
];
