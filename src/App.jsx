import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

  return (
    <Router>
      <div className="container">

        <div className="card">
          <h1>Kalp Bridge</h1>

          {/* Navigation */}
          <nav style={{
            backgroundColor: " #80CBC4", textDecoration: "none", padding: "5px"
          }} >
            <ul>
              < li > <Link to="/stagenet" style={{ color: "white", textDecoration: "none" }}
                onMouseEnter={(e) => e.target.style.color = "blue"}
                onMouseLeave={(e) => e.target.style.color = "white"}>Kalp Wallet: Kalp StageNet</Link></li>
              <li><Link to="/polygonAmoy" style={{ color: "white", textDecoration: "none" }}
                onMouseEnter={(e) => e.target.style.color = "blue"}
                onMouseLeave={(e) => e.target.style.color = "white"}>Metamask Wallet: Polygon Amoy</Link></li>
            </ul>
          </nav>

          {/* Define Routes */}
          <Routes>
            <Route path="/stagenet" element={<KalpConnect />} />
            <Route path="/polygonAmoy" element={<PolygonConnect />} />
          </Routes>
        </div >
      </div >
    </Router >
  );

}

export default App;
