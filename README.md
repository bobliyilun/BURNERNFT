This DApp allows users to mint NFTs that are essentially burner phone numbers.
It allows users to generate new numbers, burn them, transfer them to other users, and export the numbers they own. 

This Dapp starts from a seed dapp by Fireship: https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA. 
- See the seed version in action in the [Web3 NFT Tutorial](https://youtu.be/meTpMP0J5E8) on YouTube.
- Follow the full [Web3 Tutorial](https://fireship.io/lessons/web3-solidity-hardhat-react-tutorial) on Fireship.

The changes Made:

On the smart contract:

Made the NFT burnable

Made the NFT transferable 

On React components:

Allow individual users to mint their own burner phone numbers to their own metamask addresses.
The original version mint the NFT at where the contract is deployed. 

Allows the users to export all the numbers they own and up and running (not burnt) to a text file.
This is done by fetching each IPFS URL. 

Enforce a privacy filter. Due to the simplicity of the original frontend, all users share the smae web page when minting NFTs.
This is not eaxctly secure as one may not want others to see their burner phone numbers. 
I made sure that the current metamask account holders connected to the dapp can only see the numbers generated on their own accounts.
All numbers are not visible, not burnale, and not transferable by no one but their owner.

On pure frontend and NFT generation:

Original Dapp was designed for pictures. Needed to conver text for this application. 

Fireship did not include how his NFT was generated. However, I made my own burner phone number generator in python.
It generates phone numbers with Toronto area codes, and it ensures uniqueness in the generations as well. 


## Usage

```bash
git clone <this-repo>
cd into it
npm install
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts

# terminal 1
npx hardhat node

# terminal 2
npx hardhat compile
npx hardhat run scripts/sample-script.js --network localhost

# terminal 3 
npm run dev
```

Update the deployed contract address in `compoonents/Home.js` 
If there is any mishap during the installation process, please be patient and do you best to figure it out.
Everything was set up smoothly after I ran "npm install". Although, I seem to remember installing waffle separately.
If there are any questions, please reach out to me. 
