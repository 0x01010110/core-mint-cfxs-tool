import logo from './logo.svg';
import './App.css';
import { Button, Input, Typography, message } from 'antd';
import { useState, useEffect } from 'react';
import { Conflux, address } from 'js-conflux-sdk';
import { ethers, Contract } from "ethers";
// import detectProvider from "@fluent-wallet/detect-provider";
const { Text, Link } = Typography;
const evmprovider = new ethers.JsonRpcProvider('https://evm.confluxrpc.com');

let abi = [
    "function balanceOf(address addr) view returns (uint)"
]
  
const cfxs = '0xc6e865c213c89ca42a622c5572d19f00d84d7a16';

const cfxscontract = new Contract(cfxs, abi, evmprovider)

function App() {
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState("");
    const [client, setClient] = useState(null);
    const [balance, setBalance] = useState(0);

    const connect = async () => {
        console.log('connect')
        let accounts = await window.conflux.request({ method: 'cfx_accounts' })
        console.log('connect2', accounts);
            // .then(handleAccountsChanged)
            // .catch((err) => {
            //     console.error(err);
            // });
        if (accounts.length === 0) {
            accounts = await window.conflux.request({ method: 'cfx_requestAccounts' })
        }

        if (accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);
            setConnected(true);

            const balance = await cfxscontract.balanceOf(address.cfxMappedEVMSpaceAddress(account));
            setBalance(balance);
        } else {
            message.error('Fluent connect failed');
        } 
    };

    const mintCfxs = async () => {
        try {
            const cfxClient = new Conflux({
                url: 'https://main.confluxrpc.com',
                networkId: 1029,
            });
            cfxClient.provider = window.conflux;

            const crossSpaceCall = cfxClient.InternalContract("CrossSpaceCall");
            const res = await crossSpaceCall.transferEVM(cfxs).sendTransaction({
                from: account
            });
            message.success('Mint TX send Success!');
        } catch(e) {
            message.error('Mint TX send Failed!');
        }
    }

    /* useEffect(() => {
        if (!window.conflux) {
            message.error('Please install Fluent Wallet!');
            return;
        }
        const cfxClient = new Conflux({
            url: 'https://main.confluxrpc.com',
            networkId: 1029,
        });
        cfxClient.provider = window.conflux;
        // setClient(cfxClient);
    }, [client]); */

    // useEffect(async () => {
    //     /* const provider = await detectProvider({
    //         injectFlag: "conflux",
    //         defaultWalletFlag: "isFluent",
    //     });

    //     setProvider(provider); */

    //     /* if (provider) {
    //         startApp(provider);
    //     } else {
    //         console.log('Please install Fluent Wallet!');
    //     }
        
    //     function startApp(provider) {
    //         if (provider !== window.conflux) {
    //             console.error('Do you have multiple wallets installed?');
    //         }
    //     } */
    // }, [provider]);

  return (
    <div className="App">
      <header className="App-header">
        <br />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h5> CFXs Core Mint Tool</h5>
        <br />
        {
            !window.conflux && <a
                className="App-link"
                href="https://fluentwallet.com/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Install Fluent Here
            </a>
        }
        <br />
        {
            !connected && <Button type='primary' onClick={connect}>Connect Fluent Wallet</Button>
        }
        {
            account && <>
                <Text type="success">Address: {account}</Text>
                <Text type="success">Map Address: {address.cfxMappedEVMSpaceAddress(account)}</Text>
                <Text type="success">CFXs Balance: {balance.toString()}</Text>
                <br />
                {/* <Input style={{maxWidth: '500px'}}/> */}
                {/* <br /> */}
                <Button type='primary' onClick={mintCfxs}>Mint CFXs</Button>
            </>
        }
      </header>
    </div>
  );
}

export default App;
