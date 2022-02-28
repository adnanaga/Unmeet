chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['awkward.js']
        });
      });
    }
  });