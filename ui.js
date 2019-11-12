'use strict';
const React = require('react');
const { Box, Color, useApp } = require('ink');
const TextInput = require('ink-text-input').default;
const SelectInput = require('ink-select-input').default;

const GetURL = ({onChange, onSubmit, videoURL=''}) => (
	<React.Fragment><Box>Please past youtube url</Box>
	<Box>
		<Color green>> </Color>
		<TextInput
			placeholder="https://www.youtube.com/watch"
			value={videoURL}
			onChange={onChange}
			onSubmit={onSubmit}
		/>
	</Box>
	</React.Fragment>
);

const ChooseFormatGUI = ({handleSelect, videoURL}) => {
	const items = 'mp4|flv|ogg|webm|mkv|avi'.split('|').map(x => ({ label: x, value: x }));

	return <Box flexDirection="column">
		<Box>What Format Do you want the result to be</Box>
		<Box><SelectInput items={items} onSelect={handleSelect} /></Box>
	</Box>
};


const Verify = ({videoFormat = 'unknown', videoURL="unknown url"}={}) => {
		return (
			<React.Fragment>
				<Box>Save {videoURL} as {videoFormat}</Box>
				<SelectInput />
				<Box>youtube-dl.exe  -f '(bestvideo+bestaudio/best)' {videoURL} --recode-video {videoFormat}</Box>
			</React.Fragment>
		);
	};

const App = () => {
	const {exit} = useApp();
	const [step, setStep] = React.useState(0);
	const [videoURL, setvideoURL] = React.useState('');
	const [videoFormat, setVideoFormat] = React.useState('');

	React.useEffect( () => {
		if(step === 2) exit();
	}, [step]);

	const chooseFinalFormat = (saveFormat) => {
		setVideoFormat(saveFormat.value);
		setStep(2);
	};

	switch(step){
		case 0:
			return(<GetURL onChange={setvideoURL}  onSubmit={() => setStep(1)} videoURL={videoURL} />);

		case 1:
			return(<ChooseFormatGUI handleSelect={chooseFinalFormat} videoURL={videoURL} />);

		case 2:
			return(<Verify videoFormat={videoFormat} videoURL={videoURL} />);
		
		default:
			return (<Box>Default case reached</Box>)
	}
}

module.exports = App;
