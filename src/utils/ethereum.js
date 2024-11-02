import { ethers } from 'ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { POETRY_CONTRACT_ADDRESS, INFURA_ID } from '../config';
import PoetryABI from '../artifacts/contracts/Poetry.sol/Poetry.json';

export const getContract = async () => {
  try {
    console.log("开始连接到以太坊网络...");
    
    // 检查是否是移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let provider;
    if (isMobile) {
      // 使用 WalletConnect
      provider = new WalletConnectProvider({
        infuraId: process.env.REACT_APP_INFURA_ID,
        qrcode: true
      });
      await provider.enable();
    } else if (window.ethereum) {
      // 桌面端使用 MetaMask
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      throw new Error('请安装钱包');
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