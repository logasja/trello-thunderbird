import '../html/options.html.src';

async function auth() {
  let key = process.env.TRELLO_KEY;
  // let width = 420;
  // let height = 470;
  // let left = window.screenX + (window.innerWidth - width) / 2;
  // let top = window.screenY + (window.innerHeight - height) / 2;
  let origin = browser.extension.getBackgroundPage().location + '/options.html';
  var token;

  console.log(origin);

  let authUrl = `https://trello.com/1/authorize?return_url=${origin}&callback_method=postMessage&expiration=never&name=Project&key=${key}`

  browser.windows.create({
    // type: 'popup',
    url: authUrl,
    // width: width,
    // height: height,
    // left: left,
    // top: top,
    allowScriptsToClose: true
  });

  var receiveMessage = function(event: any) {
    var ref2;
    console.log(event);
    if ((ref2 = event.source) != null) {
      ref2.close();
    }
    if ((event.data != null) && /[0-9a-f]{64}/.test(event.data)) {
      //Send Trello token to rails server through $resource model.
      token = event.data;
      console.log(token);
    } else {
      token = null;
    }
    if (typeof window.removeEventListener === 'function') {
      //remove event listener
      window.removeEventListener('message', receiveMessage, false);
    }
  };
  window.addEventListener('message', receiveMessage, false);
  // return typeof window.addEventListener === 'function' ? window.addEventListener('message', receiveMessage, false) : void 0;
}

function main() {
  document.getElementById('authbutton')!.onclick = auth;
}

window.addEventListener('load', event => {
  main();
});