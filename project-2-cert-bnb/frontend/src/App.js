import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import bgVideo from "./b.mp4"; 

const contractAddress = "0x0a58E143D6fC0E6F5eaf6Aac908D2dBA4FF9Cdcf";
const adminAddress = "0x59d230beeb0ff1f2798fbd5b26c3f9f2ab309f86"; 
const contractABI = [
  {
    "inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],
    "name":"verifyCertificate",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],
    "name":"addCertificate",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

function App() {
  const [addCertificateInput, setAddCertificateInput] = useState("");
  const [verifyCertificateInput, setVerifyCertificateInput] = useState("");
  const [result, setResult] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    // Disconnect/reset previously connected account (optional)
    await window.ethereum.request({ method: "wallet_requestPermissions", params:[{ eth_accounts: {} }] });

    // Force MetaMask popup to select account
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setConnectedAddress(accounts[0]);
    setIsAdmin(accounts[0].toLowerCase() === adminAddress.toLowerCase());
  } catch (err) {
    console.error("Wallet connection failed", err);
  }
}

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setConnectedAddress(accounts[0] || "");
        setIsAdmin((accounts[0] || "").toLowerCase() === adminAddress.toLowerCase());
      });
    }
  }, []);

  async function verifyCertificate() {
    if (!connectedAddress) return alert("Connect your wallet first!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(verifyCertificateInput));
    const isValid = await contract.verifyCertificate(hash);
    setResult(isValid);
  }

  async function addCertificate() {
    if (!connectedAddress) return alert("Connect your wallet first!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(addCertificateInput));
    const tx = await contract.addCertificate(hash);
    await tx.wait();
    alert("Certificate added ✅");
    setAddCertificateInput("");
  }

  return (
  <div className="app-container">
    <video autoPlay loop muted className="bg-video">
      <source src={bgVideo} type="video/mp4" />
    </video>

    <div className="split-layout">

      {/* LEFT SIDE */}
      <div className="left-content">
        <h1 className="hero-title">
          "Eliminate Forgery with <span>Tamper-proof</span> Digital Certificates"
        </h1>

        <p className="hero-subtitle">
          A decentralized platform to 
          <strong> instantly verify</strong> certificates using blockchain
          technology — tamper-proof, transparent & trusted.
        </p>

        <p className="hero-tagline">
          🔐 Powered by Ethereum & Smart Contracts
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-card">
        <h2 className="card-title">Decentralized Verification</h2>

        {!connectedAddress && (
          <button className="btn-gradient big-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {connectedAddress && (
          <p className="wallet-info">
            {connectedAddress.slice(0, 6)}...
            {connectedAddress.slice(-4)}
            {isAdmin && " (Admin)"}
          </p>
        )}

        {isAdmin && (
          <div className="admin-box">
            <h3>Add Certificate</h3>
            <input
              className="input-xl"
              type="text"
              placeholder="Certificate Name"
              value={addCertificateInput}
              onChange={(e) => setAddCertificateInput(e.target.value)}
            />
            <button className="btn-gradient full-btn" onClick={addCertificate}>
              Add Certificate
            </button>
          </div>
        )}

        <div className="verify-box">
          <input
            className="input-xl"
            type="text"
            placeholder="Enter Certificate Name"
            value={verifyCertificateInput}
            onChange={(e) => setVerifyCertificateInput(e.target.value)}
          />
          <button className="btn-gradient full-btn" onClick={verifyCertificate}>
            Verify Certificate
          </button>
        </div>

        {result !== null && (
          <p className={`result ${result ? "valid" : "invalid"}`}>
            {result ? "Certificate is Valid ✅" : "Certificate is Invalid ❌"}
          </p>
        )}
      </div>
    </div>
  </div>
);
}

export default App;