import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import MintNFT from './components/MintNFT';
import MyNFTs from './components/MyNFTs';
import ListNFT from './components/ListNFT';
import Marketplace from './components/Marketplace';
import NFTContract from './contracts/NFT.json';
import MarketplaceContract from './contracts/Marketplace.json';
import contractAddress from './contracts/contract-address.json';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        // Check if on correct network (Sepolia = 11155111)
        const expectedChainId = 11155111n; // Sepolia
        if (network.chainId !== expectedChainId) {
          setNetworkError('Please switch to Sepolia testnet');
          return;
        }

        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);

        // Initialize contracts
        const nft = new ethers.Contract(
          contractAddress.NFT,
          NFTContract.abi,
          signer
        );

        const marketplace = new ethers.Contract(
          contractAddress.Marketplace,
          MarketplaceContract.abi,
          signer
        );

        setNftContract(nft);
        setMarketplaceContract(marketplace);

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

      } catch (error) {
        console.error('Error initializing web3:', error);
        alert('Failed to connect to MetaMask');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
    } else {
      setAccount(accounts[0]);
      window.location.reload();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
      });
      window.location.reload();
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  if (networkError) {
    return (
      <div className="App">
        <div className="network-error">
          <h2>⚠️ Wrong Network</h2>
          <p>{networkError}</p>
          <button onClick={switchToSepolia}>Switch to Sepolia</button>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="App">
        <div className="connect-wallet">
          <h1>🎨 NFT Marketplace</h1>
          <p>Connect your wallet to get started</p>
          <button onClick={initializeWeb3}>Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header account={account} />
      
      <div className="container">
        <MintNFT 
          nftContract={nftContract}
          account={account}
          loading={loading}
          setLoading={setLoading}
        />

        <MyNFTs 
          nftContract={nftContract}
          account={account}
        />

        <ListNFT 
          nftContract={nftContract}
          marketplaceContract={marketplaceContract}
          contractAddress={contractAddress}
          account={account}
          loading={loading}
          setLoading={setLoading}
        />

        <Marketplace 
          nftContract={nftContract}
          marketplaceContract={marketplaceContract}
          account={account}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default App;