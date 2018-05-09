pragma solidity ^0.4.18;


contract ChainList {
    // Custom types
    struct Article {
        uint id;
        address seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }

    // State variables
    mapping (uint => Article) public articles;
    uint articleCounter;

    // Events Section
    event LogSellArticle(
        uint indexed _id,
        address indexed _seller,
        string _name,
        uint _price
    );

    event LogBuyArticle(
        uint indexed _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // Sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        // Increment article counter
        articleCounter++;

        articles[articleCounter] = Article(
            articleCounter,
            msg.sender,
            0x0,
            _name,
            _description,
            _price
        );

        // Calling our Event
        LogSellArticle(articleCounter, msg.sender, _name, _price);
    }

    // Fetch the number of articles in the contract
    function getNumberOfArticles() public view returns (uint) {
        return articleCounter;
    }

    // Fetch and return all article IDs for articles still for sale
    function getArticlesForSale() public view returns (uint[]) {
        // Prepare output array
        uint[] memory articleIDs = new uint[](articleCounter);

        uint numberOfArticlesForSale = 0;

        // Iterate over articles
        for (uint i = 1; i <= articleCounter; i++) {
            // Keep the id if the article is still for sale
            if (articles[i].buyer == 0x0) {
                articleIDs[numberOfArticlesForSale] = articles[i].id;
                numberOfArticlesForSale++;
            }
        }

        // Copy the articleIDs array into a smaller forSale array
        uint[] memory forSale = new uint[](numberOfArticlesForSale);
        for (uint j = 0; j < numberOfArticlesForSale; j++) {
            forSale[j] = articleIDs[j];
        }

        return forSale;
    }

    // Buy an article
    function buyArticle(uint _id) public payable {
        // Check if there is an article for sale
        require(articleCounter > 0);

        // Check that the article exists
        require(_id > 0 && _id <= articleCounter);

        // We retrieve the article from the mapping
        Article storage article = articles[_id];

        // Check that the article has not been sold yet
        require(article.buyer == 0x0);

        // Do not allow the seller to buy it's own article
        require(msg.sender != article.seller);

        // Check that the value sent corresponds to the price of the article
        require(msg.value == article.price);

        // Record buyer's information
        article.buyer = msg.sender;

        // Buyer pays the seller
        article.seller.transfer(msg.value);

        // Trigger the event
        LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
    }
}