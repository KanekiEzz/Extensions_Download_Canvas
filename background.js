chrome.action.onClicked.addListener((tab) => {
  executeCanvasDownload(tab.id);
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'download-canvas') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      executeCanvasDownload(tabs[0].id);
    });
  }
});

function executeCanvasDownload(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['canvas-downloader.js']
  });
}