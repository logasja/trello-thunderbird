import '../html/options.html.src';

async function auth() {
  browser.windows.create({type:"popup", url: 'https://trello.com/1/authorize?expiration=1day&name=MyPersonalToken&scope=read&response_type=token&key=[appkey]'});
}

function main() {
  document.getElementById("authbutton")!.onclick = auth;
}

window.addEventListener('load', event => {
  main();
});