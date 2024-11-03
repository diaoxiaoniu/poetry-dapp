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
    const currentUrl = window.location.href;
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return {
        download: 'https://apps.apple.com/us/app/metamask/id1438144202',
        deeplink: `metamask://dapp/${currentUrl}`
      };
    } else if (/Android/i.test(navigator.userAgent)) {
      return {
        download: 'https://play.google.com/store/apps/details?id=io.metamask',
        deeplink: `https://metamask.app.link/dapp/${currentUrl}`
      };
    }
    return null;
  };

  const handleMobileWallet = () => {
    const walletLinks = getWalletLink();
    if (walletLinks) {
      // 先尝试打开 MetaMask
      window.location.href = walletLinks.deeplink;
      // 设置一个定时器，如果无法打开 MetaMask，则跳转到下载页面
      setTimeout(() => {
        window.location.href = walletLinks.download;
      }, 1500);
    }
  };

  if (!contract) {
    return (
      <div className="App">
        <h1>民间诗人刁本涛的诗歌</h1>
        <div className="connect-wallet">
          <p>请连接钱包以访问完整功能</p>
          {isMobile ? (
            <>
              <p>请使用以下方式访问：</p>
              <button onClick={handleMobileWallet} className="wallet-link">
                打开/下载 MetaMask
              </button>
              <p className="wallet-tip">
                如果已安装 MetaMask，将自动打开；<br />
                如果未安装，将跳转到应用商店
              </p>
            </>
          ) : (
            <button onClick={connectWallet} disabled={connecting}>
              {connecting ? '连接中...' : '连接钱包'}
            </button>
          )}
          {error && <p className="error">{error.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}</p>}
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