;(function(window){
  var __iframe;


  if (!window.console){
    window.console = {};
    console.log = function(){};
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

    if (height === null || height < 200 || height > 3000) height = 1000;

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

  window.Iframe = function() { __iframe = this; };


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
    if ( this.ensureMobileMeta ) ensureMobileMeta();

    // Load the iframe when the dom is ready
    function onDomReady(){
      var iframe;

      called = true;
      iframe = document.getElementById('hopo-iframe');

      if (self.automaticResize) iframe.setAttribute('scrolling', 'no');

      // Throw error if iframe doesnt exist in DOM
      if (!iframe) {
        return console.log("%c You must have an iframe in the DOM with an id of 'hopo-iframe'", "background: black; color: red;");
      }

      // Set the src according to the domain
      if (self.mode === 'LOCAL') {
        iframe.src = "http://localhost:3000/iframe/widget?auth_token=" + self.authToken + "&" + self.urlParams + "&post_size=" + self.automaticResize;

      } else if (self.mode === 'LOCALPOW') {
        iframe.src = "http://hopo.dev/iframe/widget?auth_token=" + self.authToken + "&" + self.urlParams + "&post_size=" + self.automaticResize;

      } else if (self.mode === 'STAGING') {
        iframe.src = "https://staging.honestpolicy.com/iframe/widget?auth_token=" + self.authToken + "&" + self.urlParams + "&post_size=" + self.automaticResize;

      } else {
        iframe.src = "https://www.honestpolicy.com/iframe/widget?auth_token=" + self.authToken + "&" + self.urlParams + "&post_size=" + self.automaticResize;
      }

      if (iframeScript.parentNode) iframeScript.parentNode.removeChild(iframeScript);
      if (window.addEventListener) window.addEventListener('message', resolveMessage, false);
      else window.attachEvent('onmessage', resolveMessage);
    }


    // When dom is ready it will fire the above function
    if ( document.addEventListener ) { document.addEventListener( "DOMContentLoaded", onDomReady, false ); } else if ( document.attachEvent ) { var isFrame; try { isFrame = window.frameElement !== null; } catch(e) {}
      if ( document.documentElement.doScroll && !isFrame ) { var tryScroll = function(){ if (called) return; try { document.documentElement.doScroll("left"); onDomReady(); } catch(e) { setTimeout(tryScroll, 10); } }; tryScroll(); }
      document.attachEvent("onreadystatechange", function(){ if ( document.readyState === "complete" ) { onDomReady(); } });
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

    if (e.data === null || e.data === '') return;

    height = parseInt(e.data) + 80;

    if (__iframe.automaticResize && height > 0){
      updateIframeSize(height);

    } else {
      hook = __iframe.runtime['on' + e.data.hookName];
      if (hook) hook(e.data.argument1, e.data.argument2, e.data.argument3, e.data.argument4);
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

})(window);
