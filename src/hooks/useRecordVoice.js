"use client";
import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/utils/blobToBase64";
import { getPeakLevel } from "@/utils/createMediaStream";

export const useRecordVoice = (props) => {
    const [text, setText] = useState("");
    const [audioMimeType, setAudioMimeType] = useState("");
    const [audioFilename, setAudioFilename] = useState(null);
    const [micLevel, setMicLevel] = useState("0%");
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);

    const isRecording = useRef(false);
    const chunks = useRef([]);
    const audioContext = useRef(null);
    const sourceNode   = useRef(null);
    const analyzerNode = useRef(null);

    const startRecording = () => {
	if (mediaRecorder) {
	    if (isRecording.current) {
		// Can end up in this situtation if the user has dragged the cursor out of the microphone area
		// and then let go.  Needs a further click on the micronphone icon to stop recording
		console.log("Already recording.  Interpretting this click event as a request to stop recording");
		stopRecording();
	    }
	    else {
		isRecording.current = true;
		mediaRecorder.start();
		setRecording(true);
	    }
	}
    };
    
    const stopRecording = () => {
	if (mediaRecorder) {
	    isRecording.current = false;
	    mediaRecorder.stop();
            setRecording(false);
	}
    };
    
    
    const getText = async (base64data, mimeType) => {
      try {
	  const response = await fetch("/api/speechToText", {
              method: "POST",
              headers: {
		  "Content-Type": "application/json",
              },
              body: JSON.stringify({
		  audio: base64data,
		  mimeType: mimeType
              }),
	  }).then((res) => {
	      let json_str = null;
	      if (res.status == 200) {
		  json_str = res.json();
	      }
	      return json_str;
	  });

	  if (response != null) {
	      const { text } = response.recognizedTextData;
	      const audioFilename  = response.recordedAudioFilename;
	      
	      setText("Recognised text: " + text);
	      setAudioFilename(audioFilename);

	      props.pageAudioFilenameCallback(audioFilename);
	  }
      }
      catch (error) {
	  console.log(error);
      }
  };

  const initialMediaRecorder = (stream) => {
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.onstart = () => {
	  audioContext.current = new AudioContext();
	  sourceNode.current = audioContext.current.createMediaStreamSource(stream);
	  analyzerNode.current = audioContext.current.createAnalyser();
	  sourceNode.current.connect(analyzerNode.current);
	  
	  const tick = () => {
	      
	      if (isRecording.current) {
		  const peak = getPeakLevel(analyzerNode.current);
		  const peak_perc = Math.min(peak * 130,100); // give it a bit of a visual boost!
		  const peak_str = peak_perc.toFixed(0).toString();
		  setMicLevel(peak_str + "%");
		  
		  requestAnimationFrame(tick);
	      }
	      else {
		  sourceNode.current.disconnect();
		  audioContext.current.close();
		  setMicLevel("0%");
	      }
	  };
	  tick();
	  
	  chunks.current = [];
      };
      
      mediaRecorder.ondataavailable = (ev) => {
	  chunks.current.push(ev.data);
      };
      
      mediaRecorder.onstop = () => {
	  const audioMimeType = mediaRecorder.mimeType;
	  console.log("audioMimeType = " + audioMimeType);
	  setAudioMimeType(audioMimeType);      
	  
	  const audioBlob = new Blob(chunks.current, { type: audioMimeType });
	  blobToBase64(audioBlob, getText);
      };

      setMediaRecorder(mediaRecorder);      
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

    return { recording, startRecording, stopRecording, micLevel, text, audioFilename };
};
