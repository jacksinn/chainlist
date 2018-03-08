var ChainList = artifacts.require("./ChainList.sol");

// Test Suite
contract('ChainList', function(accounts){
    var chainListInstance;
    var seller = accounts[1];
    var articleName = "Article 1";
    var articleDescription = "Description for Article 1";
    var articlePrice = 10;

    it("should be initialized with empty values", function(){
        return ChainList.deployed().then(function(instance){
            return instance.getArticle();
        }).then(function(data){
            assert.equal(data[0], 0x0, "Seller must be empty");
            assert.equal(data[1], "", "Article Name must be empty");
            assert.equal(data[2], "", "Article Description must be empty");
            assert.equal(data[3].toNumber(), 0, "Article Price must be zero");
        })
    });

    it("should sell an article", function(){
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName, 
                articleDescription, 
                web3.toWei(articlePrice, "ether"), { from: seller })
            }).then(function(){
                return chainListInstance.getArticle();
            }).then(function(data){
                assert.equal(data[0], seller, "Seller must be " + seller);
                assert.equal(data[1], articleName, "Article Name must be " + articleName);
                assert.equal(data[2], articleDescription, "Article Description must be " + articleDescription);
                assert.equal(data[3].toNumber(), web3.toWei(articlePrice, "ether"), "Article Price must be " + web3.toWei(articlePrice, "ether"));
            });
        });
});