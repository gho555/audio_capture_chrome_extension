document.getElementById('startCapture').addEventListener('click', startCapture);

document.getElementById('stopCapture').addEventListener('click', stopCapture);

let mediaRecorder = null;
let chunks = [];

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'startCapture') {
//     startCapture(sender.tab);
//   } else if (message.action === 'stopCapture') {
//     stopCapture(sendResponse);
//   }
// });


function startCapture() {
  
  chrome.tabCapture.capture({
    audio: true,
    video: false,
  }, (stream) => {
    let context = new AudioContext();
    let tstream = context.createMediaStreamSource(stream);
    tstream.connect(context.destination);
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      // Do something with the captured audio URL, like playing it or saving it
      const a = document.createElement('a');
      a.href = url;
      a.download = 'captured_audio.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      chunks = [];
    };

    mediaRecorder.start();
  });
}

function stopCapture() {
  mediaRecorder.stop();
  window.close();
}
