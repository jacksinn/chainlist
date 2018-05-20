pragma solidity ^0.4.18;


contract Ownable {
    // state variables
    address owner;

    // Modifiers
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    // Constructor
    function Ownable() public {
        owner = msg.sender;
    }
}
