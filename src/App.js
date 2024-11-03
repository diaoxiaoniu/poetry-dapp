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
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return {
        download: 'https://apps.apple.com/us/app/metamask/id1438144202',
        deeplink: `https://metamask.app.link/dapp/${window.location.host}`
      };
    } else if (/Android/i.test(navigator.userAgent)) {
      return {
        download: 'https://play.google.com/store/apps/details?id=io.metamask',
        deeplink: `https://metamask.app.link/dapp/${window.location.host}`
      };
    }
    return null;
  };

  if (!contract) {
    const walletLinks = getWalletLink();
    return (
      <div className="App">
        <h1>民间诗人刁本涛的诗歌</h1>
        <div className="connect-wallet">
          <p>请连接钱包以访问完整功能</p>
          {isMobile ? (
            <>
              <p>请使用以下方式访问：</p>
              {walletLinks && (
                <>
                  <a href={walletLinks.deeplink} className="wallet-link">
                    在 MetaMask 中打开
                  </a>
                  <p>或</p>
                  <a href={walletLinks.download} className="wallet-link" target="_blank" rel="noopener noreferrer">
                    下载 MetaMask
                  </a>
                  <p>然后在 MetaMask 浏览器中访问此网站</p>
                </>
              )}
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