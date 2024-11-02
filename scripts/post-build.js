const fs = require('fs');
const path = require('path');

// 读取 build/index.html
const indexPath = path.join(__dirname, '../build/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 添加 IPFS 网关备用链接
const gateways = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/'
];

// 修改资源链接
html = html.replace(/(href|src)="([^"]+)"/g, (match, attr, url) => {
  if (url.startsWith('/')) {
    return `${attr}=".${url}"`;
  }
  return match;
});

// 写回文件
fs.writeFileSync(indexPath, html); 