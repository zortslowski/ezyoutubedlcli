'use strict';
const React = require('react');
const { Box } = require('ink');
const SelectInput = require('ink-select-input').default;

const AskToRecode = ({ videoFormat, setRecodeFormat, setStep }) => {
  const videoFormatDetails = videoFormat
    .replace(/^\d+\s/, '')
    .trim()
    .replace(/\s{2,}/g, ' ');
  const items = 'No|Yes save as mp4|Yes save as flv|Yes save as ogg|Yes save as webm|Yes save as mkv|Yes save as avi'
    .split('|')
    .map(x => ({ label: x, value: x.substring(x.length - 3) }));

  const chooseRecode = ({ value: recodeChoice }) => {
    setRecodeFormat(recodeChoice);
    setStep(3);
  };
  return (
    <React.Fragment>
      <Box>Chosen format</Box>
      <Box>{videoFormatDetails}</Box>
      <Box></Box>
      <Box>Do you want to recode final video to another format?</Box>
      <SelectInput items={items} onSelect={chooseRecode} />
    </React.Fragment>
  );
  // <Box>youtube-dl.exe  -f  {videoURL} --recode-video </Box>
};

module.exports = AskToRecode;
