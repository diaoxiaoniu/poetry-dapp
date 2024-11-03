import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function formatPoem(content) {
  // 先按句号分割，然后处理作者名
  return content
    .split('。')
    .map(line => line.trim())
    .filter(line => line) // 移除空行
    .join('。\n') // 每句后添加换行
    .replace(/刁本涛/, '\n刁本涛'); // 作者名前添加换行
}

function PoemList({ contract }) {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // 获取当前连接的账户地址
    const getAddress = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setCurrentAddress(accounts[0]?.toLowerCase());
      }
    };
    getAddress();

    // 监听账户变化
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setCurrentAddress(accounts[0]?.toLowerCase());
      });
    }
  }, []);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const ownerStatus = await contract.isOwner();
        setIsOwner(ownerStatus);
      } catch (error) {
        console.error('检查所有者状态失败：', error);
      }
    };
    
    if (contract) {
      checkOwner();
    }
  }, [contract]);

  const loadPoems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("开始加载诗歌...");
      // 先检查合约是否已连接
      if (!contract) {
        throw new Error("合约未连接");
      }

      // 获取活跃诗歌索引
      const activeIndices = await contract.getActivePoems();
      console.log("活跃诗歌索引:", activeIndices);
      
      const poemsData = [];
      for (let i = 0; i < activeIndices.length; i++) {
        try {
          const index = activeIndices[i].toNumber();
          console.log(`尝试加载第 ${index + 1} 首诗歌...`);
          const poem = await contract.getPoem(index);
          console.log(`第 ${index + 1} 首诗歌数据:`, poem);
          poemsData.push({
            index: index,
            title: poem[0],
            content: poem[1],
            author: poem[2],
            timestamp: new Date(poem[3] * 1000).toLocaleString()
          });
        } catch (error) {
          console.error(`加载第 ${i + 1} 首诗歌失败:`, error);
        }
      }
      
      console.log("诗歌加载完成:", poemsData);
      setPoems(poemsData);
    } catch (error) {
      console.error('加载诗歌失败：', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (contract) {
      loadPoems();
    }
  }, [contract]);

  // 监听合约事件
  useEffect(() => {
    if (contract) {
      const filter = contract.filters.PoemCreated();
      contract.on(filter, (poemId, title, author) => {
        console.log("检测到新诗歌:", { poemId, title, author });
        loadPoems(); // 重新加载诗歌列表
      });

      return () => {
        contract.removeAllListeners(filter);
      };
    }
  }, [contract]);

  const handleDelete = async (index) => {
    try {
      console.log("开始删除诗歌...");
      const tx = await contract.deletePoem(index);
      console.log("删除交易已发送:", tx.hash);
      
      console.log("等待交易确认...");
      await tx.wait();
      console.log("删除成功");
      
      // 重新加载诗歌列表
      loadPoems();
    } catch (error) {
      console.error('删除失败：', error);
      alert('删除失败：' + error.message);
    }
  };

  if (loading) {
    return <div>正在加载诗歌...</div>;
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>;
  }

  return (
    <div className="poem-list">
      <h2>已发布的诗歌 ({poems.length})</h2>
      {poems.length === 0 ? (
        <p>还没有发布的诗歌</p>
      ) : (
        poems.map((poem, index) => (
          <div key={index} className="poem-card">
            <h3>{poem.title}</h3>
            <pre className="poem-content">{formatPoem(poem.content)}</pre>
            <small>发布时间: {poem.timestamp}</small>
            {isOwner && (
              <button 
                onClick={() => handleDelete(poem.index)}
                className="delete-button"
              >
                删除
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PoemList; 