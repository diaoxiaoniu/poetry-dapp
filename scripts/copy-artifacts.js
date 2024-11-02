const fs = require('fs');
const path = require('path');

// 源文件路径
const sourceDir = path.join(__dirname, '../artifacts/contracts');
// 目标文件路径
const targetDir = path.join(__dirname, '../src/artifacts/contracts');

// 创建目标目录
fs.mkdirSync(targetDir, { recursive: true });

// 复制文件
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log('Artifacts 已复制到 src/artifacts 目录'); 