import React, { useState, useEffect } from 'react';

function MyNFTs({ nftContract, account }) {
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyNFTs();
  }, [nftContract, account]);

  const loadMyNFTs = async () => {
    if (!nftContract || !account) return;

    try {
      setLoading(true);
      const totalSupply = await nftContract.totalSupply();
      const nfts = [];

      for (let i = 1; i <= totalSupply; i++) {
        try {
          const owner = await nftContract.ownerOf(i);
          if (owner.toLowerCase() === account.toLowerCase()) {
            const uri = await nftContract.tokenURI(i);
            nfts.push({ tokenId: i, uri });
          }
        } catch (error) {
          // Token might not exist
          continue;
        }
      }

      setMyNFTs(nfts);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    }
    
    setLoading(false);
  };

  return (
    <section className="section">
      <h2>🖼️ My NFTs</h2>
      
      {loading ? (
        <p className="loading">Loading your NFTs...</p>
      ) : myNFTs.length === 0 ? (
        <p className="empty-state">You don't own any NFTs yet. Mint one above!</p>
      ) : (
        <div className="nft-grid">
          {myNFTs.map((nft) => (
            <div key={nft.tokenId} className="nft-card">
              <img 
                src={nft.uri} 
                alt={`NFT #${nft.tokenId}`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                }}
              />
              <div className="nft-info">
                <p className="token-id">Token ID: #{nft.tokenId.toString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyNFTs;
