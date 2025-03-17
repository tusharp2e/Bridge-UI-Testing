var r=require("ethers"),e=require("elliptic"),t=require("jsrsasign"),n=require("buffer"),o="p256",i="hex",c="pkcs8",s="f5b1aca0717e01d0dbca408d281e9e5145250acb146ff9f0844d53e95aab30b5",u="/pki/register",a="/pki/enrollCsr",l="sign",h="ECDSA",m="P-256",f="verify";function v(r,e){try{var t=r()}catch(r){return e(r)}return t&&t.then?t.then(void 0,e):t}var g,P=function(r,c){try{try{var s,u,a=t.KEYUTIL.getKey(r).prvKeyHex,l=new e.ec(o),h=l.keyFromPrivate(a,i),m=l.sign(n.Buffer.from(c),h);return s=m.r.toString(),u=m.s.toString(),Promise.resolve([s,u])}catch(r){throw Error("An error occurred in signUsingElliptic function:"+r)}}catch(r){return Promise.reject(r)}},p=function(r){try{try{for(var e={},t=0;t<64;t++)e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[t]]=t;e["="]=0;for(var n=new Uint8Array(r.length),o=0,i=0;i<r.length;i+=4){var c=e[r[i+1]],s=e[r[i+2]],u=e[r[i+3]];n[o]=e[r[i]]<<2|c>>4,o++,"="!==r[i+2]&&(n[o]=c<<4|s>>2,o++),"="!==r[i+3]&&(n[o]=s<<6|u,o++)}return Promise.resolve(n.slice(0,o))}catch(r){throw Error("An error occurred in decodeBase64String function:"+r)}}catch(r){return Promise.reject(r)}},d=function(r,e){try{return Promise.resolve(v(function(){return Promise.resolve(fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).then(function(e){return Promise.resolve(e.json()).then(function(t){if(e.ok)return t;if(null!==t)throw Error("An error occurred while pinging url: "+r+",  message: "+JSON.stringify(t));throw Error("An error occurred while pinging url: "+r)})})},function(r){throw Error("An error occurred in restCall :"+r)}))}catch(r){return Promise.reject(r)}},y=function(r,e,t,n){try{return Promise.resolve(v(function(){return Promise.resolve(d(e,n)).then(function(e){var n=e.message.proposal;return Promise.resolve(p(n)).then(function(e){return Promise.resolve(P(r,e)).then(function(r){return Promise.resolve(d(t,{signedR:r[0],signedS:r[1],proposal:n})).then(function(r){return r.message.evaluate})})})})},function(r){throw Error("An error occurred while evaluateSignedTransaction :"+r)}))}catch(r){return Promise.reject(r)}},w=function(r){try{return Promise.resolve(v(function(){var e=(new TextEncoder).encode(r);return Promise.resolve(g.subtle.digest("SHA-256",e)).then(function(r){var e=function(r){return Array.from(new Uint8Array(r)).map(function(r){return r.toString(16).padStart(2,"0")}).join("")}(r),t="ABCDEFGHIJKLMNOPQRSTUVWXYZ",n="abcdefghijklmnopqrstuvwxyz",o="!@#$%^&*+-=",i="0123456789";function c(r,e){var t=parseInt(r.slice(2*e,2*e+2),16)%s.length;return s[t]}var s=t+n+o+i,u="";u+=t[parseInt(e.slice(0,2),16)%26],u+=n[parseInt(e.slice(2,4),16)%26],u+=o[parseInt(e.slice(4,6),16)%11],u+=i[parseInt(e.slice(6,8),16)%10];for(var a=4;a<16;a++)u+=c(e,a);return u})},function(r){throw Error("An error occurred while getting secret from enrollment ID "+r)}))}catch(r){return Promise.reject(r)}},E=function(r){try{return Promise.resolve(v(function(){return Promise.resolve(g.subtle.exportKey("spki",r)).then(function(r){return Promise.resolve(function(r){try{try{var e=String.fromCharCode.apply(null,new Uint8Array(r)),t=btoa(e);return Promise.resolve("-----BEGIN PUBLIC KEY-----\n"+t+"\n-----END PUBLIC KEY-----\n")}catch(r){throw Error("An error occurred while formatting base64key to pem key"+r)}}catch(r){return Promise.reject(r)}}(r))})},function(r){throw Error("An error occurred while converting publicKey from cryptoKey format to pem: "+r)}))}catch(r){return Promise.reject(r)}};g="undefined"==typeof window?require("crypto"):window.crypto;var A={Stagenet:"STAGENET",Testnet:"TESTNET",Mainnet:"MAINNET",IntegrationManinet:"INTEGRATIONMAINNET"};function b(r){switch(r){case A.Stagenet:return"https://dev-userreg-gov.p2eppl.com/v1";case A.IntegrationManinet:return"https://stg-userreg-gov.p2eppl.com/v1";case A.Testnet:return"https://ngl-userreg-test.kalp.network/v1";default:throw Error("An error occurred while getting network governance url :invalid environment variable passed")}}function S(r){switch(r){case A.Stagenet:return"https://stg-kalp-gateway.p2eppl.com/transaction/v1";case A.IntegrationManinet:return"https://intmainnet-kalp-gateway.p2eppl.com/transaction/v1";case A.Testnet:return"https://rpc-mumbai-test.kalp.network/transaction/v1";default:throw Error("An error occurred while getting kalp gateway url :invalid environment variable passed")}}function I(r){try{switch(r){case A.IntegrationManinet:return"intmainnet-mailabs";case A.Stagenet:return"kalpstagenet";case A.Testnet:return"prod-test-mainnet";default:throw Error("An error occurred while getting kalp gateway url :invalid environment variable passed")}}catch(r){throw r}}exports.Network=A,exports.createCsr=function(r,e,n){try{return new t.KJUR.asn1.csr.CertificationRequest({subject:{str:"/CN="+r+"/O=Your Organization/postalCode=Your Postal Code/L=Your Locality/ST=Your Province/C=IN"},sbjpubkey:n,sigalg:"SHA256withECDSA",sbjprvkey:e}).getPEM()}catch(r){throw Error("An error occurred while Creating CSR :"+r)}},exports.enrollCsr=function(r,e,t,n,o,i){try{return Promise.resolve(v(function(){var c=(e||b(r))+a,u={Authorization:s},l={enrollmentid:n,secret:o,csr:i,channel:t||I(r)};return Promise.resolve(fetch(c,{method:"POST",body:JSON.stringify(l)})).then(function(r){return r.ok?Promise.resolve(r.json()).then(function(r){return r.response.pubcert}):Promise.resolve(r.json()).then(function(r){var e=JSON.stringify(r);throw Error("An error occurred while getting certificate"+e)})})},function(r){throw Error("An error occurred while getting certificate"+r)}))}catch(r){return Promise.reject(r)}},exports.evaluateBalance=function(r,e,t,n,o,i,c,s,u){try{return Promise.resolve(v(function(){var a=e||S(r);return Promise.resolve(y(n,a+"/proposal",a+"/evaluate",{enrollmentID:t,cert:o,channelName:i,chainCodeName:c,transactionName:s,transactionParams:u}))},function(r){throw Error("An error occurred while getting balance :"+r)}))}catch(r){return Promise.reject(r)}},exports.evaluateTransaction=function(r,e,t,n,o,i,c,s,u){try{return Promise.resolve(v(function(){var a=e||S(r);return Promise.resolve(y(n,a+"/proposal",a+"/evaluate",{enrollmentID:t,cert:o,channelName:i,chainCodeName:c,transactionName:s,transactionParams:u}))},function(r){throw Error("An error occurred while evaluating transaction :"+r)}))}catch(r){return Promise.reject(r)}},exports.getEnrollmentId=function(r){try{return Promise.resolve(v(function(){var e=r.replace(/-----BEGIN PUBLIC KEY-----\r?\n|\r?\n?-----END PUBLIC KEY-----\r?\n?|\r?\n/g,"");return Promise.resolve(p(e)).then(function(r){return Promise.resolve(function(r){try{return Promise.resolve(v(function(){var e=r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength);return Promise.resolve(g.subtle.digest("SHA-256",e)).then(function(r){return new Uint8Array(r)})},function(r){throw Error("An error occurred while getting hashByteArray"+r)}))}catch(r){return Promise.reject(r)}}(r)).then(function(r){return Promise.resolve(function(r){try{try{for(var e=new Uint8Array(2*r.length),t=0;t<r.length;t++){var n=r[t];e[2*t]=n>>4&15,e[2*t+1]=15&n}return Promise.resolve(Array.from(e).map(function(r){return r.toString(16)}).join(""))}catch(r){throw Error("An error occurred in convertByteArrayToString function"+r)}}catch(r){return Promise.reject(r)}}(r)).then(function(r){return r.slice(-40)})})})},function(r){throw Error("An error occurred while getting enrollmentId : "+r)}))}catch(r){return Promise.reject(r)}},exports.getKeyPair=function(){try{return Promise.resolve(v(function(){return Promise.resolve(function(){try{return Promise.resolve(v(function(){return Promise.resolve(window.crypto.subtle.generateKey({name:h,namedCurve:m},!0,[l,f]))},function(r){throw Error("An error occurred while generating key pair from generateKeyPairUsingCryptoSubtle function"+r)}))}catch(r){return Promise.reject(r)}}()).then(function(r){var e=r.privateKey;return Promise.resolve(E(r.publicKey)).then(function(r){return Promise.resolve(function(r){try{return Promise.resolve(v(function(){return Promise.resolve(g.subtle.exportKey(c,r)).then(function(r){var e=String.fromCharCode.apply(null,new Uint8Array(r));return"-----BEGIN PRIVATE KEY-----\n"+btoa(e)+"\n-----END PRIVATE KEY-----\n"})},function(r){throw Error("An error occurred in exportPrivateKeyAsPem function :"+r)}))}catch(r){return Promise.reject(r)}}(e)).then(function(e){return{pemPrivateKey:e,pemPublicKey:r}})})})},function(r){throw Error("An error occurred while getting public and private key pair:"+r)}))}catch(r){return Promise.reject(r)}},exports.getKeyPairFromSeedPhrase=function(n){try{return Promise.resolve(v(function(){var c=new e.ec(o),s=r.ethers.utils.mnemonicToSeed(n),u=c.keyFromPrivate(s),a=u.getPrivate(i),l=u.getPublic(i),P=t.KEYUTIL.getKey({curve:"secp256r1",d:a}),p=t.KEYUTIL.getPEM(P,"PKCS8PRV");return Promise.resolve(function(r){try{return Promise.resolve(v(function(){for(var e=new Uint8Array(r.length/2),t=0;t<r.length;t+=2)e[t/2]=parseInt(r.substr(t,2),16);return Promise.resolve(g.subtle.importKey("raw",e,{name:h,namedCurve:m},!0,[f])).then(function(r){return Promise.resolve(E(r))})},function(r){throw Error("An error occurred while converting public key hex format to pem"+r)}))}catch(r){return Promise.reject(r)}}(l)).then(function(r){return{pemPrivateKey:p,pemPublicKey:r}})},function(r){throw Error("An error occurred while getting keypair:"+r)}))}catch(r){return Promise.reject(r)}},exports.getRandSvalue=function(r,e){try{return Promise.resolve(v(function(){return Promise.resolve(function(r){try{return Promise.resolve(v(function(){for(var e=r.replace("-----BEGIN PRIVATE KEY-----","").replace("-----END PRIVATE KEY-----",""),t=atob(e),n=new Uint8Array(t.length),o=0;o<t.length;o++)n[o]=t.charCodeAt(o);return Promise.resolve(g.subtle.importKey(c,n.buffer,{name:h,namedCurve:m},!0,[l]))},function(r){throw Error("An error occurred in importPrivateKey function :"+r)}))}catch(r){return Promise.reject(r)}}(r)).then(function(r){return Promise.resolve(p(e)).then(function(e){return Promise.resolve(P(r,e)).then(function(r){return[r[0],r[1]]})})})},function(r){throw Error("An error occurred while getting R and S value :"+r)}))}catch(r){return Promise.reject(r)}},exports.getSecret=w,exports.getSeedPhrase=function(){try{try{var e=r.ethers.Wallet.createRandom();return Promise.resolve(e.mnemonic.phrase)}catch(r){throw Error("An error occurred while getting seedphrase: "+r)}}catch(r){return Promise.reject(r)}},exports.register=function(r,e,t,n,o){try{return Promise.resolve(v(function(){if(40!==n.length)throw Error("Invalid enrollment ID: Must be 40 characters long.");var i=(e||b(r))+u,c={Authorization:s},a={enrollmentid:n,secret:o,maxenrollments:"-1",channel:t||I(r)};return Promise.resolve(fetch(i,{method:"POST",body:JSON.stringify(a)})).then(function(r){function e(e){return Promise.resolve(r.json()).then(function(r){return JSON.stringify(r)})}var t=function(){if(!r.ok)return Promise.resolve(r.json()).then(function(r){var e=JSON.stringify(r);throw Error("An error occurred while doing user registration"+e)})}();return t&&t.then?t.then(e):e()})},function(r){throw Error("An error occurred while doing user registration"+r)}))}catch(r){return Promise.reject(r)}},exports.registerAndEnrollUser=function(r,e,t,n,o){try{return Promise.resolve(v(function(){if(40!==n.length)throw Error("Invalid enrollment ID: Must be 40 characters long.");return Promise.resolve(w(n)).then(function(i){var c=e||b(r),l=c+u,h={Authorization:s},m={enrollmentid:n,secret:i,maxenrollments:"-1",channel:t||I(r)};return Promise.resolve(fetch(l,{method:"POST",body:JSON.stringify(m)})).then(function(e){if(e.ok){var u=c+a,l={Authorization:s},h={enrollmentid:n,secret:i,csr:o,channel:t||I(r)};return Promise.resolve(fetch(u,{method:"POST",body:JSON.stringify(h)})).then(function(r){return r.ok?Promise.resolve(r.json()).then(function(r){return r.response.pubcert}):Promise.resolve(r.json()).then(function(r){var e=JSON.stringify(r);throw Error("An error occurred while getting certificate"+e)})})}return Promise.resolve(e.json()).then(function(r){var e=JSON.stringify(r);throw Error("An error occurred while doing user registration"+e)})})})},function(r){throw Error("An error occurred in user registration process "+r)}))}catch(r){return Promise.reject(r)}},exports.signUsingElliptic=P,exports.submitTransaction=function(r,e,t,n,o,i,c,s,u){try{return Promise.resolve(v(function(){console.log("transaction 123",r,e,t,n,o,i,c,s,u);var a=e||S(r),l=a+"/proposal",h=a+"/endorse",m=a+"/submit",f=a+"/commitstatus",v=n,g={enrollmentID:t,cert:o,channelName:i,chainCodeName:c,transactionName:s,transactionParams:u};return console.log("transaction",g),Promise.resolve(d(l,g)).then(function(r){var e="",t="",n=r.message.proposal;return Promise.resolve(p(n)).then(function(r){return Promise.resolve(P(v,r)).then(function(r){return e=r[0],t=r[1],Promise.resolve(d(h,{signedR:e,signedS:t,proposal:n})).then(function(r){var n=r.message.endorse;return Promise.resolve(p(n)).then(function(r){return Promise.resolve(P(v,r)).then(function(r){return e=r[0],t=r[1],Promise.resolve(d(m,{signedR:e,signedS:t,endorse:n})).then(function(r){var n=r.message.submit;return Promise.resolve(p(n)).then(function(r){return Promise.resolve(P(v,r)).then(function(r){return e=r[0],t=r[1],Promise.resolve(d(f,{signedR:e,signedS:t,submit:n})).then(function(r){var e=function(r){return r.message.transaction_id}(r);return e})})})})})})})})})})},function(r){throw Error("An error occurred while submiting transaction "+r)}))}catch(r){return Promise.reject(r)}};
