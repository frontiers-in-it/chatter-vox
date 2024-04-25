"use client"

import React, { useState, useEffect  } from 'react';

import { Microphone } from "@/app/components/Microphone";

//import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
//import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';

import { AudioVisualizer }         from "@/app/components/AudioVisualizer";
import { LiveAudioVisualizer }     from "@/app/components/LiveAudioVisualizer";
import { MediaPlayer, AudioSpectrumVisualizer } from "@/app/components/AudioSpectrumVisualizer";

//import { AudioSpectrumVisualizer } from "@/app/components/AudioSpectrumVisualizer";
//import { MediaPlayer } from "@/app/components/AudioSpectrumVisualizer/MediaPlayer";

//const DEBUG = true;
const DEBUG = false;

const RouterOptions = DEBUG ?
      {
	  fakeSpeechToText: true,
	  fakeChatGPT:      true,
	  fakeTextToSpeech: true
      }
      :
      {
	  fakeSpeechToText: false,
	  fakeChatGPT:      false,
	  fakeTextToSpeech: false
      };



export default function Home()
{
    //const [isAudioPlayerLoaded, setAudioPlayerLoaded] = useState(false);

    const [statusText, setStatusText] = useState("Status: waiting for audio input"); // <string>
    const [audioFilename, setAudioFilename] = useState(null);

    const [blob, setBlob] = useState(null);           // <Blob>

    const mediaPlayer = new MediaPlayer(function() {
	console.log("***** mediaPlayer.onstopplaying() called!!");
	setStatusText("Status: waiting for audio input");
	setBlob(null);
    });

    const mediaPlayerWidth  = 400;
    const mediaPlayerHeight = 120;

    const updateStatusCallback = (text) => {
	console.log("updateStatusCallback(), text:" + text);
	//console.log("blob:");
	//console.log(blob);
	setStatusText(text)
    };

   
    const audioFilenameCallback = (recordedAudioFilename, recordedBlob, recordedMimeType) => {
	console.log("[page.js] recordedAudioFilename = " + recordedAudioFilename)
	
	const recordedAudioURL = recordedAudioFilename.replace(/public/, "");
	
	setAudioFilename(recordedAudioFilename);
	//mediaPlayer.state = "start-playing";
	//mediaPlayer.state = "init-to-silence";
	console.log("[page.js] Setting blob to recorded Audio");
	setBlob(recordedBlob);

	
	/*
	// https://codepen.io/SitePoint/pen/JRaLVR
	// https://stackoverflow.com/questions/40363335/how-to-create-an-audiobuffer-from-a-blob

	const audioBuffer = await fetch(audioURL)
	      .then(response => response.arrayBuffer())
	      .then(arrayBuffer => context.decodeAudioData(arrayBuffer));

	*/
    };

	/*
    useEffect(() => {

	// onComponentMount()/update
	
	const audioSilenceURL = "/default-audio-silence.mp3";
	
	window.fetch(audioSilenceURL)
	    .then(response => {
		if (response.ok) {
		    return response.blob();
		}
		throw new Error('Failed to retrieve: ' + audioSilenceURL);
	    })
	    .then(audioBlob => {
		setBlob(audioBlob);
	    })
	    .catch(function(error) {
		console.log('There has been a problem with your fetch operation: ', error.message);
	    });
    }, []);
	*/
    
    
    /*
    useEffect(() => {
	if (mediaPlayer.state == "init-to-silence") {
	    setStatusText("Status: waiting for audio input");
	    mediaPlayer.state = "inactive";
	}
    }, [audioFilename]);
    */
    
    return (
	    <main className="flex min-h-screen flex-col items-center justify-center">
	      <div style={{width: "90%", maxWidth: "900px", backgroundColor: 'white'}}>

	        <div className="flex flex-col justify-center items-center">
	          <div className="textmessage pb-2" style={{width: mediaPlayerWidth+"px"}}>
	            How can I help you today?
	          </div>	    	    
	
	          <div className="border border-black border-solid"
	               style={{width: mediaPlayerWidth+'px', height: mediaPlayerHeight+'px'}}>
		      <AudioSpectrumVisualizer
		         mediaPlayer={mediaPlayer}
		         blob={blob}
		         width={mediaPlayerWidth}
		         height={mediaPlayerHeight}
		         barWidth={3}
		         gap={2}
		         barColor={'lightblue'}
		      />
	          </div>
	    <div className="textmessage text-sm p-2 mt-0 italic" style={{width: mediaPlayerWidth+'px', backgroundColor: "#F0F0F0"}} >
	            {statusText}
	          </div>
	    
	          <Microphone
	             routerOptions={RouterOptions}
	
	             pageAudioFilenameCallback={audioFilenameCallback}
		     pageStatusCallback={updateStatusCallback}
	          />
                </div>
	      </div>
	    </main>
  );
}


