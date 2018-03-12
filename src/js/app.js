App = {
     web3Provider: null,
     contracts: {},
     account: 0x0,

     init: function() {
      //     // load articles
      //     var articlesRow = $('#articlesRow');
      //     var articleTemplate = $("#articleTemplate");

      //     articleTemplate.find('.panel-title').text('article 1');
      //     articleTemplate.find('.article-description').text('Description for article 1');
      //     articleTemplate.find('.article-price').text("10.23");
      //     articleTemplate.find('.article-seller').text("0x12345678901234567890");

      //     articlesRow.append(articleTemplate.html());

          return App.initWeb3();
     },

     initWeb3: function() {
          // Initialize web3
          if(typeof web3 !== 'undefined'){
                // Reuse the provider of the Web3 object injected by Metamask
                App.web3Provider = web3.currentProvider;
          } else {
                // Create a new provider and plug it directly into our local node (Ganache)
                App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          }
          web3 = new Web3(App.web3Provider);

          App.displayAccountInfo();

          return App.initContract();
     },

     displayAccountInfo: function() {
           web3.eth.getCoinbase(function(error, account){
                  if(error === null) {
                        App.account = account;
                        $('#account').text(account);
                        web3.eth.getBalance(account, function(err, balance){
                              if(err === null) {
                                    $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
                              }
                        })
                  }
           });
     },

     initContract: function() {
          $.getJSON('ChainList.json', function(chainListArtifact){
            // Get the contract artifact file and use it to instantiate a truffle contract abstraction
            App.contracts.ChainList = TruffleContract(chainListArtifact);

            // Set the provider for our contract
            App.contracts.ChainList.setProvider(App.web3Provider);

            // Retrieve the article from the contract
            return App.reloadArticles();

          });
     },

     reloadArticles: function() {
           // Refresh account information because the balance might have changed
           App.displayAccountInfo();

           // Retrieve the article placeholder and clear it
           $('#articlesRow').empty();

           App.contracts.ChainList.deployed().then(function(instance){
                  return instance.getArticle();
           }).then(function(article){
                  if(article[0] == 0x0) {
                        // No article to display
                        return;
                  }

                  // Retrieve the article template and fill it with data
                  var articleTemplate = $('#articleTemplate');
                  articleTemplate.find('.panel-title').text(article[1]);
                  articleTemplate.find('.article-description').text(article[2]);
                  articleTemplate.find('.article-price').text(web3.fromWei(article[3], "ether"));

                  var seller = article[0];
                  if (seller == App.account) {
                        seller = "You";
                  }
                  articleTemplate.find('.article-seller').text(seller);

                  // Add this article to articles row
                  $('#articlesRow').append(articleTemplate.html());

           }).catch(function(err){
                 console.log(err.message);
           })
     },

     sellArticle: function() {
            // Retrieve article details
            var _article_name = $('#article_name').val();
            var _article_description = $('#article_description').val();
            var _article_price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");

            if((_article_name.trim() == '' || (_article_price == 0))) {
                  // Nothing to sell
                  return false;
            }

            App.contracts.ChainList.deployed().then(function(instance){
                  return instance.sellArticle(_article_name, _article_description, _article_price, {
                        from: App.account,
                        gas: 500000
                  });
            }).then(function(result){
                  App.reloadArticles();
            }).catch(function(err){
                  console.log(err);
            });
      }
};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
