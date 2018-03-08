pragma solidity ^0.4.18;

contract ChainList {

    // State variables
    address seller;
    string name;
    string description;
    uint256 price;

    // Sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        // Ge5tting the address of the account from the user who called this function
        seller = msg.sender;

        name = _name;

        description = _description;

        price = _price;
    }

    // Get an article
    function getArticle() public view returns (
        address _seller, 
        string _name, 
        string _description, 
        uint256 _price
        ) {
        
            return(seller, name, description, price);
        }
}