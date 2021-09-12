import '../html/popup.html.src';

async function main() {
  browser.tabs.query({
    active: true,
    currentWindow: true,
  }).then(tabs => {
    let tabId = tabs[0].id ? tabs[0].id : 0;
    browser.messageDisplay.getDisplayedMessage(tabId).then((message) => {
      document.body.textContent = message.subject;
    })
  });
}

window.addEventListener('load', event => {
  main();
})