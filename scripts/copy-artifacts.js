const fs = require('fs');
const path = require('path');

// 源文件路径
const sourceDir = path.join(__dirname, '../artifacts/contracts');
// 目标文件夹路径
const targetDir = path.join(__dirname, '../src/artifacts/contracts');

// 创建目标目录
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 递归复制文件夹
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to);
    }
    
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        
        if (fs.lstatSync(fromPath).isFile()) {
            fs.copyFileSync(fromPath, toPath);
        } else {
            copyFolderSync(fromPath, toPath);
        }
    });
}

// 复制文件
copyFolderSync(sourceDir, targetDir);

console.log('Artifacts 已复制到 src/artifacts 目录');