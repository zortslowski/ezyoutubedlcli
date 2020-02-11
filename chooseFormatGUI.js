'use strict';
const React = require('react');
const { Box } = require('ink');
const SelectInput = require('ink-select-input').default;
const { exec } = require('child_process');

const ChooseFormatGUI = ({ videoURL, setError, setStep, setVideoFormat }) => {
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

  const chooseDownloadFormat = saveFormat => {
    setVideoFormat(saveFormat.value);
    setStep(2);
  };

  return (
    <Box flexDirection="column">
      <Box>What Format Do you want download</Box>
      <Box>Desired result not shown? Don't worry you can choose a final format later</Box>
      <Box>
        <SelectInput items={items} onSelect={chooseDownloadFormat} />
      </Box>
    </Box>
  );
};

module.exports = ChooseFormatGUI;
