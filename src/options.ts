import '../html/options.html.src';
import {TrelloClient} from 'trello.js';

var trelloKey = process.env.TRELLO_KEY ? process.env.TRELLO_KEY : "";
var trelloToken = "";

async function auth() {
  let appName = process.env.APP_NAME;
  // let origin = browser.extension.getBackgroundPage().location;

  let authUrl = `https://trello.com/1/authorize?expiration=never&name=${appName}&key=${trelloKey}`
  // let authUrl = `https://trello.com/1/authorize?return_url=${origin}&callback_method=postMessage&expiration=never&name=Project&key=${key}`

  browser.windows.create({
    type: 'popup',
    url: authUrl,
    allowScriptsToClose: true
  });

  document.getElementById('authbutton')!.classList.add('hidden');
  document.getElementById('token-fieldset')!.classList.remove('hidden');
  document.getElementById('auth-form')!.onsubmit = saveToken;
}

function saveToken(event: Event) {
  console.log(event);
  let form = document.getElementById('auth-form') as HTMLFormElement;
  let data = new FormData(form);
  for (const [name, value] of data) {
    console.log(name, value);
    if (name === 'trello-token') {
      trelloToken = value.toString();
      // @ts-expect-error
      browser.storage.local.set({'trello-token': trelloToken});
    }
  }
  form.onsubmit = null;
  form.classList.add('hidden');
  showTrelloAccount();
}

async function showTrelloAccount() {
  let client = new TrelloClient({key: trelloKey, token: trelloToken})
  console.log(client);
}

async function main() {
  // @ts-expect-error
  trelloToken = await browser.storage.local.get('trello-token');
  if (trelloToken) {
    // @ts-expect-error
    trelloToken = trelloToken['trello-token'];
    document.getElementById('auth-form')!.classList.add('hidden');
    console.log(trelloToken);
  }
  document.getElementById('authbutton')!.onclick = auth;
}

window.addEventListener('load', event => {
  main();
});