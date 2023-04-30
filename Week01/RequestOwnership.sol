// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;
    address public owner;
    mapping(address => bool) public previousOwners;
    uint256 public lastChanged;

    constructor() {
        text = "Hello World";
        owner = msg.sender;
        previousOwners[owner] = true;
        lastChanged = block.timestamp;
    }

    function helloWorld() public view returns (string memory) {
        return text;
    }


    function setText(string calldata newText) public onlyOwner {
        text = newText;
    }

    function remainingTimeToChangeOwnership() public view returns(uint256) {
        require(block.timestamp < lastChanged + 5 minutes, "You can now request ownership of the contract");
        return lastChanged + 5 minutes - block.timestamp;
    }
 
    function requestOwnership() public {
        uint256 timeNow = block.timestamp;

        require(timeNow > lastChanged + 5 minutes, "Already owned by someone, Please try again after few minutes");
        require(!previousOwners[msg.sender],"You have already tested this contract once");

        owner = msg.sender;
        previousOwners[owner] = true;
        lastChanged = timeNow;
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

}
