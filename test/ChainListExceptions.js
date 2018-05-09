// Contract to be tested
var ChainList = artifacts.require("./ChainList.sol");

// Test Suite
contract("ChainList", function(accounts){
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleName = "article 1";
    var articleDescription = "Description for article 1";
    var articlePrice = 10;

    // No article for sale yet
    it("should throw an exception if you try to buy an article when there is no article for sale yet", function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;

            return chainListInstance.buyArticle({
                from: buyer,
                value: web3.toWei(articlePrice, "ether")
            });
        }).then(assert.fail).catch(function(error){
            assert(true);
        }).then(function(){
            return chainListInstance.getArticle();
        }).then(function(data){
            // And then check to see if these values match our pre-defined values (no data manipulation should occur)
            assert.equal(data[0], 0x0, "Seller must be empty");
            assert.equal(data[1], 0x0, "Buyer must be empty");
            assert.equal(data[2], "", "Article Name must be empty");
            assert.equal(data[3], "", "Article Description must be empty");
            assert.equal(data[4].toNumber(), 0, "Article Price must be zero");        
        });
    });
});