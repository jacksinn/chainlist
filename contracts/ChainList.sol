pragma solidity ^0.4.18;

contract ChainList {

    // State variables
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;

    // Events Section
    event LogSellArticle(
        address indexed _seller,
        string _name,
        uint _price
    );

    event LogBuyArticle(
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // function ChainList() public {
    //     sellArticle("Default article", "This is an article set by default", ß1000000000000000000);
    // }

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

        // Calling our Event
        LogSellArticle(seller, name, price);
    }

    // Get an article
    function getArticle() public view returns (
        address _seller, 
        address _buyer,
        string _name, 
        string _description, 
        uint256 _price
        ) 
        {
            // We can return multiple values in solidity so that's nice
        return(seller, buyer, name, description, price);
    }

    // Buy an article
    function buyArticle() payable public {
        // Check if there is an article for sale
        require(seller != 0x0);

        // Check that the article has not been sold yet
        require(buyer == 0x0);

        // Do not allow the seller to buy it's own article
        require(msg.sender != seller);

        // Check that the value sent corresponds to the price of the article
        require(msg.value == price);

        // Record buyer's information
        buyer = msg.sender;

        // Buyer pays the seller
        seller.transfer(msg.value);

        // Trigger the event
        LogBuyArticle(seller, buyer, name, price);
    }
}