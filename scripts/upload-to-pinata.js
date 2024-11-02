const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function uploadToPinata() {
    try {
        console.log('开始上传到 Pinata...');
        
        const buildPath = path.join(__dirname, '../build');
        console.log('正在处理文件夹:', buildPath);
        
        if (!fs.existsSync(buildPath)) {
            throw new Error('Build 文件夹不存在');
        }

        // 创建一个新的 FormData 实例
        const formData = new FormData();
        
        // 递归添加文件
        function addFilesToForm(dir, base = '') {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.join(base, item).replace(/\\/g, '/');
                
                if (fs.statSync(fullPath).isDirectory()) {
                    addFilesToForm(fullPath, relativePath);
                } else {
                    if (item === 'index.html') {
                        // 将 index.html 重命名为 index.txt
                        formData.append('file', fs.createReadStream(fullPath), {
                            filepath: relativePath.replace('.html', '.txt')
                        });
                    } else {
                        formData.append('file', fs.createReadStream(fullPath), {
                            filepath: relativePath
                        });
                    }
                    console.log('添加文件:', relativePath);
                }
            }
        }
        
        addFilesToForm(buildPath);

        // 添加元数据
        formData.append('pinataMetadata', JSON.stringify({
            name: "poetry-website",
            keyvalues: {
                description: "民间诗人刁本涛的诗歌"
            }
        }));

        // 添加选项
        formData.append('pinataOptions', JSON.stringify({
            wrapWithDirectory: false
        }));

        console.log('正在上传文件...');
        
        // 使用 axios 直接调用 Pinata API
        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                maxBodyLength: Infinity,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': 'c46af97a07e39f961676',
                    'pinata_secret_api_key': '876a74d3869a79b9bddb7448d8cfd6bbc6eeb413b2e2b1decee9c707a58062d3'
                }
            }
        );
        
        console.log('上传成功！');
        console.log('IPFS Hash:', response.data.IpfsHash);
        console.log(`访问链接: https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
        
        return response.data.IpfsHash;
    } catch (error) {
        console.error('上传失败:', error.response?.data || error);
        console.error('错误详情:', error.message);
        process.exit(1);
    }
}

uploadToPinata();