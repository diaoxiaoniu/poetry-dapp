import React, { useState, useEffect } from 'react';
import PoemForm from './components/PoemForm';
import PoemList from './components/PoemList';
import { getContract } from './utils/ethereum';
import './App.css';

function App() {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

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
    const dappUrl = 'daisydiao.eth.limo';
    
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return 'https://apps.apple.com/us/app/metamask/id1438144202';
    } else if (/Android/i.test(navigator.userAgent)) {
      return 'https://play.google.com/store/apps/details?id=io.metamask';
    }
    return null;
  };

  if (!contract) {
    return (
      <div className="App">
        <h1>民间诗人刁本涛的诗歌</h1>
        <div className="connect-wallet">
          <p>请连接钱包以访问完整功能</p>
          {isMobile ? (
            <>
              <p>请先安装并打开 MetaMask 移动端钱包</p>
              <a href={getWalletLink()} className="wallet-link" target="_blank" rel="noopener noreferrer">
                下载 MetaMask
              </a>
              <p>安装后请刷新页面</p>
            </>
          ) : (
            <button onClick={connectWallet} disabled={connecting}>
              {connecting ? '连接中...' : '连接钱包'}
            </button>
          )}
          {error && <p className="error">{error}</p>}
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