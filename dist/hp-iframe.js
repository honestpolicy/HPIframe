/**
 * hp-iframe 
 * @version v0.1.1 
 * @link https://github.com/honestpolicy/HPIframe.git 
 * @license MIT 
 */ 

;(function(window){
  var __iframe, Iframe;


  if (!window.console){
    window.console = {};
    
  }


  /*
   * To avoid scrollbars, the iframe can post the height of its content to the implementing window
   * and from there we can update the height of the iframe. This allows us to 
   * avoid scrollbars while always showing the full content.
   *
   * @params {Number}
   * @private
   */

  function updateIframeSize(height){
    var iframe;

    iframe = document.getElementById('hopo-iframe');

    if (height === null || height < 200 || height > 3000) {
      height = 1000;
    }

    iframe.style.height = (height + "px");
  }


  /*
   * Iframe is an implementors entry point to using the Iframe. Eventually,
   * this will be updated to incorporate security concerns
   *
   *  ```javascript
   *    var iframe = new Iframe();
   *    iframe.automaticResize = true;
   *    iframe.urlParams = "background_color=00ffF0&input_label_color=e36aFc";
   *    iframe.load();
   *  ```
   *
   *  It expects there to be an iframe 
   *
   */

  Iframe = function() { __iframe = this; };


  /*
   * Determines if the iframe will automatically resize or not
   *
   * @type {Boolean}
   */

  Iframe.prototype.automaticResize = false;


  /*
   * This boolean is used to allow checking for mobile meta that is needed
   * and putting it in their if not found.
   *
   * Some sites may not want us to do this as it may make their website 
   * appear broken
   */

  Iframe.prototype.ensureMobileMeta = true;


  /*
   * This is the default viewport meta tag content we use.
   * It gives the best Iframe experience so far discovered. However, users
   * may adjust this if they want their viewport meta to have a different
   * effect
   */

  Iframe.prototype.viewportContent = "width=device-width, initial-scale=1";


  /*
   * An object of `on` syntaxed keys to functions. For example
   * On page changes, an onPageChange function is attempted to be called
   *
   * @type {Object}
   */

  Iframe.prototype.runtime = {};


  /*
   * Sets url params if an implementor wants to fashion the iframe
   * through url params rather than the ControlPanel
   *
   * @type {String}
   */

  Iframe.prototype.urlParams = '';


  /*
   * The implementors authToken. Must be set
   *
   * @type {String}
   * @required
   */

  Iframe.prototype.authToken = '';

  /*
   * The loader method. Actually loads the iframe from hp.
   * It will error out if it does not find an iframe
   */

  Iframe.prototype.load = function(){
    var iframeScript = document.getElementById('iframe'),
        self = this, called;

    // Make sure we have the correct meta data for mobile sites
    if ( this.ensureMobileMeta ) {
      ensureMobileMeta();
    }

    // Load the iframe when the dom is ready
    function onDomReady(){
      var iframe, root;

      called = true;
      iframe = document.getElementById('hopo-iframe');

      // Throw error if iframe doesnt exist in DOM
      if (!iframe) {
        return console.log("%c You must have an iframe in the DOM with an id of 'hopo-iframe'", "background: black; color: red;");
      }

      // Remove scrolling bars in legacy browsers
      if (self.automaticResize) {
        iframe.setAttribute('scrolling', 'no');
      }

      // Set the src according to the domain
      root = {
        LOCAL: 'http://localhost:3000/',
        LOCALPOW: 'http://hopo.dev/',
        STAGING: 'https://staging.honestpolicy.com/',
        undefined: 'https://www.honestpolicy.com/'
      };

      iframe.src = root[self.mode] + "iframe/widget?auth_token=" + self.authToken + "&" + self.urlParams + "&post_size=" + self.automaticResize;

      // Remove iframe script
      if (iframeScript.parentNode) {
        iframeScript.parentNode.removeChild(iframeScript);
      }


      // Listen for messages from the iframe
      if (window.addEventListener) {
        window.addEventListener('message', resolveMessage, false);
      } else {
        window.attachEvent('onmessage', resolveMessage);
      }

      watchResizeAndRequestIframeHeight();
    }


    // When dom is ready it will fire the above function
    if (document.addEventListener) {
      document.addEventListener( "DOMContentLoaded", onDomReady, false );
    } else if (document.attachEvent) {
      var isFrame; 
      try { 
        isFrame = window.frameElement !== null;
      } catch(e) {}

      if (document.documentElement.doScroll && !isFrame) {
        var tryScroll = function(){ 
          if (called) {
            return;
          }
          try {
            document.documentElement.doScroll("left");
            onDomReady();
          } catch(e) {
            setTimeout(tryScroll, 10);
          }
        };
        tryScroll();
      }
      document.attachEvent("onreadystatechange", function(){ 
        if ( document.readyState === "complete" ) { 
          onDomReady();
        }
      });
    }

  };


  /*
   * Callback function from message event listening. Here we decypher
   * if we are trying to update the iframe size. Or if we are trying
   * to run a hook.
   *
   * @params {EventData}
   */

  function resolveMessage(e){
    var height;

    if (e.data === null || e.data === '') {
      return;
    }

    height = parseInt(e.data) + 80;

    if (__iframe.automaticResize && height > 0){
      updateIframeSize(height);
    } else {
      hook = __iframe.runtime['on' + e.data.hookName];
      if (hook) {
        hook(e.data.argument1, e.data.argument2, e.data.argument3, e.data.argument4);
      }
    }
  }


  /*
   * This makes sure that the HTML page hosting the HP Iframe has the correct
   * meta data to work correclty on mobile
   *
   * The implementor can opt out of this by setting 
   *    ```javascript
   *       iframe.ensureMobileMeta = false;
   *    ```
   */

  function ensureMobileMeta(){
    var foundMeta, meta;

    foundMeta = document.querySelector('meta[name="viewport"]');

    // No meta exists, so we must create one
    if (foundMeta === null) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = __iframe.viewportContent;

      document.querySelector('head').appendChild(meta);
    }
  }


  /*
   * The Iframe has no way to understand when the browser is resizing when the iframe has a fixed width
   * So this lets us know to request the size of the iframe when the browser resizes
   */

  function watchResizeAndRequestIframeHeight(){
    var running = false,
        iframe = document.getElementById('hopo-iframe');

    window.addEventListener('resize', resize, false);

    function requestHeight(){
      iframe.contentWindow.postMessage('requestSize', '*');
      running = false;
    }

    function resize(){
      if (!running) {
        running = true;
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(requestHeight);
        } else {
          setTimeout(requestHeight, 66);
        }
      }
    }
  }

  window.Iframe = Iframe;
})(window);
