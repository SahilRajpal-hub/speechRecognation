import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";

const App = () => {
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);

  const argMax = (arr) => {
    return arr.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
  };

  const loadModel = async () => {
    const recognizer = await speech.create("BROWSER_FFT");
    console.log("Model loaded");

    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels());

    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };

  const recognizeCommands = async () => {
    console.log("Listening for commands");
    model.listen(
      (result) => {
        console.log(result);
        setAction(labels[argMax(Object.values(result.scores))]);
        console.log(labels[argMax(Object.values(result.scores))]);
      },
      { includeSpectrogram: true, probabilityThreshold: 0.75 }
    );

    // setTimeout(() => model.stopListening(), 10e3);
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={recognizeCommands}>Command</button>
        {action ? <div>{action}</div> : <div>No action detected</div>}
      </header>
    </div>
  );
};

export default App;
