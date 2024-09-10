const orderId = '此時生成';

// 提供商品的 img 網址 (optional)
const prodFormat = {
  id: '',
  name: '',
  imageUrl: '',
  quantity: 0,
  price: 0,
}

//* 以下皆為 optional 的參數
//display.locale | 顯示語言，必須設定，因為預設為英文
//options.extra.branchName | 商店或分店名稱
const options = {
  display: { locale: 'zh_TW' },
  extra: { branchName: '' }
}

const redirectUrls = {
  confirmUrl: 'LINEPAY_RETURN_CONFIRM_URL',
  cancelUrl: 'LINEPAY_RETURN_CANCEL_URL'
}

// packages[].userFee | 手續費等額外費用 (optional)
const orderBody = {
  orderId,
  amount: 9999,
  currency: 'TWD',
  packages: [
    {
      id: 'packageId',
      amount: 'req.body.amount',
      products: 'req.body.products',
    },
  ],
  redirectUrls
};
