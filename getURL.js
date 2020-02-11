'use strict';
const React = require('react');
const { Box, Color } = require('ink');
const TextInput = require('ink-text-input').default;

const GetURL = ({ onChange, setStep, videoURL = '' }) => {
  const onSubmit = () => setStep(1);
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

module.exports = GetURL;
