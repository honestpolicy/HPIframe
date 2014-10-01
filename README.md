# HPIframe

The HonesPolicy Iframe gives you access to providing your users with
easy, instant quotes and an opportunity to connect with you, or one of
HonestPolicy's various partners

## Getting Started

We recommend using Bower to install the script to your local server.

`bower install hp-iframe`

Then simply include the script in your page:

    <head>
        <script src="/path/to/hp-iframe.js"></script>
    </head>

You will need to put an iframe in the body of your page, wherever you
would like it to be. It must have the id of `hopo-iframe`

    <iframe id='hopo-iframe'></iframe>

Lastly then you will set up your script to initalize the HPIframe. It
will look something like this (not the id of the script tag, very
important):

    <script id='iframe'>
        var iframe = new Iframe
        iframe.authToken = "my-auth-token";
        iframe.urlParams = "custom=parameters&to=modify&the=iframe"
        iframe.load()
    </script>

## API

The `Iframe` object has a few different options, here we'll outline
them.


#### Iframe.prototype.authToken
* Required.
* Type: String

This is the authorization token provided by HonestPolicy. Without this
you will not have access to the Iframe.


#### Iframe.prototype.urlParams
* Optional.
* Type: String

This needs to be valid GET url parameters. Please follow the
documentation for what parameters are valid to pass.


#### Iframe.prototype.ensureMobileMeta
* Type: Boolean
* Default: true

This script will make sure that your page is properly set up for mobile viewers by ensuring that you have the proper viewport meta tag in the head. If you do not want this, or it is affecting the layout of the page poorly you can turn this off by setting it to false. Additionally, if the script finds that you already have a viewport meta, it will not try to inject another. It will simply use yours.


#### Iframe.prototype.viewportContent
* Type: String
* Default: "width=device-width, initial-scale=1"

This is the content of the viewport meta. You can set it to something else if you would like it to react differently. Or you can just put your own meta in your DOM markup.


#### Iframe.prototype.automaticallyResize
* Optional.
* Type: Boolean
* Default: false

Our Iframe can automatically resize the actualy iframe element to equal
the height of its contents if this is set to true. If False, it will be
your job to set the height of the iframe, and scrollbars will appear if
the iframe's content is bigger than the frame.


#### Iframe.prototype.load
* Required.
* Type: Function

This is the last thing you will do for the `Iframe` object. Any
modifications/calls after this point will be ignored. This handles the
loading of the iframe and all other magic.
