import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Network, submitTransaction, evaluateTransaction } from "kalp-wallet-ts";
import {
    getToken,
    connectToWallet,
    getEnrollmentIdFromWallet,
    readTransactionFromWallet,
    writeTransactionFromWallet,
} from "kalp-dapp-pkg";
import { CONSTANTS } from "./constants";



// const privateKeyString =
//   "-----BEGIN PRIVATE KEY-----\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCDAtm8WWdQP+CL5omQfo9wa8fmBqxphaBFdH166sn9L2A==\n-----END PRIVATE KEY-----";
// const publicKeyString =
//   "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEx7tpJDEFxkndtLG7VWp9vVf8aQURZ1NMiHJVJaRUblPBtt/Tvx+ctb31k+oocPenN+lhvn8tBzjxfaDMpeFimQ==\n-----END PUBLIC KEY-----";
// const enrollmentId = "853a42ff6d297d34b62edf3c9b23ea8e037c207b";
// const cert =
//   "-----BEGIN CERTIFICATE-----\nMIIDdTCCAxugAwIBAgIUWdVUnaw8nDB3wXnGpRu91k5kbfwwCgYIKoZIzj0EAwIw\ngbgxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhEZWxhd2FyZTFQME4GA1UEBxNHUDJF\nIExBQlMgTExDICAxMDA3IE4gT3JhbmdlIFN0LiA0dGggRmxvb3IgU3RlIDEzODIg\nV2lsbWluZ3RvbiBVLlMgMTk4MDExETAPBgNVBAoTCE1BSSBMYWJzMQ8wDQYDVQQL\nEwZjbGllbnQxIDAeBgNVBAMTF2thbHBzdGFnZW5ldDEtaW50LWFkbWluMB4XDTI0\nMDQwMzA3NDIwMFoXDTI2MDMwNDEzMDMwMFowgcMxCzAJBgNVBAYTAklOMRYwFAYD\nVQQIEw1Zb3VyIFByb3ZpbmNlMRYwFAYDVQQHEw1Zb3VyIExvY2FsaXR5MRowGAYD\nVQQKExFZb3VyIE9yZ2FuaXphdGlvbjE1MA0GA1UECxMGY2xpZW50MA4GA1UECxMH\nY2xpZW50czAUBgNVBAsTDWthbHBzdGFnZW5ldDExMTAvBgNVBAMTKDg1M2E0MmZm\nNmQyOTdkMzRiNjJlZGYzYzliMjNlYThlMDM3YzIwN2IwWTATBgcqhkjOPQIBBggq\nhkjOPQMBBwNCAATHu2kkMQXGSd20sbtVan29V/xpBRFnU0yIclUlpFRuU8G239O/\nH5y1vfWT6ihw96c36WG+fy0HOPF9oMyl4WKZo4H1MIHyMA4GA1UdDwEB/wQEAwIH\ngDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBRmIQNZEl2UIS3uluSswjANoeeZuDAf\nBgNVHSMEGDAWgBRcR4QSSVDgTfN5sy2w8Rp4bYOjVzCBkQYIKgMEBQYHCAEEgYR7\nImF0dHJzIjp7ImhmLkFmZmlsaWF0aW9uIjoia2FscHN0YWdlbmV0MS5jbGllbnRz\nIiwiaGYuRW5yb2xsbWVudElEIjoiODUzYTQyZmY2ZDI5N2QzNGI2MmVkZjNjOWIy\nM2VhOGUwMzdjMjA3YiIsImhmLlR5cGUiOiJjbGllbnQifX0wCgYIKoZIzj0EAwID\nSAAwRQIhAJ6/FoT/9gJq3grdTabfHAW/mNRZ178pQLyHd9ernaiHAiAqvr4HwjmI\nCv5zTpiUfuypQ3RDHrej3SlftuLT7Ty1LA==\n-----END CERTIFICATE-----";
//const BLOCK_EXPLORER = process.env.REACT_APP_BLOCK_EXPLORER;

const networkName = "devnet"
const networkURL = "https://dev-kalp-gateway.p2eppl.com/transaction/v1";
const kalpChannelName = "kalp-devnet";
const kalpGiniChainCodeName = "klp-f02611a93e-cc";
const kalpBridgeChainCodeName = "klp-519fe60d6e-cc";
const kalpStoreChainCodeName = "klp-e7e044e8c0-cc";
const privateKeyString = "-----BEGIN PRIVATE KEY-----\r\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCAC76nQOppljTeIa+nD\r\nJMgBIqL2sn68e3YmmRMIyT1dng==\r\n-----END PRIVATE KEY-----"
const publicKeyString = "EMPTY";
const cert = "-----BEGIN CERTIFICATE-----\r\nMIIDYDCCAwagAwIBAgIUBRI+pNAFznvdB5QJJARztfXzffswCgYIKoZIzj0EAwIw\r\ngbIxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhEZWxhd2FyZTFQME4GA1UEBxNHUDJF\r\nIExBQlMgTExDICAxMDA3IE4gT3JhbmdlIFN0LiA0dGggRmxvb3IgU3RlIDEzODIg\r\nV2lsbWluZ3RvbiBVLlMgMTk4MDExETAPBgNVBAoTCE1BSSBMYWJzMQ8wDQYDVQQL\r\nEwZjbGllbnQxGjAYBgNVBAMTEWV4YW1wbGUtaW50LWFkbWluMB4XDTI1MDMyNDEx\r\nMTUwMFoXDTI2MDQxMTA5MzgwMFowgbwxCzAJBgNVBAYTAklOMRYwFAYDVQQIEw1Z\r\nb3VyIFByb3ZpbmNlMRYwFAYDVQQHEw1Zb3VyIExvY2FsaXR5MRowGAYDVQQKExFZ\r\nb3VyIE9yZ2FuaXphdGlvbjEuMAwGA1UECxMFYWRtaW4wDgYDVQQLEwdjbGllbnRz\r\nMA4GA1UECxMHZXhhbXBsZTExMC8GA1UEAxMoMDU2MWI2YWVkOTA0NjMwMTJhZGYx\r\nYzMwZGY0YjllMGUzZGMxMTg1NjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJev\r\nc9DWU98RdQIDjwNX/tsTRnTz1c702sS0aq5DXl9/9yPCqmgNY0gzIHK4PUSwxavH\r\noMEdRwHkt6n7bETDSVWjge0wgeowDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQC\r\nMAAwHQYDVR0OBBYEFOL3sXLJg0GXt26h4e6PoIdWShihMB8GA1UdIwQYMBaAFGY8\r\n8h0o3yYDKirES5q6XcUOZzsqMIGJBggqAwQFBgcIAQR9eyJhdHRycyI6eyJoZi5B\r\nZmZpbGlhdGlvbiI6ImV4YW1wbGUuY2xpZW50cyIsImhmLkVucm9sbG1lbnRJRCI6\r\nIjA1NjFiNmFlZDkwNDYzMDEyYWRmMWMzMGRmNGI5ZTBlM2RjMTE4NTYiLCJoZi5U\r\neXBlIjoiYWRtaW4ifX0wCgYIKoZIzj0EAwIDSAAwRQIhAJYLUnFeWkbe2jPYUxMg\r\nur1cv/76kfgQlNQqwuMgWCfVAiAJSM0owSiBDmWPmvfWyNMJS0CHXuWAvwUdD4hk\r\nnDsViw==\r\n-----END CERTIFICATE-----";
const enrollmentId = "0561b6aed90463012adf1c30df4b9e0e3dc11856";

// const networkName = "Mainnet";
// const networkURL = "https://rpc-mumbai.kalp.network/transaction/v1";
// const kalpChannelName = "kalptwo";
// const kalpGiniChainCodeName = "klp-f02611a93e-cc";
// const kalpBridgeChainCodeName = "klp-519fe60d6e-cc";
// const kalpStoreChainCodeName = "klp-e7e044e8b0-cc";

// // shubham
// const privateKeyString = "-----BEGIN PRIVATE KEY-----\r\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCDXTr2C9suU\/AihT0xo\r\nWeiM0W+hhvYMn7eZMbPdno4vbQ==\r\n-----END PRIVATE KEY-----"
// const publicKeyString = "";
// const cert = "-----BEGIN CERTIFICATE-----\nMIIDcTCCAxigAwIBAgIUFFtYxERUsYj/jTJtoPCB2aWHivowCgYIKoZIzj0EAwIw\ngbcxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhEZWxhd2FyZTFQME4GA1UEBxNHUDJF\nIExBQlMgTExDICAxMDA3IE4gT3JhbmdlIFN0LiA0dGggRmxvb3IgU3RlIDEzODIg\nV2lsbWluZ3RvbiBVLlMgMTk4MDExETAPBgNVBAoTCE1BSSBMYWJzMQ8wDQYDVQQL\nEwZjbGllbnQxHzAdBgNVBAMTFmthbHBjaGFpbnR3by1pbnQtYWRtaW4wHhcNMjMw\nNzE0MTUyNjAwWhcNMjYwMzEyMTExNjAwWjCBwjELMAkGA1UEBhMCSU4xFjAUBgNV\nBAgTDVlvdXIgUHJvdmluY2UxFjAUBgNVBAcTDVlvdXIgTG9jYWxpdHkxGjAYBgNV\nBAoTEVlvdXIgT3JnYW5pemF0aW9uMTQwDQYDVQQLEwZjbGllbnQwDgYDVQQLEwdj\nbGllbnRzMBMGA1UECxMMa2FscGNoYWludHdvMTEwLwYDVQQDEyg4NzNlZThjMjU3\nYzZhNjkxNDBiYTZmMzA5MzdlYTg1Y2U2ZDY3YzFhMFkwEwYHKoZIzj0CAQYIKoZI\nzj0DAQcDQgAE0F5SwjOMxlBUNjBiWXrhKkMuX0MUIpbDi2zyep3JPK6hXVgVhD6N\nmTQocoY82jrFwSnoBgf7tiQ9LdgJkMFKlaOB9DCB8TAOBgNVHQ8BAf8EBAMCB4Aw\nDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUJlaGxvXJUbkwLFLmcMlVNYO1SBUwHwYD\nVR0jBBgwFoAUevzhkjuu5jCjJuQbQQqhKuCXw4swgZAGCCoDBAUGBwgBBIGDeyJh\ndHRycyI6eyJoZi5BZmZpbGlhdGlvbiI6ImthbHBjaGFpbnR3by5jbGllbnRzIiwi\naGYuRW5yb2xsbWVudElEIjoiODczZWU4YzI1N2M2YTY5MTQwYmE2ZjMwOTM3ZWE4\nNWNlNmQ2N2MxYSIsImhmLlR5cGUiOiJjbGllbnQifX0wCgYIKoZIzj0EAwIDRwAw\nRAIgAgNeqSrC6yw3F2hYsGbncfKDrMlRGcHaWR8yA2VKrWsCIFkMvmz70qkOHEVN\nAYcduQaLEKju/QOaIefAWv+o0W1S\n-----END CERTIFICATE-----";
// const enrollmentId = "873ee8c257c6a69140ba6f30937ea85ce6d67c1a";

function KalpConnect() {
    const [approveAmountOnKalp, setApproveAmountOnKalp] = useState("");
    const [bridgeAmountOnKalp, setBridgeAmountOnKalp] = useState("");
    const [receiverOnKalp, setReceiverOnKalp] = useState("");
    const [balanceOnKalp, setBalanceOnKalp] = useState(null);
    const [balanceOnKalpBridge, setBalanceOnKalpBridge] = useState(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [enrollmentId, setenrollmentId] = useState("");

    // move
    const connectWalletKalp = async () => {
        try {
            let dappToken = getToken();
            localStorage.setItem("kalp_dappToken", dappToken);
            const res = await connectToWallet(
                dappToken,
                CONSTANTS.dappName,
                CONSTANTS.faviconURL,
                CONSTANTS.apiBaseURL,
            );
            if (res === true) {
                setWalletConnected(true);
                await getEnrollmentId();
            }
        } catch (e) {
            console.log(`Error connecting wallet: ${e}`);
        }
    };

    const getEnrollmentId = async () => {
        try {
            const dappToken = localStorage.getItem("kalp_dappToken") || "";
            if (!dappToken) {
                console.log("Error: no dappToken exists");
                throw new Error("Error: no dappToken exists");
            }
            const res = (await getEnrollmentIdFromWallet(dappToken, "OPENSEA", "http://localhost:3000/favicon.ico", "http://localhost:3000")) || "";
            console.log("res", res)
            setenrollmentId(res);

            localStorage.setItem("opensea_enrollmentId", res);
        } catch (e) {
            // TODO: format the error msg
            console.log(`error is :${e}`);
        }
    };

    // move
    const approveTokensOnKalp = async () => {
        //------Kalp to eth-----
        if (!approveAmountOnKalp || isNaN(approveAmountOnKalp) || approveAmountOnKalp <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        console.log("==============Aprrove==============")
        console.log(approveAmountOnKalp);
        alert(`approveAmount: , ${(ethers.parseEther(approveAmountOnKalp)).toString()}`);
        const channelName = kalpChannelName;
        const chainCodeName = kalpGiniChainCodeName;
        const transactionName = "Approve";
        const transactionParams = [kalpBridgeChainCodeName, (ethers.parseEther(approveAmountOnKalp)).toString()];

        // console.log("enrollmentID", enrollmentId);
        // console.log("transactionParams", transactionParams);
        // console.log("privateKeyString", privateKeyString);
        // console.log("publicKeyString", publicKeyString);
        // console.log("Cert", cert);

        try {
            // const makeTransaction = await submitTransaction(
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

            let dappToken = localStorage.getItem("kalp_dappToken");

            const makeTransaction = await writeTransactionFromWallet(
                dappToken,
                CONSTANTS.dappName,
                CONSTANTS.faviconURL,
                CONSTANTS.apiBaseURL,
                channelName,
                chainCodeName,
                transactionName,
                transactionParams
            );

            const result = JSON.stringify(makeTransaction);
            console.log(`Approve token on kalp successful! : ${result}`);
        } catch (error) {
            console.log(`error happenned while submitting transaction`, error);
        }
    };

    // move
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

        console.log("==============Aprrove==============")
        console.log(bridgeAmountOnKalp);
        alert(`bridgeAmount: , ${(ethers.parseEther(bridgeAmountOnKalp)).toString()}`);
        const channelName = kalpChannelName;
        const chainCodeName = kalpBridgeChainCodeName;
        const transactionName = "BridgeToken";
        const transactionParams = [receiverOnKalp, (ethers.parseEther(bridgeAmountOnKalp)).toString()];

        console.log("enrollmentID", enrollmentId);
        console.log("transactionParams", transactionParams);
        console.log("privateKeyString", privateKeyString);
        console.log("publicKeyString", publicKeyString);
        console.log("Cert", cert);


        try {
            // const makeTransaction = await submitTransaction(
            //     networkName,
            //     networkURL,
            //     enrollmentId,
            //     privateKeyString,
            //     cert,
            //     channelName,
            //     chainCodeName,
            //     transactionName,
            //     transactionParams
            // );

            let dappToken = localStorage.getItem("kalp_dappToken");
            const makeTransaction = await writeTransactionFromWallet(
                dappToken,
                CONSTANTS.dappName,
                CONSTANTS.faviconURL,
                CONSTANTS.apiBaseURL,
                channelName,
                chainCodeName,
                transactionName,
                transactionParams
            );

            const result = JSON.stringify(makeTransaction);
            console.log(`transaction data2: ${JSON.stringify(makeTransaction)}`);
            // setTxId(makeTransaction);
        } catch (error) {
            console.log(`error happenned while submitting transaction`, error);
        }
    };

    // move
    const withdrawTokensOnKalp = async () => {
        const channelName = kalpChannelName;
        const chainCodeName = kalpBridgeChainCodeName;
        const transactionName = "WithdrawToken";
        const transactionParams = [];

        console.log("enrollmentID", enrollmentId);
        console.log("transactionParams", transactionParams);
        console.log("privateKeyString", privateKeyString);
        console.log("publicKeyString", publicKeyString);
        console.log("Cert", cert);

        try {
            const makeTransaction = await submitTransaction(
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
            const result = JSON.stringify(makeTransaction);
            console.log(`withdraw tokens on kalp successful!: ${makeTransaction}`);
        } catch (error) {
            console.log(`error happenned while submitting transaction`, error);
        }
    };

    // move
    const kalpBalance = async () => {
        const channelName = kalpChannelName;
        const chainCodeName = kalpGiniChainCodeName;
        const transactionName = "BalanceOf";
        const transactionParams = [enrollmentId];

        console.log("enrollmentID", enrollmentId);
        console.log("transactionParams", transactionParams);
        console.log("privateKeyString", privateKeyString);
        console.log("publicKeyString", publicKeyString);
        console.log("Cert", cert);

        try {
            // const balance = await evaluateTransaction(
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
            let dappToken = localStorage.getItem("kalp_dappToken");

            const balance = await readTransactionFromWallet(
                dappToken,
                CONSTANTS.dappName,
                CONSTANTS.faviconURL,
                CONSTANTS.apiBaseURL,
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

    // move
    const kalpBridgeBalance = async () => {
        const channelName = kalpChannelName;
        const chainCodeName = kalpGiniChainCodeName;
        const transactionName = "BalanceOf";
        const transactionParams = [kalpBridgeChainCodeName];

        console.log("enrollmentID", enrollmentId);
        console.log("transactionParams", transactionParams);
        console.log("privateKeyString", privateKeyString);
        console.log("publicKeyString", publicKeyString);
        console.log("Cert", cert);

        try {
            const balance = await evaluateTransaction(
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

            console.log(`kalp bridge balance :${balance}`);
            setBalanceOnKalpBridge(balance / 10 ** 18);
        } catch (error) {
            console.log(`error happenned while evaluating transaction`, error);
        }
    };

    return (
        <div className="card">
            <h2>Kalp Wallet</h2>
            <button onClick={connectWalletKalp} className="btn">Connect Kalp Wallet</button>
            <p><strong>Connected Account:</strong> {enrollmentId}</p>
            <div className="button-group">
                <button onClick={kalpBalance} className="btn btn-blue">Balance</button>
                <p><strong>Balance:</strong> {balanceOnKalp} GINI</p>
                <button onClick={kalpBridgeBalance} className="btn btn-blue">Bridge Balance</button>
                <p><strong>Bridge Balance:</strong> {balanceOnKalpBridge} GINI</p>
            </div>
            <div className="input-group">
                <input type="number" placeholder="Enter amount" value={approveAmountOnKalp} onChange={(e) => setApproveAmountOnKalp(e.target.value)} className="input" />
                <button onClick={approveTokensOnKalp} className="btn btn-orange">Approve Tokens</button>
            </div>
            <div className="input-group">
                <input type="text" placeholder="Enter Receiver address" value={receiverOnKalp} onChange={(e) => setReceiverOnKalp(e.target.value)} className="input" />
                <input type="number" placeholder="Enter amount" value={bridgeAmountOnKalp} onChange={(e) => setBridgeAmountOnKalp(e.target.value)} className="input" />
                <button onClick={bridgeTokensOnKalp} className="btn btn-blue">Bridge Tokens</button>
            </div>
            <button onClick={withdrawTokensOnKalp} className="btn btn-green">Withdraw Tokens</button>
        </div>
    );
}
export { KalpConnect };