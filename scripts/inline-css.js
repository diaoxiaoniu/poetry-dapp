const fs = require('fs');
const path = require('path');

// 读取构建后的 CSS 文件
const cssPath = path.join(__dirname, '../build/static/css/main.*.css');
const cssFile = fs.readdirSync(path.join(__dirname, '../build/static/css'))
  .find(file => file.startsWith('main.') && file.endsWith('.css'));
const css = fs.readFileSync(path.join(__dirname, '../build/static/css', cssFile), 'utf8');

// 读取 index.html
const indexPath = path.join(__dirname, '../build/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 将 CSS 内联到 HTML 中
html = html.replace(
  /<link.*href=".*main\..*\.css".*>/,
  `<style>${css}</style>`
);

// 写回文件
fs.writeFileSync(indexPath, html);
console.log('CSS 已内联到 HTML 中'); 