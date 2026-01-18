import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./Connect.css";


export default function WalletConnect({ setSigner }) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask first!");
        return;
      }

      
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setSigner(signer);
      setAccount(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      {account ? (
        <div className="wallet-info">
      <p className="wallet-status">🟢 Connected</p>
      <p className="wallet-address">{account.slice(0, 6)}...{account.slice(-4)}</p>
  </div>
      ) : (
        <button  className="primary-btn" onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
