/* eslint-disable prettier/prettier */
const path = require('path');

module.exports = {
	assets: ['./fonts/'],
	dependencies: {
		'vision-camera-dynamsoft-document-normalizer': {
			root: path.join(__dirname, '..'),
		},
		'react-native-vector-icons': {
			platforms: {
				ios: null,
			},
		},
	},
};
