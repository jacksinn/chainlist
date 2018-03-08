pragma solidity ^0.4.18;

contract ChainList {

    // State variables
    address seller;
    string name;
    string description;
    uint256 price;

    // Sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        // Getting the address of the account from the user who called this function
        seller = msg.sender;

        // Setting the name of the article
        name = _name;

        // Setting the description
        description = _description;

        // Setting the price at which to sell the article
        price = _price;
    }

    // Get an article
    function getArticle() public view returns (
        address _seller, 
        string _name, 
        string _description, 
        uint256 _price
        ) {
            // We can return multiple values in solidity so that's nice
            return(seller, name, description, price);
        }
}