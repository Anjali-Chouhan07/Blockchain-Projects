import { useState } from "react";
import Connect from "./components/Connect.jsx";
import axios from "axios";
import { ethers } from "ethers";
import "./index.css";
import CONTRACT_ABI from "/contractABI.json";
import { motion } from "framer-motion";

import NFT1 from "./assets/NFT List (1).svg";
import NFT2 from "./assets/NFT List (3).svg";
import NFT3 from "./assets/NFT List (2).svg";
import NFT4 from "./assets/NFT List.svg";

const PINATA_API_KEY = "23c167fc5f4aac8ce7ea";
const PINATA_SECRET_KEY =
  "8fddac446947f6b2b555f4a9a09bea0e4320cf25748617f64a0c6714f9efe1a6";
const CONTRACT_ADDRESS = "0xA180f5A486829fe1781cAA66Db7382eB349A0667";

export default function App() {
  const [signer, setSigner] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setStatus("");
  };

  const uploadToPinata = async () => {
    if (!file) return alert("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxContentLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
          setStatus(`Uploading... ${percent}%`);
        },
      }
    );

    setStatus("File uploaded, minting NFT...");
    return `ipfs://${response.data.IpfsHash}`;
  };

  const uploadAndMint = async () => {
    if (!file) return alert("Select a file first!");
    if (!signer) return alert("Connect wallet first!");

    try {
      const tokenURI = await uploadToPinata();
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const account = await signer.getAddress();
      const tx = await nftContract.mintNFT(account, tokenURI);
      await tx.wait();
      setProgress(100);
      setStatus("✅ Your NFT has been minted successfully!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error minting NFT");
    }
  };

  return (
    <div className="main">
      <h1 className="brand-title">NFT Mint</h1>

      <motion.div className="left-section">
        <h2 className="heading">Mint Your Digital Asset on Blockchain</h2>
        <p className="sub-text">
          Upload your artwork, connect your wallet, and mint your NFT directly on IPFS.
          Secure, fast, and fully decentralized NFT minting powered by Pinata & Web3.
        </p>

        <div className="controls">
          <Connect setSigner={setSigner} />
          <div className="upload-container">
            {status && <p className="upload-status">{status}</p>}
            <label className="upload-label">Upload NFT Image</label>
            <div className="upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-file-white"
              />
              
              <button onClick={uploadAndMint} className="upload-action-btn">
                Upload
              </button>
            </div>
         
          </div>
        </div>
      </motion.div>

      <motion.div className="right-section">
  {[NFT4, NFT1, NFT3, NFT2].map((NFT, index) => {
    // Adjust animation for mobile vs desktop
    const isMobile = window.innerWidth <= 768;

    let animateProps;
    switch (index) {
      case 0:
        animateProps = isMobile
          ? { x: [0, 10, -10, 0], y: [0, -10, 10, 0], rotate: [0, 15, -15, 0] }
          : { x: [0, 200, 200, 200], y: [0, 0, 0, -150], rotate: [0, 0, 360, 360] };
        break;
      case 1:
        animateProps = isMobile
          ? { x: [0, -10, 10, 0], y: [0, 10, -10, 0], rotate: [0, -15, 15, 0] }
          : { x: [0, 80, 80, 80], y: [0, 0, 0, 150], rotate: [0, 0, 360, 360] };
        break;
      case 2:
        animateProps = isMobile
          ? { x: [0, 5, -5, 0], y: [0, -10, 10, 0], rotate: [0, 10, -10, 0] }
          : { x: [0, 80, 80, 80], y: [0, 0, 0, -150], rotate: [0, 0, -360, -360] };
        break;
      case 3:
        animateProps = isMobile
          ? { x: [0, 0, 0, 0], y: [0, 5, -5, 0], rotate: [0, 5, -5, 0] }
          : { x: [0, 0, 0, 0], y: [0, 0, 0, 150], rotate: [0, 0, 360, 360] };
        break;
      default:
        animateProps = {};
    }

    return (
      <motion.img
        key={index}
        src={NFT}
        className="nft-hero"
        width={250}
        height={250}
        animate={animateProps}
        transition={{ duration: 2, delay: 0.6 * (index + 1) }}
      />
    );
  })}
</motion.div>
</div>
  );
}