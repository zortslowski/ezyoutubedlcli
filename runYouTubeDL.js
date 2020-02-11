'use strict';
const React = require('react');
const { Box } = require('ink');
const { exec } = require('child_process');

const RunYouTubeDL = ({ videoURL, videoFormat, recodeFormat, exit, setError, setStep }) => {
  const [cmdOutput, setcmdOutput] = React.useState('');
  const formatNumber = videoFormat.split(/\s/)[0].replace(/[^0-9]/);
  const recodeCommand = recodeFormat !== 'No' ? `--recode-video ${recodeFormat}` : '';
  const cmdToRun = `youtube-dl.exe -f ${formatNumber} ${recodeCommand} ${videoURL}`;

  React.useEffect(() => {
    if (cmdOutput === '') {
      const saveVideo = exec(cmdToRun);
      saveVideo.stdout.on('data', data => setcmdOutput(data));

      saveVideo.stderr.on('Close', () => exit());

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

module.exports = RunYouTubeDL;
