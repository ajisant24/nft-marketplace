import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Marketplace({ nftContract, marketplaceContract, account, loading, setLoading }) {
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    loadListings();
    
    // Refresh every 10 seconds
    const interval = setInterval(loadListings, 10000);
    return () => clearInterval(interval);
  }, [marketplaceContract, nftContract]);

  const loadListings = async () => {
    if (!marketplaceContract || !nftContract) return;

    try {
      setLoadingListings(true);
      const allListings = await marketplaceContract.getAllListings();
      
      const listingsWithMetadata = await Promise.all(
        allListings.map(async (listing) => {
          try {
            const uri = await nftContract.tokenURI(listing.tokenId);
            return {
              listingId: listing.listingId,
              tokenId: listing.tokenId,
              price: listing.price,
              seller: listing.seller,
              uri: uri,
              active: listing.active
            };
          } catch (error) {
            return null;
          }
        })
      );

      setListings(listingsWithMetadata.filter(l => l !== null));
    } catch (error) {
      console.error('Error loading listings:', error);
    }
    
    setLoadingListings(false);
  };

  const buyNFT = async (listingId, price) => {
    setLoading(true);
    
    try {
      const tx = await marketplaceContract.buyNFT(listingId, {
        value: price
      });
      
      await tx.wait();
      alert('✅ NFT purchased successfully!');
      
      // Reload listings
      await loadListings();
    } catch (error) {
      console.error('Error buying NFT:', error);
      alert('❌ Error buying NFT');
    }
    
    setLoading(false);
  };

  return (
    <section className="section">
      <h2>🛍️ Marketplace</h2>
      
      {loadingListings ? (
        <p className="loading">Loading marketplace...</p>
      ) : listings.length === 0 ? (
        <p className="empty-state">No NFTs listed for sale yet.</p>
      ) : (
        <div className="nft-grid">
          {listings.map((listing) => (
            <div key={listing.listingId.toString()} className="nft-card marketplace-card">
              <img 
                src={listing.uri} 
                alt={`NFT #${listing.tokenId}`}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                }}
              />
              <div className="nft-info">
                <p className="token-id">Token ID: #{listing.tokenId.toString()}</p>
                <p className="price">💎 {ethers.formatEther(listing.price)} ETH</p>
                <p className="seller">
                  Seller: {listing.seller.substring(0, 6)}...{listing.seller.substring(38)}
                </p>
                <button
                  onClick={() => buyNFT(listing.listingId, listing.price)}
                  disabled={loading || listing.seller.toLowerCase() === account.toLowerCase()}
                  className={listing.seller.toLowerCase() === account.toLowerCase() ? 'own-listing' : ''}
                >
                  {listing.seller.toLowerCase() === account.toLowerCase()
                    ? 'Your Listing'
                    : loading ? 'Processing...' : 'Buy NFT'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Marketplace;