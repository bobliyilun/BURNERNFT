This DApp allows users to mint NFTs that are essentially burner phone numbers.
It allows users to generate new numbers, burn them, transfer them to other users, and export the numbers they own. 

This Dapp starts from a seed dapp by Fireship. 
- See the seed version in action in the [Web3 NFT Tutorial](https://youtu.be/meTpMP0J5E8) on YouTube.
- Follow the full [Web3 Tutorial](https://fireship.io/lessons/web3-solidity-hardhat-react-tutorial) on Fireship.

The changes Made:
On the smart contract:
Made the NFT burnable
Made the NFT transferable 

On the Frontend:
Allow individual users to mint their own burner phone numbers to their own metamask addresses.
The original version mint the NFT at where the contract is deployed. 
Allows the users to export all the numbers they own and up and running (not burnt) to a text file.
This is done by fetching each IPFS URL. 

Enforce a privacy filter. Due to the simplicity of the original frontend, all users share the smae web page when minting NFTs.
This is not eaxctly secure as one may not want others to see their 


The demo contains a basic web3 app and smart contract for minting NFTs.



## Usage

```bash
git clone <this-repo>
npm install

# terminal 1
npx hardhat node

# terminal 2
npx hardhat compile
npx hardhat run scripts/sample-script.js --network localhost

# terminal 3 
npm run dev
```

Update the deployed contract address in `compoonents/Home.js` 
