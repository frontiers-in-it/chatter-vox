A React-based app providing an audio interface to LLM-based models
such as ChatGTP and Claude

The app is written so different back-end APIs can be used for the
speech recognition, LLM-model, and speech synthesis.  By default the
software is configured to peform all three of these tasks using
OpenAI's APIs.  For the app to be able to successfully call such APIs,
relevant, valid keys must be provided in the _.env_ file.

````
OPENAI_API_KEY=sk-????????????????????????????????????????????????

ANTHROPIC_API_KEY=sk-ant-?????-???????????????????????????????????????????????????????????????????????????????????????????????
````

To compile:
````
    npm install
````

To run (in developer mode):
````
    npm run dev
````

By default the app runs on port 3000, which can then be accessed
in your web browser:
````
    http://localhost:3000
````

Inspiration for the audio component taken from:

  https://github.com/ZaharBerku/openai-speech-to-text


