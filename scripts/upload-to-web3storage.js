const { Web3Storage, File } = require('web3.storage');
const fs = require('fs');
const path = require('path');

async function uploadToWeb3Storage() {
    try {
        // 将这里的 token 替换为你刚才复制的 token
        const client = new Web3Storage({ token: '你的API_TOKEN' });
        
        console.log('开始上传到 Web3.Storage...');
        const buildPath = path.join(__dirname, '../build');
        
        // 递归读取所有文件
        function getAllFiles(dir, files = [], base = '') {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.join(base, entry.name);
                
                if (entry.isDirectory()) {
                    getAllFiles(fullPath, files, relativePath);
                } else {
                    console.log('添加文件:', relativePath);
                    files.push(new File(
                        [fs.readFileSync(fullPath)],
                        relativePath
                    ));
                }
            }
            
            return files;
        }
        
        const files = getAllFiles(buildPath);
        console.log(`找到 ${files.length} 个文件`);
        
        console.log('正在上传文件...');
        const cid = await client.put(files);
        
        console.log('上传成功！');
        console.log('IPFS CID:', cid);
        console.log(`访问链接: https://${cid}.ipfs.dweb.link`);
        console.log(`备用链接: https://w3s.link/ipfs/${cid}`);
        
        return cid;
    } catch (error) {
        console.error('上传失败:', error);
        process.exit(1);
    }
}

uploadToWeb3Storage(); 