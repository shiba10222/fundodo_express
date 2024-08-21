import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJSONFile(filename) {
  try {
    const data = await readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`讀取文件 '${filename}' 時發生錯誤:`, error.message);
    throw error;
  }
}

async function writeJSONFile(filename, data) {
  try {
    await writeFile(filename, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`寫入文件 '${filename}' 時發生錯誤:`, error.message);
    throw error;
  }
}

function applyDiscount(price) {
  const originalPrice = parseInt(price);
  const discountType = Math.random() < 0.5 ? 'flat' : 'percentage';
  
  if (discountType === 'flat') {
    // 減少10元，但確保價格不會低於0
    return Math.max(0, originalPrice - 10);
  } else {
    // 打9折並四捨五入到整數
    return Math.round(originalPrice * 0.9);
  }
}

function generateRandomStock() {
  return Math.floor(Math.random() * 200).toString(); // 生成 0 到 999 之間的隨機整數
}

function generateFullProdPriceStock(product, stockData, startId) {
  const fullProdPriceStock = [];
  let id = startId;

  const sortArr = product.sortArr && product.sortArr.length > 0 ? product.sortArr : [null];
  const specArr = product.specArr && product.specArr.length > 0 ? product.specArr : [null];

  sortArr.forEach((sortname, sortIndex) => {
    specArr.forEach((specname, specIndex) => {
      const index = sortIndex * specArr.length + specIndex;
      const price = product.priceArr[index];

      if (price > 0) {
        const stockItem = stockData.find(item => 
          item.prod_id === product.id.toString() && 
          (sortname === null || item.sortname === sortname) && 
          (specname === null || item.specname === specname)
        );

        // 只有約一半的商品會獲得折扣
        const shouldApplyDiscount = Math.random() < 0.5;
        const discountedPrice = shouldApplyDiscount ? applyDiscount(price) : null;

        fullProdPriceStock.push({
          id: id.toString(),
          prod_id: product.id.toString(),
          price: price.toString(),
          price_sp: discountedPrice !== null ? discountedPrice.toString() : null,
          stock: generateRandomStock(), // 使用新的隨機庫存生成函數
          sortname: sortname,
          specname: specname
        });
        id++;
      }
    });
  });

  return { items: fullProdPriceStock, nextId: id };
}

async function main() {
  try {
    console.log('開始處理產品數據...');

    const productFilePath = path.join(__dirname, 'products.json');
    const stockFilePath = path.join(__dirname, 'prod_price_stock (1).json');
    const outputFilePath = path.join(__dirname, 'full_prod_price_stock.json');

    const products = await readJSONFile(productFilePath);
    const stockData = await readJSONFile(stockFilePath);

    console.log(`成功讀取 ${products.length} 個產品數據`);
    console.log(`成功讀取 ${stockData.length} 筆庫存數據`);

    let allProdPriceStock = [];
    let currentId = 1;
    
    products.forEach((product, index) => {
      console.log(`處理產品 ${index + 1}/${products.length} (prod_id: ${product.id})`);
      const result = generateFullProdPriceStock(product, stockData, currentId);
      allProdPriceStock = allProdPriceStock.concat(result.items);
      currentId = result.nextId;
    });

    console.log(`總共生成了 ${allProdPriceStock.length} 條 prod_price_stock 數據`);

    await writeJSONFile(outputFilePath, allProdPriceStock);

    console.log('處理完成，結果已寫入 full_prod_price_stock.json');
  } catch (error) {
    console.error('處理過程中發生錯誤:', error.message);
  }
}

main();