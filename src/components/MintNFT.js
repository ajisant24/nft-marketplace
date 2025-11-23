import React, { useState } from 'react';

function MintNFT({ nftContract, account, loading, setLoading }) {
  const [nftURI, setNftURI] = useState('');
  const [status, setStatus] = useState('');

  const mintNFT = async () => {
    if (!nftURI) {
      alert('Please enter NFT URI');
      return;
    }

    setLoading(true);
    setStatus('Minting NFT...');

    try {
      const tx = await nftContract.mint(nftURI);
      setStatus('Transaction sent. Waiting for confirmation...');
      
      await tx.wait();
      
      setStatus('✅ NFT minted successfully!');
      setNftURI('');
      
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setStatus('❌ Error minting NFT');
      setTimeout(() => setStatus(''), 3000);
    }
    
    setLoading(false);
  };

  return (
    <section className="section">
      <h2>🎨 Mint New NFT</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Enter image URL (e.g., https://i.imgur.com/...)"
          value={nftURI}
          onChange={(e) => setNftURI(e.target.value)}
          disabled={loading}
        />
        <button onClick={mintNFT} disabled={loading}>
          {loading ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>
      {status && <p className="status-message">{status}</p>}
      <p className="hint">
        💡 Tip: Use free image hosting like Imgur or Cloudinary for testing
      </p>
    </section>
  );
}

export default MintNFT;