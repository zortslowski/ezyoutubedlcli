'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const { Box, useApp } = require('ink');

const GetURL = importJsx('./getURL');
const ChooseFormatGUI = importJsx('./ChooseFormatGUI');
const AskToRecode = importJsx('./askToRecode');
const Verify = importJsx('./verify');
const RunYouTubeDL = importJsx('./RunYouTubeDL');

const App = () => {
  const { exit } = useApp();
  const [step, setStep] = React.useState(0);
  const [videoURL, setvideoURL] = React.useState('https://www.youtube.com/watch?v=zW3XawAsaeU');
  const [videoFormat, setVideoFormat] = React.useState('');
  const [recodeFormat, setRecodeFormat] = React.useState('');
  const [errorFound, setErrorFound] = React.useState('');

  switch (step) {
    case 0:
      return <GetURL onChange={setvideoURL} setStep={setStep} videoURL={videoURL} />;

    case 1:
      return <ChooseFormatGUI setVideoFormat={setVideoFormat} videoURL={videoURL} setError={setErrorFound} setStep={setStep} />;

    case 2:
      return <AskToRecode videoFormat={videoFormat} setRecodeFormat={setRecodeFormat} setStep={setStep} />;

    case 3:
      return <Verify videoFormat={videoFormat} videoURL={videoURL} recodeFormat={recodeFormat} setStep={setStep} exit={exit} />;

    case 4:
      return <RunYouTubeDL videoURL={videoURL} videoFormat={videoFormat} recodeFormat={recodeFormat} setError={setErrorFound} setStep={setStep} exit={exit} />;

    case 'error':
      return <Box>{errorFound}</Box>;

    default:
      return (
        <React.Fragment>
          <Box>Debug</Box>
          <Box>step: {step}</Box>
          <Box>videoURL: {videoURL}</Box>
          <Box>videoFormat: {videoFormat}</Box>
          <Box>recodeFormat: {recodeFormat}</Box>
          <Box>errorFound: {errorFound}</Box>
        </React.Fragment>
      );
  }
};

module.exports = App;
