# HP Link

Link for HP partners

## Getting Started

Download the [jQuery plugin][min] and place hp-link[.min].js and the hp-link[.min].css in the appropriate places.

[min]: https://github.com/colevoss/hpLink/tree/master/dist

###In your web page:
After including jquery, hp-link[.min].js and hp-link[.min].css place "_$.hpLink()_" inside a document.ready function somehwere in your javascripts.

Then add a hp-link data attribute to the button or link that will initialize HP Link modal. The data-hp-link attribute will need to include the following attributes:
* type: [button, ad-static, ad-targeted]
* name: _This can be any unique identifier for that button._
* desc: _**Optional**_ anything that describes the button. Position on page, usage, etc.

The value of the data-hp-link attribute needs to be in the form of a JSON string. eg: '{"type": "button", "name": "find-auto-insurance"}'
```html
<head>
  <script src="jquery.js"></script>
  <script src="dist/hp-link.min.js"></script>
  <link rel="stylesheet" href="dist/hp-link.min.css" type="text/css" />
</head>
<body>
  <script>
    $(function(){
      $.hpLink({
        line: 'auto',
        key: '<Your HP Key>'
      });
    });
  </script>
  <a href='#' data-hp-link></a>
  <button data-hp-link='{"type": "button", "name": "find-auto-insurance"}'></button>
  <a href='#' data-hp-link='{"type": "ad-static", "name": "top-banner-nebraska-1", "desc": "Banner at top of page"}'>
    <img src='{img-source}' width='400'/>
  </a>
</body>
```
This should prepare the button to display the HP Link modal when clicked.

## Documentation
### Customization
You can determin how the HP Link modal enters the screen by setting parameters such as:
_*defaults in bold italics_
* entrace: [slide, _**fade**_]
* startPlacement: [_**top**_, left]
* speed: [_**fast**_, slow, 100-1000]

You will also need to include two attributes to indicate the line of business and your HonestPolicy Lead Source key.
* line: [home, auto, health, life]
* key: (Key provided to you by HonestPolicy)
```javascript
  $(function(){
    $.hpLink({
      line: 'home',
      key: '<your HP Key>',
      entrance: 'slide', // Modal slides into view
      startPlacement: 'left', // Modal slides from the left side of the screen.
      speed: 500, // Medium speed.
    })
  });
```

### How It Works
When the button with the hp-link data attribute is clicked, the user will be directed to Honest Policy partners after appropriate modals are presented.
