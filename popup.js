document.getElementById('startCapture').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'startCapture' });
});

document.getElementById('stopCapture').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stopCapture' });
});

