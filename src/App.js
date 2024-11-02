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

  if (!contract) {
    return (
      <div className="App">
        <h1>民间诗人刁本涛的诗歌</h1>
        <div className="connect-wallet">
          <p>请连接 MetaMask 钱包以访问完整功能</p>
          <button 
            onClick={connectWallet}
            disabled={connecting}
            className="connect-button"
          >
            {connecting ? '连接中...' : '连接 MetaMask'}
          </button>
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