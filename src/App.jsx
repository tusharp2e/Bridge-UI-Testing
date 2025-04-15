import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Network, submitTransaction, evaluateTransaction } from "kalp-wallet-ts";
import { PolygonConnect } from "./PolygonConnect";
import { KalpConnect } from "./KalpConnect";
import "./App.css";


const networkName = import.meta.env.VITE_NETWORK_NAME;
const networkURL = import.meta.env.VITE_NETWORK_URL;
const kalpChannelName = import.meta.env.VITE_KALP_CHANNEL_NAME;
const kalpGiniChainCodeName = import.meta.env.VITE_KALP_GINI_CHAINCODE_NAME;
const kalpBridgeChainCodeName = import.meta.env.VITE_KALP_BRIDGE_CHAINCODE_NAME;
const kalpStoreChainCodeName = import.meta.env.VITE_KALP_BRIDGE_STORE_NAME;
const privateKeyString = import.meta.env.VITE_PRIV_KEY
const cert = import.meta.env.VITE_CERTS;
const enrollmentId =import.meta.env.VITE_ENROLL_ID;

function App() {
  const [txId, setTxId] = useState("");
  const [txIdStatus, setTxIdStatus] = useState("Not yet captured, retry!");
  const [txIdByInput, setTxIdByInput] = useState("");
  const [addressToFund, setAddressToFund] = useState("");

  const kalpGetTxRecordByInput = async () => {
    console.log("caaling kalpGetTxRecordByInput", txIdByInput);
    const channelName = kalpChannelName;
    const chainCodeName = kalpStoreChainCodeName;
    const transactionName = "GetTxRecord";
    const transactionParams = [txIdByInput];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("Cert", cert);

    try {
      // const record = await evaluateTransaction(
      //   networkName,
      //   networkURL,
      //   enrollmentId,
      //   privateKeyString,
      //   cert,
      //   channelName,
      //   chainCodeName,
      //   transactionName,
      //   transactionParams
      // );

      const record = await evaluateTransaction(
        networkName,
        networkURL,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      console.log(`kalp bridge record :${record}`);
      alert(record)
    } catch (error) {
      console.log(`error happenned while evaluating transaction`, error);
    }
  }

  const kalpGetTxRecord = async () => {
    console.log("caaling kalpGetTxRecord");
    const channelName = kalpChannelName;
    const chainCodeName = kalpStoreChainCodeName;
    const transactionName = "GetTxRecord";
    const transactionParams = ["2b2abc4e827d19f01786c6f8d6d7315ce0b6e197fa42b4caf6cd78bd352a1bbd"];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("Cert", cert);

    try {
      const record = await evaluateTransaction(
        networkName,
        networkURL,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      console.log(`kalp bridge record :${record}`);
      alert(record)
    } catch (error) {
      console.log(`error happenned while evaluating transaction`, error);
    }
  };

  const kalpGetHistoryOfTxID = async () => {
    console.log("caaling kalpGetTxRecord");
    const channelName = kalpChannelName;
    const chainCodeName = kalpStoreChainCodeName;
    const transactionName = "GetHistoryOfTxID";
    const transactionParams = ["55e3bcc535d48de7963dd6e79d3a6249b5fc66a5274de321db590518ed6a55a4"];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("Cert", cert);

    try {
      const record = await evaluateTransaction(
        networkName,
        networkURL,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      console.log(`kalp bridge record :${record}`);
      alert(record)
    } catch (error) {
      console.log(`error happenned while evaluating transaction`, error);
    }
  };


  const getTransactionStatus = async () => {

    if (txId == "") {
      alert("TxId is not set!");
    }

    const channelName = kalpChannelName;
    const chainCodeName = kalpStoreChainCodeName;
    const transactionName = "GetTxRecord";
    const transactionParams = [txId];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("Cert", cert);

    try {
      const txIdResponse = await evaluateTransaction(
        networkName,
        networkURL,
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

  const kalpGetFaucets = async () => {
    if (addressToFund == "") {
      alert("address is not set!");
    }

    const channelName = kalpChannelName;
    const chainCodeName = kalpGiniChainCodeName;
    const transactionName = "Transfer";
    const transactionParams = [addressToFund, "100000000000000000"];

    try {
      const txIdResponse = await submitTransaction(
        networkName,
        networkURL,
        enrollmentId,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      console.log(`tx received from kalp store :${txIdResponse}`);
      alert("Account funded with 0.1 Gini");
    } catch (error) {
      console.log(`error happenned while submitting transaction`, error);
      alert("Account funding failed!");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Kalp Bridge - DevNet</h1>
        <hr />
        <KalpConnect />
        <div className="button-group">
          <button onClick={getTransactionStatus} className="btn btn-green">Get Status</button>
          <button onClick={kalpGetTxRecord} className="btn btn-green">Get Tx Record</button>
          <button onClick={kalpGetHistoryOfTxID} className="btn btn-green">Get Tx History</button>
          <div className="input-group">
            <input type="text" placeholder="Enter txID" value={txIdByInput} onChange={(e) => setTxIdByInput(e.target.value)} className="input" />
            <button onClick={kalpGetTxRecordByInput} className="btn btn-orange">GetTx Record</button>
          </div>
          <div className="input-group">
            <input type="text" placeholder="Enter account" value={addressToFund} onChange={(e) => setAddressToFund(e.target.value)} className="input" />
            <button onClick={kalpGetFaucets} className="btn btn-orange">Get Faucets 0.1</button>
          </div>
        </div>
        <p className="status">Status: {txIdStatus}</p>
      </div>
      <hr className="divider" />
      <div className="card">
        <h2>Polygon Wallet</h2>
        <PolygonConnect />
      </div>
    </div>
  );
}

export default App;
