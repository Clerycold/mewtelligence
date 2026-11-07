// 計算商品的最終導購網址（/go/ 頁面與 scripts/gen-redirects.mjs 共用）
//
// product.affiliateUrl 填一般的商店網址；
// product.network 指定要經過哪個聯盟平台轉址，沒填就直接連到商店。

/**
 * @param {{ id: string, affiliateUrl: string, network?: string }} product
 * @param {{ ichannels?: { k: string } }} config  src/data/affiliate.json 的內容
 */
export function outboundUrl(product, config) {
  const target = product.affiliateUrl;
  switch (product.network) {
    case undefined:
    case '':
      return target;
    case 'ichannels': {
      // 通路王 Deep Link（新中央轉址）：https://product.mchannles.com/redirect_wa.php?k=K值&tourl=編碼後的網址
      const k = config.ichannels?.k;
      if (!k) throw new Error(`${product.id} 指定 network=ichannels，但 affiliate.json 沒有 ichannels.k`);
      return `https://product.mchannles.com/redirect_wa.php?k=${encodeURIComponent(k)}&tourl=${encodeURIComponent(target)}`;
    }
    default:
      throw new Error(`${product.id} 的 network「${product.network}」不支援`);
  }
}
