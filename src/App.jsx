import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./contracts/kalpBridge.json";
import giniAbi from "./contracts/giniContract.json";

const CONTRACT_ADDRESS = "0xA17bd954dCf3B56C47f75146D27Ff30A0afF78F2";
const GINI_ADDRESS = "0x909F99de524da90959Bf4A42180934e3129815F1";
const GINI_ABI = giniAbi;
const CONTRACT_ABI = abi;
const CHAIN_ID = "0x13882";
const RPC_URL = "https://polygon-amoy.g.alchemy.com/v2/m8XKrD1n0ZnGfcQMEXXW5Q46qmgGmD7w";
const CHAIN_NAME = "Amoy";
const CURRENCY_SYMBOL = "Matic";
//const BLOCK_EXPLORER = process.env.REACT_APP_BLOCK_EXPLORER;

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [claimableTokens, setClaimableTokens] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [giniContract, setGiniContract] = useState(null);
  const [approveAmount, setApproveAmount] = useState("");
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [receiver, setReceiver] = useState("");

  // Check if MetaMask is installed
  useEffect(() => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it to use this app.");
    }
  }, []);

  // Function to configure the network in MetaMask
  const configureNetwork = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

      if (currentChainId !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: CHAIN_ID }],
          });
        } catch (switchError) {
          // If the network is not added, add it to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: CHAIN_ID,
                  chainName: CHAIN_NAME,
                  nativeCurrency: {
                    name: CURRENCY_SYMBOL,
                    symbol: CURRENCY_SYMBOL,
                    decimals: 18,
                  },
                  rpcUrls: [RPC_URL],
                },
              ],
            });
          } else {
            throw new Error("Failed to switch network: " + switchError.message);
          }
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to initialize provider, signer, and contract
  const initializeBlockchain = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      await configureNetwork(); // Ensure network is set before proceeding

      const webProvider = new ethers.BrowserProvider(window.ethereum);
      const webSigner = await webProvider.getSigner();
      const webContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, webSigner);
      const webContract2 = new ethers.Contract(GINI_ADDRESS, GINI_ABI, webSigner);

      setProvider(webProvider);
      setSigner(webSigner);
      setContract(webContract);
      setGiniContract(webContract2);

      return { webProvider, webSigner, webContract, webContract2 };
    } catch (err) {
      setError(err.message);
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      const { webProvider, webSigner, webContract2 } = await initializeBlockchain();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const balance = await webContract2.balanceOf(webSigner.address);
      setBalance(ethers.formatEther(balance));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };
  // Function to update the user's balance without reloading the page
  const updateBalance = async () => {
    try {
      if (giniContract && account) {
        const newBalance = await giniContract.balanceOf(account);
        setBalance(ethers.formatEther(newBalance));
      }
    } catch (err) {
      console.error("Error updating balance:", err);
    }
  };

  // Claim Tokens (Query contract)
  const claimTokens = async () => {
    try {
      if (!contract) {
        throw new Error("Blockchain not initialized. Connect your wallet first.");
      }
      const tokens = await contract.unlockedTokens(account);
      console.log("tokens", tokens[0]);
      setClaimableTokens(tokens[0]);
    } catch (err) {
      setError(err.message);
    }
    reloadPage();
  };

  // Withdraw Tokens (Send transaction)
  const withdrawTokens = async () => {
    try {
      if (!contract) {
        throw new Error("Blockchain not initialized. Connect your wallet first.");
      }

      setStatusMessage("Processing transaction...");

      const tx = await contract.withdrawToken();
      await tx.wait(); // Wait for transaction confirmation
      setStatusMessage("Withdrawal successful! Check your wallet balance.");
    } catch (err) {
      setError(err.message);
      setStatusMessage("");
    }
    await updateBalance();
  };

  const approveTokens = async () => {
    if (!approveAmount || isNaN(approveAmount) || approveAmount <= 0) {
      alert("Enter a valid amount!");
      return;
    }

    try {
      const tx = await giniContract.approve(CONTRACT_ADDRESS, ethers.parseEther(approveAmount));
      await tx.wait();
      alert(`Tokens Approved!- ${approveAmount} GINI`);
    } catch (error) {
      console.error("Approval Error:", error);
      alert("Approval Failed!");
    }
  };

  const bridgeTokens = async () => {
    if (!bridgeAmount || isNaN(bridgeAmount) || bridgeAmount <= 0) {
      alert("Enter a valid amount!");
      return;
    }
    if (!ethers.isAddress(receiver)) {
      alert("Enter a valid Ethereum address!");
      return;
    }

    try {
      const tx = await contract.bridgeToken(receiver, ethers.parseEther(bridgeAmount));
      await tx.wait();
      alert(`${bridgeAmount} GINI Tokens Bridged! `);
    } catch (error) {
      console.error("Bridging Error:", error);
      alert("Bridging Failed!");
    }
    await updateBalance();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10 px" }}>
      <h1>Kalp Bridge </h1>

      {account ? (
        <div>
          <p>
            <strong>Connected Account:</strong> {account}
          </p>
          <p>
            <strong>Balance:</strong> {balance} GINI
          </p>
          <hr />

          <h2>KALP TO EVM</h2>

          <button onClick={claimTokens} style={{ padding: "10px", fontSize: "16px", marginTop: "10px" }}>
            Check Claimable Tokens
          </button>

          {claimableTokens !== null && (
            <p>
              <strong>Claimable Tokens:</strong> {claimableTokens}
            </p>
          )}

          <button
            onClick={withdrawTokens}
            style={{ padding: "10px", fontSize: "16px", marginTop: "10px", backgroundColor: "green", color: "white" }}
          >
            Withdraw Tokens
          </button>

          {statusMessage && <p style={{ color: "blue" }}>{statusMessage}</p>}
          <hr />
          <h2>EVM TO KALP</h2>
          <div>
            <input
              type="number"
              placeholder="Enter amount: 1 POL"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
            />

            <button
              onClick={approveTokens}
              style={{
                padding: "10px",
                fontSize: "16px",
                marginRight: "10px",
                backgroundColor: "orange",
                color: "white",
              }}
            >
              Approve Tokens
            </button>
            <input
              type="text"
              placeholder="Enter Receiver address"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
            />
            <input
              type="number"
              placeholder="Enter amount: 1 POL"
              value={bridgeAmount}
              onChange={(e) => setBridgeAmount(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
            />
            <button onClick={bridgeTokens} style={{ padding: "10px", fontSize: "16px", backgroundColor: "blue", color: "white" }}>
              Bridge Tokens
            </button>
          </div>
        </div>
      ) : (
        <button onClick={connectWallet} style={{ padding: "10px", fontSize: "16px" }}>
          Connect MetaMask
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
