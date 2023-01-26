const wikiContextMenu = {
  id: 'wikiCheck',
  title: 'WikiCheck',
  contexts: ['selection'],
};

chrome.contextMenus.create(wikiContextMenu);

chrome.contextMenus.onClicked.addListener(async (clickEvent) => {
  if (clickEvent.menuItemId === 'wikiCheck' && clickEvent.selectionText) {
    const searchParameter = JSON.stringify(clickEvent.selectionText);
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    console.log('tab', tab);
    console.log('string', searchParameter);
    await chrome.tabs.sendMessage(tab.id, {
      search: searchParameter,
    });

  }
});


