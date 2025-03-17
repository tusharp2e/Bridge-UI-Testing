import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Network, submitTransaction, evaluateTransaction } from "kalp-wallet-ts";
import { PolygonConnect } from "./PolygonConnect";
import { KalpConnect } from "./KalpConnect";
import "./App.css";

const networkName = "stagenet"
const networkURL = "https://stg-kalp-gateway.p2eppl.com/transaction/v1";
const kalpChannelName = "kalp";
const kalpGiniChainCodeName = "klp-f02611a93e-cc";
const kalpBridgeChainCodeName = "klp-519fe60d6e-cc";
// const kalpStoreChainCodeName = "testing_kalpstore_newcc";
const kalpStoreChainCodeName = "klp-e7e044e8c0-cc";
const privateKeyString = "-----BEGIN PRIVATE KEY-----\r\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCCfT4cOgAMixovrMi\/V\r\n2ZunH6Iqhw9IvCqZh+aBgWDFkQ==\r\n-----END PRIVATE KEY-----"
const publicKeyString = "-----BEGIN PUBLIC KEY-----\\r\\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAZi+5+qulPAr0XJ8SpB9DNYhYgaqK1t0GwH7GauB+r1CiGlXl3Fmbs+fB0YqbpbQMBt7u1w647A14EDXv+C48A==\\r\\n-----END PUBLIC KEY-----";
const cert = "-----BEGIN CERTIFICATE-----\nMIIDdTCCAxugAwIBAgIUVbc/NXhJDtDBk//bDucP9pYKAE8wCgYIKoZIzj0EAwIw\ngbgxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhEZWxhd2FyZTFQME4GA1UEBxNHUDJF\nIExBQlMgTExDICAxMDA3IE4gT3JhbmdlIFN0LiA0dGggRmxvb3IgU3RlIDEzODIg\nV2lsbWluZ3RvbiBVLlMgMTk4MDExETAPBgNVBAoTCE1BSSBMYWJzMQ8wDQYDVQQL\nEwZjbGllbnQxIDAeBgNVBAMTF2thbHBzdGFnZW5ldDEtaW50LWFkbWluMB4XDTI0\nMDQwMzA3NDIwMFoXDTI1MTAyMjE1MjMwMFowgcMxCzAJBgNVBAYTAklOMRYwFAYD\nVQQIEw1Zb3VyIFByb3ZpbmNlMRYwFAYDVQQHEw1Zb3VyIExvY2FsaXR5MRowGAYD\nVQQKExFZb3VyIE9yZ2FuaXphdGlvbjE1MA0GA1UECxMGY2xpZW50MA4GA1UECxMH\nY2xpZW50czAUBgNVBAsTDWthbHBzdGFnZW5ldDExMTAvBgNVBAMTKDBiODc5NzA0\nMzNiMjI0OTRmYWZmMWNjN2E4MTllNzFiZGRjNzg4MGMwWTATBgcqhkjOPQIBBggq\nhkjOPQMBBwNCAAQBmL7n6q6U8CvRcnxKkH0M1iFiBqorW3QbAfsZq4H6vUKIaVeX\ncWZuz58HRipultAwG3u7XDrjsDXgQNe/4Ljwo4H1MIHyMA4GA1UdDwEB/wQEAwIH\ngDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBQDx8fcPvIryA01y4HwbN6wMveZ+jAf\nBgNVHSMEGDAWgBRcR4QSSVDgTfN5sy2w8Rp4bYOjVzCBkQYIKgMEBQYHCAEEgYR7\nImF0dHJzIjp7ImhmLkFmZmlsaWF0aW9uIjoia2FscHN0YWdlbmV0MS5jbGllbnRz\nIiwiaGYuRW5yb2xsbWVudElEIjoiMGI4Nzk3MDQzM2IyMjQ5NGZhZmYxY2M3YTgx\nOWU3MWJkZGM3ODgwYyIsImhmLlR5cGUiOiJjbGllbnQifX0wCgYIKoZIzj0EAwID\nSAAwRQIhAJhNjbzg+C4ZKZurtOXwCMdx7avwgB+MU5UK6x6aGie7AiADkAw5jXNg\n+DuJ3vGoci9SW8gS9hvpEFvCXVG1bzGKDg==\n-----END CERTIFICATE-----";
const enrollmentId = "0b87970433b22494faff1cc7a819e71bddc7880c";

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
    console.log("publicKeyString", publicKeyString);
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
        <h1>Kalp Bridge</h1>
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
