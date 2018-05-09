var ChainList = artifacts.require("./ChainList.sol");

// Test Suite
contract('ChainList', function(accounts){
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleName = "Article 1";
    var articleDescription = "Description for Article 1";
    var articlePrice = 10;
    var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

    // Testing Initial Values
    it("should be initialized with empty values", function(){
        return ChainList.deployed().then(function(instance){
            // Test calling get article
            return instance.getArticle();
        }).then(function(data){
            // Upon getting article, article data passed in.
            // Checking the values from the article returned in 'data'
            assert.equal(data[0], 0x0, "Seller must be empty");
            assert.equal(data[1], 0x0, "Buyer must be empty");
            assert.equal(data[2], "", "Article Name must be empty");
            assert.equal(data[3], "", "Article Description must be empty");
            assert.equal(data[4].toNumber(), 0, "Article Price must be zero");
        })
    });

    it("should sell an article", function(){
        return ChainList.deployed().then(function(instance){
            // Get the current instance
            chainListInstance = instance;
            // Call the sellArticle method and pass in our pre-defined values
            return chainListInstance.sellArticle(
                articleName, 
                articleDescription, 
                web3.toWei(articlePrice, "ether"), { from: seller })
            }).then(function(){
                // After sellArticle is called, call getArticle
                return chainListInstance.getArticle();
            }).then(function(data){
                // And then check to see if these values match our pre-defined values (no data manipulation should occur)
                assert.equal(data[0], seller, "Seller must be " + seller);
                assert.equal(data[1], 0x0, "Buyer must be empty");
                assert.equal(data[2], articleName, "Article Name must be " + articleName);
                assert.equal(data[3], articleDescription, "Article Description must be " + articleDescription);
                assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "Article Price must be " + web3.toWei(articlePrice, "ether"));
            });
        });

        it("should buy an article", function(){
            return ChainList.deployed().then(function(instance){
                chainListInstance = instance;

                // Record balances of seller and buyer before the buy
                sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
                buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

                return chainListInstance.buyArticle({
                    from: buyer,
                    value: web3.toWei(articlePrice, "ether")
                });
            }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
                assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
                assert.equal(receipt.logs[0].args._name, articleName, "event name must be " + articleName);
                assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice, "ether"), "event articlePrice must be " + web3.toWei(articlePrice, "ether"));
            
                // Record balances of buyer and seller after the buy
                sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
                buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

                // Check the effect of the buy on the balances of buyer and seller, accounting for gas
                assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice, "seller should have earned " + articlePrice + " ETH")
                assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice, "buyer should have spent " + articlePrice + " ETH")

                return chainListInstance.getArticle();
            }).then(function(data){
                // And then check to see if these values match our pre-defined values (no data manipulation should occur)
                assert.equal(data[0], seller, "Seller must be " + seller);
                assert.equal(data[1], buyer, "Buyer must be " + buyer);
                assert.equal(data[2], articleName, "Article Name must be " + articleName);
                assert.equal(data[3], articleDescription, "Article Description must be " + articleDescription);
                assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "Article Price must be " + web3.toWei(articlePrice, "ether"));
            });
        });

        it("should trigger an event when a new article is sold", function(){
            return ChainList.deployed().then(function(instance){
                chainListInstance = instance;
                return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {from: seller});
            }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
                assert.equal(receipt.logs[0].args._name, articleName, "event name must be " + articleName);
                assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice, "ether"), "event articlePrice must be " + web3.toWei(articlePrice, "ether"));
            });
        });
});