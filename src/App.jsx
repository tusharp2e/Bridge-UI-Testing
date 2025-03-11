import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Network,
  register,
  createCsr,
  getEnrollmentId,
  getKeyPair,
  getKeyPairFromSeedPhrase,
  getSeedPhrase,
  submitTransaction,
  evaluateTransaction,
  registerAndEnrollUser,
  getRandSvalue,
} from "test-kalp-wallet-package";
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

// const privateKeyString =
//   "-----BEGIN PRIVATE KEY-----\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCDAtm8WWdQP+CL5omQfo9wa8fmBqxphaBFdH166sn9L2A==\n-----END PRIVATE KEY-----";
// const publicKeyString =
//   "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEx7tpJDEFxkndtLG7VWp9vVf8aQURZ1NMiHJVJaRUblPBtt/Tvx+ctb31k+oocPenN+lhvn8tBzjxfaDMpeFimQ==\n-----END PUBLIC KEY-----";
// const enrollmentId = "853a42ff6d297d34b62edf3c9b23ea8e037c207b";
// const cert =
//   "-----BEGIN CERTIFICATE-----\nMIIDdTCCAxugAwIBAgIUWdVUnaw8nDB3wXnGpRu91k5kbfwwCgYIKoZIzj0EAwIw\ngbgxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhEZWxhd2FyZTFQME4GA1UEBxNHUDJF\nIExBQlMgTExDICAxMDA3IE4gT3JhbmdlIFN0LiA0dGggRmxvb3IgU3RlIDEzODIg\nV2lsbWluZ3RvbiBVLlMgMTk4MDExETAPBgNVBAoTCE1BSSBMYWJzMQ8wDQYDVQQL\nEwZjbGllbnQxIDAeBgNVBAMTF2thbHBzdGFnZW5ldDEtaW50LWFkbWluMB4XDTI0\nMDQwMzA3NDIwMFoXDTI2MDMwNDEzMDMwMFowgcMxCzAJBgNVBAYTAklOMRYwFAYD\nVQQIEw1Zb3VyIFByb3ZpbmNlMRYwFAYDVQQHEw1Zb3VyIExvY2FsaXR5MRowGAYD\nVQQKExFZb3VyIE9yZ2FuaXphdGlvbjE1MA0GA1UECxMGY2xpZW50MA4GA1UECxMH\nY2xpZW50czAUBgNVBAsTDWthbHBzdGFnZW5ldDExMTAvBgNVBAMTKDg1M2E0MmZm\nNmQyOTdkMzRiNjJlZGYzYzliMjNlYThlMDM3YzIwN2IwWTATBgcqhkjOPQIBBggq\nhkjOPQMBBwNCAATHu2kkMQXGSd20sbtVan29V/xpBRFnU0yIclUlpFRuU8G239O/\nH5y1vfWT6ihw96c36WG+fy0HOPF9oMyl4WKZo4H1MIHyMA4GA1UdDwEB/wQEAwIH\ngDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBRmIQNZEl2UIS3uluSswjANoeeZuDAf\nBgNVHSMEGDAWgBRcR4QSSVDgTfN5sy2w8Rp4bYOjVzCBkQYIKgMEBQYHCAEEgYR7\nImF0dHJzIjp7ImhmLkFmZmlsaWF0aW9uIjoia2FscHN0YWdlbmV0MS5jbGllbnRz\nIiwiaGYuRW5yb2xsbWVudElEIjoiODUzYTQyZmY2ZDI5N2QzNGI2MmVkZjNjOWIy\nM2VhOGUwMzdjMjA3YiIsImhmLlR5cGUiOiJjbGllbnQifX0wCgYIKoZIzj0EAwID\nSAAwRQIhAJ6/FoT/9gJq3grdTabfHAW/mNRZ178pQLyHd9ernaiHAiAqvr4HwjmI\nCv5zTpiUfuypQ3RDHrej3SlftuLT7Ty1LA==\n-----END CERTIFICATE-----";
//const BLOCK_EXPLORER = process.env.REACT_APP_BLOCK_EXPLORER;

const privateKeyString = "-----BEGIN PRIVATE KEY-----\r\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCCfT4cOgAMixovrMi\/V\r\n2ZunH6Iqhw9IvCqZh+aBgWDFkQ==\r\n-----END PRIVATE KEY-----"
const publicKeyString = "-----BEGIN PUBLIC KEY-----\\r\\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAZi+5+qulPAr0XJ8SpB9DNYhYgaqK1t0GwH7GauB+r1CiGlXl3Fmbs+fB0YqbpbQMBt7u1w647A14EDXv+C48A==\\r\\n-----END PUBLIC KEY-----";
const cert = "-----BEGIN CERTIFICATE-----\nMIIDdTCCAxugAwIBAgIUVbc/NXhJDtDBk//bDucP9pYKAE8wCgYIKoZIzj0EAwIw\ngbgxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhEZWxhd2FyZTFQME4GA1UEBxNHUDJF\nIExBQlMgTExDICAxMDA3IE4gT3JhbmdlIFN0LiA0dGggRmxvb3IgU3RlIDEzODIg\nV2lsbWluZ3RvbiBVLlMgMTk4MDExETAPBgNVBAoTCE1BSSBMYWJzMQ8wDQYDVQQL\nEwZjbGllbnQxIDAeBgNVBAMTF2thbHBzdGFnZW5ldDEtaW50LWFkbWluMB4XDTI0\nMDQwMzA3NDIwMFoXDTI1MTAyMjE1MjMwMFowgcMxCzAJBgNVBAYTAklOMRYwFAYD\nVQQIEw1Zb3VyIFByb3ZpbmNlMRYwFAYDVQQHEw1Zb3VyIExvY2FsaXR5MRowGAYD\nVQQKExFZb3VyIE9yZ2FuaXphdGlvbjE1MA0GA1UECxMGY2xpZW50MA4GA1UECxMH\nY2xpZW50czAUBgNVBAsTDWthbHBzdGFnZW5ldDExMTAvBgNVBAMTKDBiODc5NzA0\nMzNiMjI0OTRmYWZmMWNjN2E4MTllNzFiZGRjNzg4MGMwWTATBgcqhkjOPQIBBggq\nhkjOPQMBBwNCAAQBmL7n6q6U8CvRcnxKkH0M1iFiBqorW3QbAfsZq4H6vUKIaVeX\ncWZuz58HRipultAwG3u7XDrjsDXgQNe/4Ljwo4H1MIHyMA4GA1UdDwEB/wQEAwIH\ngDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBQDx8fcPvIryA01y4HwbN6wMveZ+jAf\nBgNVHSMEGDAWgBRcR4QSSVDgTfN5sy2w8Rp4bYOjVzCBkQYIKgMEBQYHCAEEgYR7\nImF0dHJzIjp7ImhmLkFmZmlsaWF0aW9uIjoia2FscHN0YWdlbmV0MS5jbGllbnRz\nIiwiaGYuRW5yb2xsbWVudElEIjoiMGI4Nzk3MDQzM2IyMjQ5NGZhZmYxY2M3YTgx\nOWU3MWJkZGM3ODgwYyIsImhmLlR5cGUiOiJjbGllbnQifX0wCgYIKoZIzj0EAwID\nSAAwRQIhAJhNjbzg+C4ZKZurtOXwCMdx7avwgB+MU5UK6x6aGie7AiADkAw5jXNg\n+DuJ3vGoci9SW8gS9hvpEFvCXVG1bzGKDg==\n-----END CERTIFICATE-----";
const enrollmentId = "0b87970433b22494faff1cc7a819e71bddc7880c";

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

  const [approveAmountOnKalp, setApproveAmountOnKalp] = useState("");
  const [bridgeAmountOnKalp, setBridgeAmountOnKalp] = useState("");
  const [receiverOnKalp, setReceiverOnKalp] = useState("");
  const [balanceOnKalp, setBalanceOnKalp] = useState(null);
  const [balanceOnKalpBridge, setBalanceOnKalpBridge] = useState(null);
  const [txId, setTxId] = useState("");
  const [txIdStatus, setTxIdStatus] = useState("Not yet captured, retry!");

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
      console.log(tx.hash);
      setTxId(tx.hash);
      alert(`${bridgeAmount} GINI Tokens Bridged! `);
    } catch (error) {
      console.error("Bridging Error:", error);
      alert("Bridging Failed!");
    }
    await updateBalance();
  };

  const approveTokensOnKalp = async () => {
    //------Kalp to eth-----
    if (!approveAmountOnKalp || isNaN(approveAmountOnKalp) || approveAmountOnKalp <= 0) {
      alert("Enter a valid amount!");
      return;
    }

    const approveValue = (BigInt(Math.floor(parseFloat(approveAmountOnKalp) * 1e18))).toString();
    console.log(approveValue)
    const channelName = "kalp";
    const chainCodeName = "klp-f02611a93e-cc";
    const transactionName = "Approve";
    const transactionParams = ["klp-519fe60d6e-cc", approveValue];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
    console.log("Cert", cert);

    try {
      const makeTransaction = await submitTransaction(
        Network.Stagenet,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );
      const result = JSON.stringify(makeTransaction);
      console.log(`transaction data2: ${makeTransaction}`);
    } catch (error) {
      console.log(`error happenned while submitting transaction`, error);
    }
  };

  const bridgeTokensOnKalp = async () => {
    //------Kalp to eth-----
    if (!bridgeAmountOnKalp || isNaN(bridgeAmountOnKalp) || bridgeAmountOnKalp <= 0) {
      alert("Enter a valid amount!");
      return;
    }
    if (!ethers.isAddress(receiverOnKalp)) {
      alert("Enter a valid Ethereum address!");
      return;
    }

    const bridgeValue = (BigInt(Math.floor(parseFloat(bridgeAmountOnKalp) * 1e18))).toString();
    console.log(bridgeValue);
    const channelName = "kalp";
    const chainCodeName = "klp-519fe60d6e-cc";
    const transactionName = "BridgeToken";
    const transactionParams = [receiverOnKalp, bridgeValue];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
    console.log("Cert", cert);


    try {
      const makeTransaction = await submitTransaction(
        Network.Stagenet,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );
      const result = JSON.stringify(makeTransaction);
      console.log(`transaction data2: ${makeTransaction}`);
      setTxId(makeTransaction);
    } catch (error) {
      console.log(`error happenned while submitting transaction`, error);
    }
  };

  const withdrawTokensOnKalp = async () => {
    const channelName = "kalp";
    const chainCodeName = "klp-519fe60d6e-cc";
    const transactionName = "WithdrawToken";
    const transactionParams = [];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
    console.log("Cert", cert);

    try {
      const makeTransaction = await submitTransaction(
        Network.Stagenet,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );
      const result = JSON.stringify(makeTransaction);
      console.log(`transaction data2: ${makeTransaction}`);
    } catch (error) {
      console.log(`error happenned while submitting transaction`, error);
    }
  };
  const kalpBalance = async () => {
    const channelName = "kalp";
    const chainCodeName = "klp-f02611a93e-cc";
    const transactionName = "BalanceOf";
    const transactionParams = [enrollmentId];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
    console.log("Cert", cert);

    try {
      const balance = await evaluateTransaction(
        Network.Stagenet,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      console.log(`final response forevaluateTransaction :${balance}`);
      setBalanceOnKalp(balance / 10 ** 18);
    } catch (error) {
      console.log(`error happenned while evaluating transaction`, error);
    }
  };

  const kalpBridgeBalance = async () => {
    const channelName = "kalp";
    const chainCodeName = "klp-f02611a93e-cc";
    const transactionName = "BalanceOf";
    const transactionParams = ["klp-519fe60d6e-cc"];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
    console.log("Cert", cert);

    try {
      const balance = await evaluateTransaction(
        Network.Stagenet,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      console.log(`final response forevaluateTransaction :${balance}`);
      setBalanceOnKalpBridge(balance / 10 ** 18);
    } catch (error) {
      console.log(`error happenned while evaluating transaction`, error);
    }
  };

  const getTransactionStatus = async () => {

    if (txId == "") {
      alert("TxId is not set!");
    }

    const channelName = "kalp";
    const chainCodeName = "testing_kalpstore_newcc";
    const transactionName = "GetTxRecord";
    const transactionParams = [txId];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
    console.log("Cert", cert);

    try {
      const txIdResponse = await evaluateTransaction(
        Network.Stagenet,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      console.log(`tx received from kalp store :${txIdResponse}`);
      if (txIdResponse != "") {
        console.log(JSON.parse(txIdResponse).status)
        setTxIdStatus(JSON.parse(txIdResponse).status);
      } else {
        setTxIdStatus("Not yet captured!");
      }

    } catch (error) {
      console.log(`error happenned while evaluating transaction`, error);
      setTxIdStatus("Error: Not yet captured!");
    }
  };


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw", // Ensure full width
        textAlign: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "60%" }}>
        {" "}
        {/* Center content inside */}
        <h1>Kalp Bridge</h1>
        <hr />
        <h2>Kalp Wallet</h2>
        <p>
          <strong>Connected Account:</strong> {enrollmentId}
        </p>
        <p>
          <button
            onClick={kalpBalance}
            style={{
              padding: "10px",
              width: "190px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "blue",
              color: "white",
            }}
          >
            Balance
          </button>
          <strong>Balance:</strong> {balanceOnKalp} GINI
        </p>
        <p>
          <button
            onClick={kalpBridgeBalance}
            style={{
              padding: "10px",
              width: "190px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "blue",
              color: "white",
            }}
          >
            BridgeBalance
          </button>
          <strong>BridgeBalance:</strong> {balanceOnKalpBridge} GINI
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {" "}
          {/* Ensures input/buttons are centered */}
          <div>
            <input
              type="number"
              placeholder="Enter amount"
              value={approveAmountOnKalp}
              onChange={(e) => setApproveAmountOnKalp(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", margin: "10px", textAlign: "center" }}
            />
            <button
              onClick={approveTokensOnKalp}
              style={{
                padding: "10px",
                width: "190px",
                fontSize: "16px",
                margin: "10px",
                backgroundColor: "blue",
                color: "white",
              }}
            >
              Approve Tokens
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Receiver address"
              value={receiverOnKalp}
              onChange={(e) => setReceiverOnKalp(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", margin: "10px", textAlign: "center" }}
            />
            <input
              type="number"
              placeholder="Enter amount"
              value={bridgeAmountOnKalp}
              onChange={(e) => setBridgeAmountOnKalp(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", margin: "10px", textAlign: "center" }}
            />
            <button onClick={bridgeTokensOnKalp} style={{ padding: "10px", fontSize: "16px", backgroundColor: "blue", color: "white" }}>
              Bridge Tokens
            </button>
          </div>
          <button
            onClick={withdrawTokensOnKalp}
            style={{ padding: "10px", fontSize: "16px", margin: "10px", backgroundColor: "green", color: "white" }}
          >
            Withdraw Tokens
          </button>
          <br />
          <button
            onClick={getTransactionStatus}
            style={{ padding: "10px", fontSize: "16px", margin: "10px", backgroundColor: "green", color: "white" }}
          >
            GetStatus
          </button>
          <strong>Status :</strong> {txIdStatus}
        </div>
        <hr />
        <h2>Polygon Wallet</h2>
        {account ? (
          <div style={{ textAlign: "center" }}>
            <p>
              <strong>Connected Account:</strong> {account}
            </p>
            <p>
              <strong>Balance:</strong> {balance} GINI
            </p>

            <button onClick={claimTokens} style={{ padding: "10px", fontSize: "16px", margin: "10px" }}>
              Check Claimable Tokens
            </button>

            {claimableTokens !== null && (
              <p>
                <strong>Claimable Tokens:</strong> {claimableTokens}
              </p>
            )}

            <button
              onClick={withdrawTokens}
              style={{ padding: "10px", fontSize: "16px", margin: "10px", backgroundColor: "green", color: "white" }}
            >
              Withdraw Tokens
            </button>

            {statusMessage && <p style={{ color: "blue" }}>{statusMessage}</p>}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  style={{ padding: "10px", fontSize: "16px", margin: "10px", textAlign: "center" }}
                />

                <button
                  onClick={approveTokens}
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    margin: "10px",
                    backgroundColor: "orange",
                    color: "white",
                  }}
                >
                  Approve Tokens
                </button>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enter Receiver address"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  style={{ padding: "10px", fontSize: "16px", margin: "10px", textAlign: "center" }}
                />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  style={{ padding: "10px", fontSize: "16px", textAlign: "center", margin: "10px" }}
                />
                <button
                  onClick={bridgeTokens}
                  style={{ padding: "10px", margin: "10px", fontSize: "16px", backgroundColor: "blue", color: "white" }}
                >
                  Bridge Tokens
                </button>
                <button
                  onClick={getTransactionStatus}
                  style={{ padding: "10px", fontSize: "16px", margin: "10px", backgroundColor: "green", color: "white" }}
                >
                  GetStatus
                </button>
                <strong>Status :</strong> {txIdStatus}
              </div>
            </div>
          </div>
        ) : (
          <button onClick={connectWallet} style={{ padding: "10px", fontSize: "16px" }}>
            Connect MetaMask
          </button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;
