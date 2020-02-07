var collectionEmbed = function(target, config) {
  // Defaults
  this.config = {
    'collection': null,
    'store': null,
    'token': null,
    'customLinkColor': 'inherit',
    'darkBackground': false,
    'openInNewTab': true,
    'showCredit': true
  }
  // Merge custom configs
  // console.log(config)
  if (config) {
    for (var key in config) {
      this.config[key] = config[key];
    }
  }
  // Initialise
  this.target = target
  this.loadSDK = this.loadSDK.bind(this);
  this.loadSDK()
}

collectionEmbed.prototype.loadSDK = function(){
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
  var target = this.target
      targetNode = this.target.replace('#','')
      collectionID = this.config.collection
      collectionWrapper = "collection_"+collectionID
      store = this.config.store
      token = this.config.token
      openInNewTab = this.config.openInNewTab
      customLinkColor = this.config.customLinkColor
      darkBackground = this.config.darkBackground
      showCredit = this.config.showCredit
  var linkTarget = '';
  if(openInNewTab == true){
    var linkTarget = "target='_blank'"
  }
  var textClass = "light_background"
  if(darkBackground == true){
    var textClass = "dark_background"
  }
  if (window.ShopifyBuy){
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
    // console.log(ShopifyBuy.UI)
    // Seems this might need to run for each then be initialised later in one go
    var client = ShopifyBuy.buildClient({domain:store,storefrontAccessToken:token});
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('collection', {
        id: collectionID,
        node: document.getElementById(targetNode),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          "productSet": {
            "iframe": false,
            "contents": {
              "pagination": false
            },
            "classes": {
              "productSet": collectionWrapper + ' ' + textClass
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
              "title": "<a href='{{data.onlineStoreUrl}}'"+linkTarget+"><h2 class='product_title'>{{data.title}}</h2></a>"
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
      }).then(function(){
        creditInit()
        customStyles()
      });
    });
  }

  function creditInit() {
    if (showCredit == true) {
      var creditElement =  document.createElement('div')
      var targetFrame = document.querySelector('.shopify-buy__collection-products')
      creditElement.classList.add('powered_by_merchline')
      creditElement.innerHTML = '<a href="https://merchline.com" target="_blank"><span>Powered by</span><svg xmlns="http://www.w3.org/2000/svg" aria-label="Powered by Merchline" role="img" width="28" height="28" viewBox="650 183 65 65"><title>Powered by Merchline</title><desc>Powered by Merchline logo</desc><g class="fill"><path d="M663.245 231.23c3.358-.048 8.995-.14 8.995-.14v-19.16l1.733-.427v19.554c2.108-.03 8.503-.126 10.61-.154v-21.985l1.785-.438v22.392l8.993-.138v-35.55c-1.11.386-30.22 10.38-32.114 11.042v25.004z"/><path d="M696.94 232.427h-35.03v-27.042c11.656-4.278 23.305-8.557 34.955-12.833l5.744 33.47-5.67 6.405zm-14.8-48.927c-17.55 0-31.778 14.227-31.778 31.776 0 17.55 14.23 31.78 31.778 31.78 17.55 0 31.78-14.23 31.78-31.78S699.69 183.5 682.14 183.5z"/></g></svg><span>Merchline</span></a>';
      targetFrame.appendChild(creditElement);
    }
  }

  function customStyles() {
    if (customLinkColor !== 'inherit') {
      console.log('custom color')
      var styleWrapper = '.'+collectionWrapper
      // Create our stylesheet
      var styleElement = document.createElement('style');
      styleElement.innerHTML =
      	styleWrapper + ' .product_title {' +
      		'color: ' + customLinkColor + ';' +
      	'} ';
      // Insert our new styles
      var targetElement = document.querySelector(target);
      targetElement.parentNode.insertBefore(styleElement, targetElement);
    }
  }

}

