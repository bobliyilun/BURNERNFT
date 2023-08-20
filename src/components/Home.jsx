import WalletBalance from './WalletBalance';
import DownLoadMinted from './GetMintedCSV';
import NumberTransfer from './TransferToken';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import FiredGuys from '../artifacts/contracts/MyNFT.sol/FiredGuys.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; //'YOUR_DEPLOYED_CONTRACT_ADDRESS';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, FiredGuys.abi, signer);


function Home() {

  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  // const [totalBurnt, setTotalBurnt] = useState(0);
  // useEffect(() => {
  //   getBurntCount();
  // }, []);

  // const getBurntCount = async () => {
  //   const count = await contract.count_burned();
  //   console.log(parseInt(count));
  //   setTotalBurnt(parseInt(count));
  // };


  const uri_prefix = `https://gateway.pinata.cloud/ipfs/Qmdh2FRkhHKMnxSkg3MqLWeZFz1XZbZY795gm4CRwoswLc/`;
  const urls = Array(totalMinted).fill(0).map((_, idx) => (uri_prefix + `${idx}` + `.txt`));

  const [fetchedDataList, setFetchedDataList] = useState([]);
  useEffect(() => {
    async function fetchDataList() {
      try {
        const fetchedData = await Promise.all(urls.map(url => fetch(url)
          .then(response => response.text())
          .catch(error => {
            console.error('Error fetching data:', error);
            return null;
          })));
        setFetchedDataList(fetchedData);
      } catch (error) {
        console.error('Error fetching data list:', error);
      }
    }

    fetchDataList();
  }, [totalMinted]);


  //<DownLoadMinted tokenId={totalMinted} storagelocation={'Qmdh2FRkhHKMnxSkg3MqLWeZFz1XZbZY795gm4CRwoswLc'} />
  return (
    <div>
      <WalletBalance />
      <DownLoadMinted fetchedDataList={fetchedDataList} />

      <h1>Burner Phone # NFT</h1>
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
      <NumberTransfer contract={contract}/>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const contentId = 'Qmdh2FRkhHKMnxSkg3MqLWeZFz1XZbZY795gm4CRwoswLc';
  // const metadataURI = `${contentId}/${tokenId}.txt`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.txt`;
  const metadataURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.txt`; //imageURI;
  // const imageURI = `D:\\Fireship\\web3-nft-dapp-tutorial\\img\\${tokenId}.txt`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    // const addr = connection.address;
    const [addr] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(addr);
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }

  const [text, setText] = useState('');
  useEffect(() => {
    async function fetchTextFile() {
      try {
        const response = await fetch(imageURI);
        const content = await response.text();
        // return content
        setText(content);
      } catch (error) {
        console.error('Error fetching text file:', error);
        setText("content");
      }
    }

    fetchTextFile();
  }, []);

  const [isBurnt, setIsBurnt] = useState(false);
  useEffect(() => {
    getBurntStatus();
  }, [isBurnt]);

  const getBurntStatus = async () => {
    const result = await contract.isContentBurned(metadataURI);
    console.log(result);
    // console.log(contract.ownerOf(tokenId.toString()));
    setIsBurnt(result);
  };

  const burnToken = async () => {
    // console.log(addr);
    // console.log();
    const tru_owner =  await contract.ownerOf(tokenId)
    const result = await contract.payToBurn(metadataURI, tokenId, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getBurntStatus();
    // getCount();
  };


  return (
    <div className="card" style={{ width: '18rem' }}>
      <pre className="card-img-top">{isMinted ? text : "Not minted"}</pre>
      <div className="card-body">
        <pre className="card-title">ID #{tokenId}</pre>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Show URL 
          </button>
        )}

        {isMinted && !isBurnt ? (
          <button className="btn btn-primary" onClick={burnToken}>
            Burn
          </button>
        ) : (
          <button className="btn btn-secondary" disabled>
            Burn 
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
