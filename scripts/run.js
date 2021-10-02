const main = async () => {
    // Hardhat Runtime Env (hre) object injected by "npx hardhat run".
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');

    // Deploys our contract to the blockchain!
    const waveContract        = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });
    
    // Wait for the contract to be mined.
    await waveContract.deployed();
    console.log("Contract address: ", waveContract.address);

    /*
    *  Get contract balance
    */
   let contractBalance = await hre.ethers.provider.getBalance(
       waveContract.address
   );
   console.log(
       "Contract balance: ", hre.ethers.utils.formatEther(contractBalance)
   );

    /*
    *  Send wave and notify miners of the transaction we want to be mined.
    *  Then, wait for the transaction to be mined.
    */
    let waveTxn  = await waveContract.wave("Hi from the contract!");
    await waveTxn.wait();

    /*
    *  Get contract balance to see what happened!
    */
   contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
   console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

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
