'use strict';
const React = require('react');
const { Box } = require('ink');
const SelectInput = require('ink-select-input').default;
const Verify = ({ videoFormat = 'unknown format', videoURL = 'unknown url', recodeFormat = 'No', setStep, exit } = {}) => {
  const displayFormat = recodeFormat !== 'No' ? recodeFormat : videoFormat;

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

  return (
    <React.Fragment>
      <Box>{`Save ${videoURL} as ${displayFormat}?\n\n`}</Box>
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

module.exports = Verify;
