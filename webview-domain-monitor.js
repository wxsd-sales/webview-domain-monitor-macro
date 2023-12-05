/********************************************************
 * 
 * Macro Author:      	William Mills
 *                    	Technical Solutions Specialist 
 *                    	wimills@cisco.com
 *                    	Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 12/01/23
 * 
 * This is an example macro which closes any open Web App or 
 * WebView on a Webex Device if URL is not in the macros approved list.
 *
 * Full Readme, source code and license agreement available
 * on Github:
 * https://github.com/wxsd-sales/webview-domain-monitor-macro/
 * 
 ********************************************************/

import xapi from 'xapi';

const config = {
  allowedDomains: [
    'www.cisco.com',
    'www.example.com',
    'search.cisco.com'
  ],
  alertPrompt: {
    Duration: 10,
    Title: `Domain Restricted`,
    Text: 'Access is limited to approved domains only!<br>Your session has been reset',
    FeedbackId: 'webviewAutoclose'
  }
};

/*********************************************************
 * Apply Config and subscribe to Event and Status changes
**********************************************************/

xapi.Status.UserInterface.WebView.on(processWebViews);


/*********************************************************
 * Macros Main functions and change processing
**********************************************************/


// Initially check current WebViews once macro has started
processWebViews();


async function processWebViews(change) {
  console.log('Checking WebViews');

  console.log(change)

  if (change) {
    // Ignore changes which don't include status or ghost
    if (!(change.hasOwnProperty('URL') || change.hasOwnProperty('Status'))) return
    console.log('Processing WebView Change', change)
  }

  const validViews = await monitoredWebViews();
  // Stop any timers if no valid WebView is visible 
  if (validViews.length == 0) {
    console.log('No Valid WebViews Visible');
    return;
  }

  const blocked = checkBlockedDomains(validViews);
  if (!blocked) return
  console.log('Content Blocked - Closing WebViews')
  closeWebViews();
  displayPrompt();
}

function displayPrompt() {
  console.log('Displaying Auto Close Prompt');
  xapi.Command.UserInterface.Message.Prompt.Display(config.alertPrompt);
}

async function monitoredWebViews() {
  const webViews = await xapi.Status.UserInterface.WebView.get();

  // Filter Visible and valid WebView types
  const validViews = webViews.filter(view => {
    return view.Status == 'Visible' && view.URL != '' &&
      (view.Type == 'WebApp' ||
        view.Type == 'Integration' ||
        view.Type == 'ECM' ||
        view.Type == 'ECMSignIn')
  })

  // Return if any valid webviews are visible
  return validViews
}

function checkBlockedDomains(views) {
  return views.filter(view => invalidDomain(view.URL)).length > 0
}

function invalidDomain(url) {
  return config.allowedDomains.every(domain => !(url.startsWith('https://' + domain)))
}

async function closeWebViews() {
  console.log('Closing WebViews');
  await xapi.Command.Presentation.Stop();
  await xapi.Command.UserInterface.Extensions.Panel.Close();
  await xapi.Command.UserInterface.WebView.Clear({Target: 'OSD'})
  hardCloseWebApps();
}



async function hardCloseWebApps() {
  const extensions = await xapi.Command.UserInterface.Extensions.List({ ActivityType: 'WebApp' });
  if (!extensions.hasOwnProperty('Extensions')) return
  if (!extensions.Extensions.hasOwnProperty('Panel')) return
  const webapps = extensions.Extensions.Panel;
  if (webapps.length == 0) return
  console.log(`Clearing WebApps - Quantity [${webapps.length}]`)
  await xapi.Command.UserInterface.Extensions.Clear({ ActivityType: 'WebApp' })
  setTimeout(() => {
    console.log(`Restoring WebApps - Quantity [${webapps.length}]`)
    webapps.forEach(webapp => saveWebApp(webapp))
  }, 500)
}

function saveWebApp(webapp){
  const panel = `<Extensions>
  <Panel>
    <Order>${webapp.Order}</Order>
    <Location>${webapp.Location}</Location>
    <Icon>Custom</Icon>
    <Name>${webapp.Name}</Name>
    <ActivityType>WebApp</ActivityType>
    <ActivityData>${webapp.ActivityData}</ActivityData>
    <CustomIcon>
      <Content/>
      <Id>${webapp.CustomIcon.Id}</Id>
    </CustomIcon>
  </Panel>
  </Extensions>`

 return xapi.Command.UserInterface.Extensions.Panel.Save(
    { PanelId: webapp.PanelId }, panel);
}
