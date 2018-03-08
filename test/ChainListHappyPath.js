var ChainList = artifacts.require("./ChainList.sol");

// Test Suite
contract('ChainList', function(accounts){
    var chainListInstance;
    var seller = accounts[1];
    var articleName = "Article 1";
    var articleDescription = "Description for Article 1";
    var articlePrice = 10;

    // Testing Initial Values
    it("should be initialized with empty values", function(){
        return ChainList.deployed().then(function(instance){
            // Test calling get article
            return instance.getArticle();
        }).then(function(data){
            // Upon getting article, article data passed in.
            // Checking the values from the article returned in 'data'
            assert.equal(data[0], 0x0, "Seller must be empty");
            assert.equal(data[1], "", "Article Name must be empty");
            assert.equal(data[2], "", "Article Description must be empty");
            assert.equal(data[3].toNumber(), 0, "Article Price must be zero");
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
                assert.equal(data[1], articleName, "Article Name must be " + articleName);
                assert.equal(data[2], articleDescription, "Article Description must be " + articleDescription);
                assert.equal(data[3].toNumber(), web3.toWei(articlePrice, "ether"), "Article Price must be " + web3.toWei(articlePrice, "ether"));
            });
        });
});