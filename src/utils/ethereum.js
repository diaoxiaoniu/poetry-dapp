import { ethers } from 'ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { POETRY_CONTRACT_ADDRESS, INFURA_ID } from '../config';
import PoetryABI from '../artifacts/contracts/Poetry.sol/Poetry.json';

const SEPOLIA_CHAIN_ID = '0xaa36a7';  // Sepolia 的 chainId

export const getContract = async () => {
  try {
    console.log("开始连接到以太坊网络...");
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let provider;
    if (isMobile) {
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
      } else {
        // 如果是移动设备且没有检测到钱包
        throw new Error('请在钱包的 DApp 浏览器中打开此网站，或安装 MetaMask 移动版');
      }
    } else if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else {
      throw new Error('未检测到钱包，请安装 MetaMask');
    }
    
    // 检查网络
    const network = await provider.getNetwork();
    if (network.chainId.toString(16) !== SEPOLIA_CHAIN_ID.replace('0x', '')) {
      try {
        // 尝试切换到 Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError) {
        // 如果用户拒绝切换网络
        const message = 
          '请切换到 Sepolia 测试网以访问诗歌\n' +
          'Please switch to Sepolia testnet to access poems\n\n' +
          '当前网络: ' + network.name + '\n' +
          'Current Network: ' + network.name + '\n\n' +
          '目标网络: Sepolia\n' +
          'Target Network: Sepolia';
        throw new Error(message);
      }
    }
    
    console.log("获取签名者...");
    const signer = provider.getSigner();
    
    console.log("创建合约实例...");
    console.log("合约地址:", POETRY_CONTRACT_ADDRESS);
    const contract = new ethers.Contract(
      POETRY_CONTRACT_ADDRESS,
      PoetryABI.abi,
      signer
    );
    
    // 包装合约方法，添加双语错误处理
    const wrappedContract = {
      ...contract,
      getActivePoems: async () => {
        try {
          return await contract.getActivePoems();
        } catch (error) {
          console.error("获取诗歌失败:", error);
          throw new Error('获取诗歌失败，请确保已切换到 Sepolia 测试网\nFailed to get poems, please make sure you are on Sepolia testnet');
        }
      }
    };
    
    console.log("合约连接成功!");
    return wrappedContract;
  } catch (error) {
    console.error("连接错误:", error);
    if (error.code === 4001) {
      throw new Error('请在钱包中允许连接\nPlease allow connection in wallet');
    }
    throw error;
  }
};

// 添加重新连接函数
export const reconnect = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        eth_accounts: {}
      }]
    });
    return await getContract();
  } catch (error) {
    console.error("重新连接失败:", error);
    throw new Error(error.message || '重新连接失败');
  }
}; 