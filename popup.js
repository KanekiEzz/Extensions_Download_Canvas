document.getElementById('downloadBtn').addEventListener('click', async () => {
  const btn = document.getElementById('downloadBtn');
  const originalText = btn.textContent;
  
  btn.textContent = '⏳ Processing...';
  btn.disabled = true;
  
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      throw new Error('Cannot access system pages');
    }
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['canvas-downloader.js']
    });
    
    setTimeout(() => window.close(), 1000);
    
  } catch (error) {
    console.error('Error:', error);
    btn.textContent = '❌ Error';
    

    const status = document.getElementById('status');
    status.style.display = 'block';
    status.style.background = 'rgba(255,0,0,0.2)';
    status.style.color = 'white';
    status.textContent = error.message.includes('system pages') 
      ? 'Cannot access this page' 
      : 'Failed to download';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      status.style.display = 'none';
    }, 2000);
  }
});