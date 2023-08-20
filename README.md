This DApp allows users to mint NFTs that are essentially burner phone numbers.
It allows users to generate new numbers, burn them, transfer them to other users, and export the numbers they own. 

This Dapp starts from a seed dapp by Fireship. 
- See the seed version in action in the [Web3 NFT Tutorial](https://youtu.be/meTpMP0J5E8) on YouTube.
- Follow the full [Web3 Tutorial](https://fireship.io/lessons/web3-solidity-hardhat-react-tutorial) on Fireship.

If you started from a seed DApp,
list the additions or changes you made (very important)
to the original DApp's front-end rendering and back-end programming.

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
