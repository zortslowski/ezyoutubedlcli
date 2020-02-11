'use strict';
const React = require('react');
const { Box, Color, useApp } = require('ink');
const TextInput = require('ink-text-input').default;
const SelectInput = require('ink-select-input').default;
const { exec } = require('child_process');

const GetURL = ({ onChange, onSubmit, videoURL = '' }) => {
  return (
    <React.Fragment>
      <Box>Please paste youtube url</Box>
      <Box>
        <Color green>> </Color>
        <TextInput placeholder="https://www.youtube.com/watch" value={videoURL} onChange={onChange} onSubmit={onSubmit} />
      </Box>
    </React.Fragment>
  );
};

const ChooseFormatGUI = ({ handleSelect, videoURL, setError, setStep }) => {
  const [items, setItems] = React.useState('');
  React.useEffect(() => {
    if (items === '') {
      const ls = exec(`youtube-dl -F ${videoURL}`);
      ls.stdout.on('data', data => {
        var shortcode_regex = /^(\d+.*)$/gm;

        var matches = [];
        data.replace(shortcode_regex, function(match, value) {
          matches.push({
            value,
            label: value,
          });
        });
        setItems(matches);
      });

      ls.stderr.on('data', data => {
        setError(data);
        setStep('error');
      });
    }
  }, [items, videoURL]);

  if (items === '') {
    return <Box>Looking up available formats</Box>;
  }

  return (
    <Box flexDirection="column">
      <Box>What Format Do you want download</Box>
      <Box>Desired result not shown? Don't worry you can choose a final format later</Box>
      <Box>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};

const AskToRecode = ({ videoFormat, handleSelect }) => {
  const videoFormatDetails = videoFormat
    .replace(/^\d+\s/, '')
    .trim()
    .replace(/\s{2,}/g, ' ');
  const items = 'No|Yes save as mp4|Yes save as flv|Yes save as ogg|Yes save as webm|Yes save as mkv|Yes save as avi'
    .split('|')
    .map(x => ({ label: x, value: x.substring(x.length - 3) }));
  return (
    <React.Fragment>
      <Box>Chosen format</Box>
      <Box>{videoFormatDetails}</Box>
      <Box></Box>
      <Box>Do you want to recode final video to another format?</Box>
      <SelectInput items={items} onSelect={handleSelect} />
    </React.Fragment>
  );
  // <Box>youtube-dl.exe  -f  {videoURL} --recode-video </Box>
};

const Verify = ({ videoFormat = 'unknown format', videoURL = 'unknown url', recodeFormat = 'No', handleVerify = () => false } = {}) => {
  const displayFormat = recodeFormat !== 'No' ? recodeFormat : videoFormat;
  return (
    <React.Fragment>
      <Box>Save {videoURL} as</Box>
      <Box>{displayFormat}</Box>
      <SelectInput
        items={[
          { value: 1, label: 'Yes' },
          { value: 0, label: 'Change Src' },
          { value: 2, label: 'Change Recode Format' },
          { value: 3, label: 'Start Over' },
          { value: 4, label: 'Quit' },
        ]}
        onSelect={handleVerify}
      />
    </React.Fragment>
  );
  // <Box>youtube-dl.exe  -f  {videoURL} --recode-video </Box>
};

const RunYouTubeDL = ({ videoURL, videoFormat, recodeFormat, handleVerify, setError, setStep }) => {
  const [cmdOutput, setcmdOutput] = React.useState('');
  const formatNumber = videoFormat.split(/\s/)[0].replace(/[^0-9]/);
  const recodeCommand = recodeFormat !== 'No' ? `--recode-video ${recodeFormat}` : '';
  const cmdToRun = `youtube-dl.exe -f ${formatNumber} ${recodeCommand} ${videoURL}`;

  React.useEffect(() => {
    if (cmdOutput === '') {
      const saveVideo = exec(cmdToRun);
      saveVideo.stdout.on('data', data => setcmdOutput(data));

      saveVideo.stderr.on('Close', () => handleVerify(4));

      saveVideo.stderr.on('data', data => {
        setError(data);
        setStep('error');
      });
    }
  }, [cmdToRun, setError, setStep]);

  if (cmdOutput === '') {
    return <Box>Running youtube-dl...</Box>;
  }
  return <Box>{cmdOutput}</Box>;
};

const App = () => {
  const { exit } = useApp();
  const [step, setStep] = React.useState(0);
  const [videoURL, setvideoURL] = React.useState('https://www.youtube.com/watch?v=zW3XawAsaeU');
  const [videoFormat, setVideoFormat] = React.useState('');
  const [recodeFormat, setRecodeFormat] = React.useState('');
  const [errorFound, setErrorFound] = React.useState('');

  const chooseDownloadFormat = saveFormat => {
    setVideoFormat(saveFormat.value);
    setStep(2);
  };

  const chooseRecode = ({ value: recodeChoice }) => {
    setRecodeFormat(recodeChoice);
    setStep(3);
  };

  const handleVerify = ({ value }) => {
    const action = {
      0: () => setStep(1),
      1: () => setStep(4),
      2: () => setStep(2),
      3: () => setStep(0),
      4: () => exit(),
    };
    action[value]();

    // setStep('debug');
  };

  switch (step) {
    case 0:
      return <GetURL onChange={setvideoURL} onSubmit={() => setStep(1)} videoURL={videoURL} />;

    case 1:
      return <ChooseFormatGUI handleSelect={chooseDownloadFormat} videoURL={videoURL} setError={setErrorFound} setStep={setStep} />;

    case 2:
      return <AskToRecode videoFormat={videoFormat} handleSelect={chooseRecode} />;

    case 3:
      return <Verify videoFormat={videoFormat} videoURL={videoURL} handleVerify={handleVerify} />;

    case 4:
      return (
        <RunYouTubeDL
          videoURL={videoURL}
          videoFormat={videoFormat}
          recodeFormat={recodeFormat}
          handleVerify={handleVerify}
          setError={setErrorFound}
          setStep={setStep}
        />
      );

    case 'error':
      return <Box>{errorFound}</Box>;

    case 'debug':
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

    default:
      return <Box>Default case reached</Box>;
  }
};

module.exports = App;
