import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Network, submitTransaction, evaluateTransaction } from "kalp-wallet-ts";
import { PolygonConnect } from "./PolygonConnect";
import { KalpConnect } from "./KalpConnect";
import "./App.css";


function App() {
  const [txId, setTxId] = useState("");
  const [txIdStatus, setTxIdStatus] = useState("Not yet captured, retry!");

  const kalpGetTxRecord = async () => {
    console.log("caaling kalpGetTxRecord");
    const channelName = kalpChannelName;
    const chainCodeName = kalpStoreChainCodeName;
    const transactionName = "GetTxRecord";
    const transactionParams = ["2b2abc4e827d19f01786c6f8d6d7315ce0b6e197fa42b4caf6cd78bd352a1bbd"];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
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
    console.log("publicKeyString", publicKeyString);
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
    console.log("publicKeyString", publicKeyString);
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

  return (
    <div className="container">
      <div className="card">
        <h1>Kalp Bridge</h1>
        <hr />
        <KalpConnect />
        <div className="button-group">
          <button onClick={getTransactionStatus} className="btn btn-green">Get Status</button>
          <button onClick={kalpGetTxRecord} className="btn btn-green">Get Tx Record</button>
          <button onClick={kalpGetHistoryOfTxID} className="btn btn-green">Get Tx History</button>
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
