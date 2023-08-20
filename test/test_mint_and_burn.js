const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const FiredGuys = await ethers.getContractFactory("FiredGuys");
    const firedguys = await FiredGuys.deploy();
    await firedguys.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metadataURI = 'cid/test.png';

    let balance = await firedguys.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await firedguys.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.05') });

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await firedguys.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await firedguys.isContentOwned(metadataURI)).to.equal(true);
    const newlyMintedToken2 = await firedguys.payToMint(recipient, 'foo', { value: ethers.utils.parseEther('0.05') });

    await newlyMintedToken2.wait();

    balance = await firedguys.balanceOf(recipient)
    expect(balance).to.equal(2);

    const URi_tobe_logged = await firedguys.tokenURI('1');
    const owner_of_this = await firedguys.ownerOf('1')

    const burned_token = await firedguys.payToBurn(URi_tobe_logged, '1', { value: ethers.utils.parseEther('0.05') });
    await burned_token.wait();

    balance = await firedguys.balanceOf(recipient)
    expect(balance).to.equal(1);

    // const burned_token2 = await firedguys.payToBurn('foo', '1', { value: ethers.utils.parseEther('0.05') });
    // await burned_token2.wait();
  });
});
