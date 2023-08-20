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
    console.log("minted", parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const [totalBurnt, setTotalBurnt] = useState(0);
  useEffect(() => {
    getBurntCount();
  }, []);

  const getBurntCount = async () => {
    const count_burnt = await contract.count_burned();
    console.log("burnt", parseInt(count_burnt));
    setTotalBurnt(parseInt(count_burnt));
  };


  // const uri_prefix = `https://gateway.pinata.cloud/ipfs/Qmdh2FRkhHKMnxSkg3MqLWeZFz1XZbZY795gm4CRwoswLc/`;
  const [[wallet_curr], setwallet_curr] = useState('');
  useEffect(() => { 
    window.ethereum.on('accountsChanged', getCurrentWallet);
    getCurrentWallet(); 
    return () => {
      window.ethereum.removeListener('accountsChanged', updateCurrentAccount);
    };
  }, []); //, [[wallet_curr]]

  const getCurrentWallet = async () => {
    const curr_signer = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setwallet_curr(curr_signer);
  };

  const [urls, seturls] = useState([]);
  const [ownership, setownership] = useState([]);
  useEffect(() => {
    async function getalltokens() {
      const tokens = Array(totalMinted).fill(0).map(async (_, idx) => idx);
      const filter_burnt = await Promise.all(tokens.map(async item => {
        const burnt = await contract.isTokenBurned(item);
        return burnt ? null : item;
      }));
      const unburnt_tokens = filter_burnt.filter(item => item !== null);
      const filter_owner = await Promise.all(unburnt_tokens.map(async item => {
        const actual_owner = await contract.ownerOf(item);
        const shouldInclude = (actual_owner.toLowerCase() === wallet_curr.toLowerCase());
        return shouldInclude ? item : null;
      }));
      const owntokens = filter_owner.filter(item => item !== null)

      const results = await Promise.all(owntokens.map(async item => {
        const actual_link = await contract.tokenURI(item);
        return actual_link;
      }));

      const slice_urls = results.map((value, _) => value.slice(7));
      seturls(slice_urls);

      // const ownerships = Array(totalMinted).fill(0).map(async (_, idx) => idx);
      const filter_invalid = await Promise.all(tokens.map(async item => {
        const burnt = await contract.isTokenBurned(item);
        let actual_owner = '0';
        if (!burnt) {
          actual_owner = await contract.ownerOf(item);
        }
        const owned = (actual_owner.toLowerCase() === wallet_curr.toLowerCase());
        return owned;
      }));
      setownership(filter_invalid)

    }
    getalltokens();
  }, [totalBurnt, totalMinted, wallet_curr]);


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
  }, [urls]);


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
                <NFTImage tokenId={i} getCount={getCount} getBurntCount={getBurntCount} yours={ownership[i]} />
              </div>
            ))}
        </div>
      </div>
      <NumberTransfer contract={contract} />
    </div>
  );
}

function NFTImage({ tokenId, getCount, getBurntCount, yours }) {
  const contentId = 'Qmdh2FRkhHKMnxSkg3MqLWeZFz1XZbZY795gm4CRwoswLc'; // be sure to update this if your ipfs address is different
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.txt`;
  const metadataURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.txt`;

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
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const result = await contract.payToMint(account, metadataURI, {
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
  const [isBurnt, setIsBurnt] = useState(false);
  useEffect(() => {
    getBurntStatus();
  }, [isBurnt]);

  const [text, setText] = useState('');
  useEffect(() => {
    async function fetchTextFile() {
      if (isBurnt) {
        setText("BURNT")
      }
      else if (yours) {
        try {
          const response = await fetch(imageURI);
          const content = await response.text();
          setText(content);
        } catch (error) {
          console.error('Error fetching text file:', error);
          setText("content");
        }
      } else {
        setText("Not Visible to You");
      }
    }
    fetchTextFile();
  }, [yours, isBurnt, isMinted]);



  const getBurntStatus = async () => {
    const result = await contract.isContentBurned(metadataURI);
    setIsBurnt(result);
  };

  const burnToken = async () => {
    const result = await contract.payToBurn(metadataURI, tokenId, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getBurntStatus();
    getBurntCount();
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
          <button className="btn btn-primary" disabled>
            Burn
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
