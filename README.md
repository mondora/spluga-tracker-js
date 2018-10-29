![spluga](https://user-images.githubusercontent.com/1983531/47654849-032d3980-db8c-11e8-8649-d836f712a4a2.png)

# spluga-tracker-js

Simple javascript based activity tracker for spluga

## about

Activity tracker for the spluga ecosystem. More info about spluga can be found at [spluga.io](https://spluga.io/)

## usage

```javascript
import createTracker from "spluga-tracker-js";

const option = {...};
const tracker = await createTracker(option)
await tracker(quantity,unity);
```

## option

-   activityEndpoint: spluga endpoint to record activity (required)
-   clientId: spluga clientId (required)
-   clientSecret: spluga client secret (required)
-   player: spluga player name (required)
-   tokenEndpoint: spluga endpoint to autheticate api request (required)
-   raiseError: [false] if false all error from the library are suppressed
-   verbose: [false] enable stdout logging or not
-   name: [Api Integrations] activity name

## info

The library is designed to eventually fail silently, to avoid interference in the functionalities of the hosting software.

## contribution

Feel free to fork and contribute. Made with love in [mondora](https://mondora.com/#!/).
