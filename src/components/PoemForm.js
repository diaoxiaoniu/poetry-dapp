import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function PoemForm({ contract }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        if (!contract) {
          console.log("合约未连接");
          return;
        }
        const ownerStatus = await contract.isOwner();
        console.log("是否是合约所有者:", ownerStatus);
        setIsOwner(ownerStatus);
      } catch (error) {
        console.error('检查所有者状态失败：', error);
        setIsOwner(false);
      }
    };
    
    if (contract) {
      checkOwner();
    }
  }, [contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      console.log("开始发布诗歌...");
      const tx = await contract.createPoem(title, content);
      console.log("交易已发送:", tx.hash);
      
      console.log("等待交易确认...");
      await tx.wait();
      console.log("交易已确认");
      
      setTitle('');
      setContent('');
      alert('诗歌发布成功！');
    } catch (error) {
      console.error('发布失败：', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 如果不是所有者，不显示表单
  if (!isOwner) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="poem-form">
      <h2>发布新诗歌</h2>
      <input
        type="text"
        placeholder="诗歌标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
        required
      />
      <textarea
        placeholder="诗歌内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={submitting}>
        {submitting ? '发布中...' : '发布诗歌'}
      </button>
    </form>
  );
}

export default PoemForm; 