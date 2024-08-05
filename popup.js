document.getElementById("startCapture").addEventListener("click", startCapture);
document.getElementById("stopCapture").addEventListener("click", stopCapture);

let mediaRecorder = null;
let chunks = [];

function startCapture() {
  chrome.tabCapture.capture(
    {
      audio: true,
      video: false,
    },
    (stream) => {
      let context = new AudioContext();
      let tstream = context.createMediaStreamSource(stream);
      tstream.connect(context.destination);
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "captured_audio.wav";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        chunks = [];
      };

      mediaRecorder.start();
    }
  );
}

function stopCapture() {
  mediaRecorder.stop();
}
