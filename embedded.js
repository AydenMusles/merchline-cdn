var collectionEmbed = function(target, config) {
  // Defaults
  this.config = {
    'collection': null,
    'store': null,
    'token': null,
    'openInNewTab': true
  }
  // Merge custom configs
  console.log(config)
  if (config) {
    for (var key in config) {
      this.config[key] = config[key];
    }
  }
  // Initialise
  this.loadSDK = this.loadSDK.bind(this);
  this.loadSDK()
}
collectionEmbed.prototype.loadSDK = function(){
  var collection = this.config.collection
  var store = this.config.store
  var token = this.config.token
  var target = this.config.target
  var linkTarget="";
  if(this.openInNewTab == true){
    var linkTarget = "target='_blank'"
  }

  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI){
      ShopifyBuyInit()
    } else {
      loadScript()
    }
  } else {
    loadScript()
  }

  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }

  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({ domain:store,storefrontAccessToken:token});
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('collection', {
        id: collection,
        node: document.getElementById(target),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          "productSet": {
            "iframe": false,
            "contents": {
              "pagination": false
            }
          },
          "product": {
            "buttonDestination": "onlineStore",
            "contents": {
              "img": true,
              "imgWithCarousel": false,
              "options": false,
              "description": false,
              "button": false,
            },
            "templates": {
              "img": "<a href='{{data.onlineStoreUrl}}'"+linkTarget+"><img src='{{data.images.0.src}}&width=600'></a>",
              "title": "<a href='{{data.onlineStoreUrl}}'"+linkTarget+"><h2 class='{{data.classes.title}}'>{{data.title}}</h2></a>"
            }
          },
          "toggle": {
            "iframe": false,
            "contents": {
              "count": false,
              "icon": false,
              "title": false
            }
          },
          "cart": {
            "iframe": false
          }
        }
      });
    });
  }

}
