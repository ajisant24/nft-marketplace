import React from 'react';

function Header({ account }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🎨 NFT Marketplace</h1>
        <div className="account-info">
          <span className="account-label">Connected:</span>
          <span className="account-address">
            {account.substring(0, 6)}...{account.substring(38)}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;