import React, { useState, useEffect } from 'react';
import PoemForm from './components/PoemForm';
import PoemList from './components/PoemList';
import { getContract } from './utils/ethereum';
import './App.css';

function App() {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      setError('');
      const poetryContract = await getContract();
      setContract(poetryContract);
    } catch (err) {
      console.error("连接错误:", err);
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const getWalletLink = () => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return 'https://metamask.app.link/dapp/你的网站域名';
    } else if (/Android/i.test(navigator.userAgent)) {
      return 'https://metamask.app.link/dapp/你的网站域名';
    }
    return null;
  };

  if (!contract) {
    return (
      <div className="App">
        <h1>民间诗人刁本涛的诗歌</h1>
        <div className="connect-wallet">
          <p>请连接钱包以访问完整功能</p>
          <button onClick={connectWallet}>
            {connecting ? '连接中...' : '连接钱包'}
          </button>
          {getWalletLink() && (
            <a href={getWalletLink()} className="wallet-link">
              下载 MetaMask 移动端
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>民间诗人刁本涛的诗歌</h1>
      <PoemForm contract={contract} />
      <PoemList contract={contract} />
    </div>
  );
}

export default App; 