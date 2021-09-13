import '../html/popup.html.src';

async function main() {
  browser.tabs.query({
    active: true,
    currentWindow: true,
  }).then(tabs => {
    let tabId = tabs[0].id ? tabs[0].id : 0;
    browser.messageDisplay.getDisplayedMessage(tabId).then((message) => {
      console.log(message);
      const subjectel = document.getElementById('title')! as HTMLInputElement;
      console.log(subjectel);
      subjectel.value = message.subject;
      return browser.messages.getFull(message.id)
    }).then((body) => {
      console.log(body);
      // document.getElementById('body')!.textContent = body.body;
    });
  });
}

window.addEventListener('load', event => {
  main();
})