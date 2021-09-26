import '../html/options.html.src';
import {TrelloClient} from 'trello.js';

async function auth() {
  let key = process.env.TRELLO_KEY;
  let appName = process.env.APP_NAME;
  // let origin = browser.extension.getBackgroundPage().location;

  let authUrl = `https://trello.com/1/authorize?expiration=never&name=${appName}&key=${key}`
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
    // @ts-expect-error
    browser.storage.local.set({name, value});
  }
  form.onsubmit = null;
  form.classList.add('hidden');
}

// async function showTrelloAccount() {
//   let client = new TrelloClient({key: })
// }

function main() {
  document.getElementById('authbutton')!.onclick = auth;
}

window.addEventListener('load', event => {
  main();
});