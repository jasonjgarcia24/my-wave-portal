// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;      // The address of the user who waved.
        string message;     // The message the user sent.
        string winString;   // The message that shows if the waver won.
        uint256 yourNumber; // This is the random number for the waver. 
        uint256 timestamp;  // The timestamp when the user waved.
    }

    Wave[] waves;

    /*
    *  This is an address => uint mapping, meaning I can associate an address with a number.
    *  In this case, I'll be storing the address with the last time the user waved at us.
    */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("This contract has been constructed!");
    }

    function wave(string memory _message) public {
        /*
        *  We need to make sure the current timestamp is at least 15-minutes
        *  bigger than the last timestamp we stored.
        */
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Wait 15m");

        totalWaves += 1;
        console.log("%s has waved at %s(%s)!",
        msg.sender, lastWavedAt[msg.sender] + 15 minutes, block.timestamp);

        /*
        *  Generate a Psuedo random number between 0 and 100
        */
        uint256 _randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %s", _randomNumber);

        /*
        *  Set the generated, random number as the seed for the next wave.
        */
        seed = _randomNumber;

        /*
        *  Give a 50% chance that the user wins the prize.
        */
        string memory _winString = "Sorry! You are not a winner...";

        if (_randomNumber < 50) {
            _winString = "Congratulations! You've won!";
            
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,   // 'this' is the contract
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        console.log(_winString);    

        /*
        *  This is where we store the wave data in the array.
        */
        waves.push(Wave(msg.sender, _message, _winString, _randomNumber, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
    *  Return the struct array, waves, to us.
    *  This will make it easy to retrieve the waves from our site!
    */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        
        return totalWaves;
    }
}
