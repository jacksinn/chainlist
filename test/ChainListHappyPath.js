var ChainList = artifacts.require("./ChainList.sol");

// Test Suite
contract('ChainList', function(accounts){
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
});