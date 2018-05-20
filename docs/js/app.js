App = {
      web3Provider: null,
      contracts: {},
      account: 0x0,
      loading: false,

      init: function () {
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

      initWeb3: function () {
            // Initialize web3
            if (typeof web3 !== 'undefined') {
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

      displayAccountInfo: function () {
            web3.eth.getCoinbase(function (error, account) {
                  if (error === null) {
                        App.account = account;
                        $('#account').text(account);
                        web3.eth.getBalance(account, function (err, balance) {
                              if (err === null) {
                                    $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
                              }
                        })
                  }
            });
      },

      initContract: function () {
            $.getJSON('ChainList.json', function (chainListArtifact) {
                  // Get the contract artifact file and use it to instantiate a truffle contract abstraction
                  App.contracts.ChainList = TruffleContract(chainListArtifact);

                  // Set the provider for our contract
                  App.contracts.ChainList.setProvider(App.web3Provider);

                  // Listen to events
                  App.listenToEvents();

                  // Retrieve the article from the contract
                  return App.reloadArticles();

            });
      },

      reloadArticles: function () {
            // Avoid rea-entry
            if (App.loading) {
                  return;
            }
            App.loading = true;
            // Refresh account information because the balance might have changed
            App.displayAccountInfo();

            var chainListInstance;

            App.contracts.ChainList.deployed().then(function (instance) {
                  chainListInstance = instance;
                  return chainListInstance.getArticlesForSale();
            }).then(function (articleIds) {

                  // Retrieve the article placeholder and clear it
                  $('#articlesRow').empty();

                  for (var i = 0; i < articleIds.length; i++) {
                        var articleId = articleIds[i];
                        chainListInstance.articles(articleId.toNumber()).then(function (article) {
                              App.displayArticle(article[0], article[1], article[3], article[4], article[5]);
                        });
                  }

                  App.loading = false;

            }).catch(function (err) {
                  console.log(err.message);
                  App.loading = false;
            });
      },

      displayArticle: function (id, seller, name, description, price) {
            var articlesRow = $('#articlesRow');

            var etherPrice = web3.fromWei(price, 'ether');

            var articleTemplate = $("#articleTemplate");
            articleTemplate.find('.article-description').text(description);
            articleTemplate.find('.article-price').text(etherPrice + "ETH");
            articleTemplate.find('.btn-buy').attr('data-id', id);
            articleTemplate.find('.btn-buy').attr('data-value', etherPrice);

            // Check the seller
            if (seller === App.account) {
                  articleTemplate.find('.article-seller').text("You");
                  articleTemplate.find('.btn-buy').hide();
            } else {
                  articleTemplate.find('.article-seller').text(seller);
                  articleTemplate.find('.btn-buy').show();
            }

            // Add this new article to the list of articles
            articlesRow.append(articleTemplate.html());

      },

      sellArticle: function () {
            // Retrieve article details
            var _article_name = $('#article_name').val();
            var _article_description = $('#article_description').val();
            var _article_price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");

            if ((_article_name.trim() == '' || (_article_price == 0))) {
                  // Nothing to sell
                  return false;
            }

            App.contracts.ChainList.deployed().then(function (instance) {
                  return instance.sellArticle(_article_name, _article_description, _article_price, {
                        from: App.account,
                        gas: 500000
                  });
            }).then(function (result) {
                  // App.reloadArticles();
            }).catch(function (err) {
                  console.log(err);
            });
      },

      // Listen to events triggered by the contract
      listenToEvents: function () {
            App.contracts.ChainList.deployed().then(function (instance) {
                  instance.LogSellArticle({}, {}).watch(function (error, event) {
                        if (!error) {
                              $("#events").append('<li class="list-group-item">' + event.args._name + " is now for sale.</li>")
                        } else {
                              console.error(error);
                        }
                        App.reloadArticles();
                  });
                  instance.LogBuyArticle({}, {}).watch(function (error, event) {
                        if (!error) {
                              $("#events").append('<li class="list-group-item">' + event.args._buyer + " bought " + event.args._name + ".</li>");
                        } else {
                              console.error(error);
                        }
                        App.reloadArticles();
                  });
            });
      },

      buyArticle: function (event) {
            event.preventDefault();

            // Retrieve the article price
            var _articleID = $(event.target).data('id');
            var _price = parseFloat($(event.target).data('value'));

            App.contracts.ChainList.deployed().then(function (instance) {
                  return instance.buyArticle(_articleID, {
                        from: App.account,
                        value: web3.toWei(_price, 'ether'),
                        gas: 500000
                  });
            }).catch(function (error) {
                  console.error(error);
            });
      }
};

$(function () {
      $(window).load(function () {
            App.init();
      });
});