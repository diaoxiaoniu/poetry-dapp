import { ethers } from 'ethers';
import { POETRY_CONTRACT_ADDRESS, INFURA_ID } from '../config';
import PoetryABI from '../artifacts/contracts/Poetry.sol/Poetry.json';

export const getContract = async () => {
  try {
    console.log("开始连接到以太坊网络...");
    
    if (typeof window.ethereum === 'undefined') {
      throw new Error('请安装 MetaMask!');
    }

    // 先检查是否已连接
    let accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    // 如果没有连接，请求连接
    if (!accounts || accounts.length === 0) {
      console.log("请求连接 MetaMask...");
      accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
    }

    if (!accounts || accounts.length === 0) {
      throw new Error('请在 MetaMask 中选择账户');
    }

    console.log("当前账户:", accounts[0]);
    
    console.log("创建 Web3Provider...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    console.log("获取签名者...");
    const signer = provider.getSigner();
    
    console.log("创建合约实例...");
    console.log("合约地址:", POETRY_CONTRACT_ADDRESS);
    const contract = new ethers.Contract(
      POETRY_CONTRACT_ADDRESS,
      PoetryABI.abi,
      signer
    );
    
    console.log("合约连接成功!");
    return contract;
  } catch (error) {
    console.error("连接错误:", error);
    if (error.code === 4001) {
      throw new Error('请在 MetaMask 中允许连接');
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