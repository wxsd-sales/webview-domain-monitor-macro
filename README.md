# WebView Domain Monitor Macro

This is an example macro which closes any open Web App WebView on a Webex Device if the URL is not in the macros approved list.


## Overview

This macro monitors all open Web Content on a Webex Device and compares the URLs against a local allowed domains list in the macros config.

If the macro detects if the URL doesn't contain an allowed domain, it will close any open Web View and display an alert on the screen indicating the all Web sessions have been reset.


## Setup

### Prerequisites & Dependencies: 

- RoomOS/CE 11.0 or above Webex Board or Desk
- Web admin access to the device to upload the macro.

1. Download the ``webview-domain-monitor.js`` file and upload it to your Webex devices Macro editor via the web interface.
2. Configure the macro by changing the initial values, there are comments explaining each one.
```javascript
const config = {
  allowedDomains: [     // List of Allowed Domains
    'www.cisco.com',
    'www.example.com',
    'search.cisco.com'
  ],
  alertPrompt: {        // Alert Message Configuration
    Duration: 10,
    Title: `Domain Restricted`,
    Text: 'Access is limited to approved domains only!<br>Your session has been reset'
  }
};
```
3. Save the macro changes and enable it using the toggle in the Macro on the editor.
    
## Validation

Validated Hardware:

* Board 70
* Desk Pro

This macro should work on other Webex Board and Desk series devices but has not been validated at this time.

## Demo

*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).


## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.

## Questions
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=webview-domain-monitor-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team.
