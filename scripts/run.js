const { ethers } = require("ethers");

const main = async () => {
    // Hardhat Runtime Env (hre) object injected by "npx hardhat run".
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');

    // Deploys our contract to the blockchain!
    const waveContract        = await waveContractFactory.deploy();
    
    // Wait for the contract to be mined.
    await waveContract.deployed();

    console.log("Contract deployed to:  ", waveContract.address);
    console.log("Contract deployed by:  ", owner.address);
    console.log("Contract requested by: ", requestor.address);

    /* 
    *  Wave and track total number of waves
    *  (i.e., change and display our state variable)
    */
    let waveCount;
    waveCount = await waveContract.getTotalWaves("Hi from the contract!");
    console.log("Wave count: ", waveCount.toNumber());

    // Notify miners of the transaction we want to be mined.
    let waveTxn = await waveContract.wave();
    await waveTxn.wait(); // Wait for the transaction to be mined.

    const [_, requestor] = await ethers.getSigners();
    waveTxn = await waveContract.connect(requestor).wave("The Requestor says 'Hi' too!")
    await waveTxn.wait(); // Wait for the transaction to be mined.

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();
