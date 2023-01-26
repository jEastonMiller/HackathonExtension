let parentNode = document.querySelector('body');

console.log('hjellow');

chrome.runtime.onMessage.addListener(async (req, sender, sendRes) => {
  console.log(req);
  if (req.search) {
    console.log(req.search);
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=description&list=search&pageids=&formatversion=2&srsearch=${JSON.parse(req.search)}`
    )
      .then(async (data) => data.json())
      .then(async (data) => {
        console.log(data);



        // set vars equal to their corresponding info in data
        const articleList = data.query.search[0]; // CHANGE TO WHOLE LIST NOT FIRST ELEMENT

        const pageId = articleList.pageid;

        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts%7Cpageimages%7Crevisions&pageids=${pageId}&redirects=1&formatversion=2&exsentences=4&exintro=1&explaintext=1&piprop=thumbnail%7Cname&pithumbsize=300&rvprop=timestamp`);
        console.log(response);
        const articleData = await response.json();

        const textContent = articleData.query.pages[0].extract;

        //********* For now just hard coding vars to first list element prop vals**********//
        //********* Replace with for loop search based on highlighted input**********//
        // function for removing html tags
        // function removeTags(str) {
        //   if (str === null || str === '') return false;
        //   else str = str.toString();
        //   return str.replace(/(<([^>]+)>)/gi, '');
        // }

        const summaryWindow = document.createElement('div');
        summaryWindow.setAttribute('class', 'mainWindow');
        summaryWindow.style.cssText = 'background-color: white; max-width: 25%; font-size: 18px; border-style: ridge; border-radius: 8px; border-color: blue'

        const innerDiv = document.createElement('div');
        innerDiv.style.padding = '20px 20px';

        // create title element
        const title = document.createElement('a');
        title.setAttribute('class', 'titleLink');
        title.innerText = articleList.title;
        title.style['font-size'] = '25px';
        title.href = `http://en.wikipedia.org/?curid=${articleList.pageid}`;

        // create summary element
        const summary = document.createElement('h1');
        summary.setAttribute('class', 'articleSummary');
        // create snippet summary string to pass into remove tags func
        // const snippet = articleList.snippet;
        summary.innerText = textContent;
        summary.style['font-size'] = '15px';


        innerDiv.appendChild(title);
        innerDiv.appendChild(summary);

        summaryWindow.appendChild(innerDiv);

        createModal(parentNode, summaryWindow);
      });
  }
});

const createModal = (parent, child) => {
  const modalBackground = document.createElement('div');
  modalBackground.style.cssText =
    'background-color : rgba(135, 128, 131, 0.22); height: 100vh; width: 100vw; position: fixed; z-index: 1000; top: 0; left: 0; display: flex; justify-content: center; align-items: center';
  modalBackground.addEventListener('click', (e) => {
    if (e.target === modalBackground) {
      modalBackground.remove();
    }
  });
  modalBackground.appendChild(child);
  parent.appendChild(modalBackground);
};
