import React, {useEffect, useState} from 'react';
import {
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	// Dimensions,
} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import * as DDN from 'vision-camera-dynamsoft-document-normalizer';
import type {DetectedQuadResult} from 'vision-camera-dynamsoft-document-normalizer';
import Share, {ShareOptions} from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

const radio_props = [
	{label: 'Color', value: 0},
	{label: 'Gray', value: 1},
	// { label: 'Color', value: 2 },
];

let normalizedResult: any = {};

export type IResultViewerScreen = {
	route: any;
	navigation: any;
};
// export default function ResultViewerScreen({ route, navigation }) {
const ResultViewerScreen: React.FunctionComponent<IResultViewerScreen> = ({navigation, route}) => {
	const [normalizedImagePath, setNormalizedImagePath] = useState<undefined | string>(undefined);

	useEffect(() => {
		normalizedResult = {};
		normalize(0);
	}, []);

	const share = () => {
		let options: ShareOptions = {};
		options.url = 'file://' + normalizedImagePath;
		Share.open(options);
	};

	const normalize = async (value: number) => {
		const GetType = await AsyncStorage.getItem('cameraType');
		if (normalizedResult[value]) {
			setNormalizedImagePath(normalizedResult[value]);
		} else {
			if (value === 0) {
				await DDN.initRuntimeSettingsFromString(
					'{"GlobalParameter":{"Name":"GP","MaxTotalImageDimension":0},"ImageParameterArray":[{"Name":"IP-1","NormalizerParameterName":"NP-1","BaseImageParameterName":""}],"NormalizerParameterArray":[{"Name":"NP-1","ContentType":"CT_DOCUMENT","ColourMode":"ICM_COLOUR"}]}'
				);
			} else if (value === 1) {
				await DDN.initRuntimeSettingsFromString(
					'{"GlobalParameter":{"Name":"GP","MaxTotalImageDimension":0},"ImageParameterArray":[{"Name":"IP-1","NormalizerParameterName":"NP-1","BaseImageParameterName":""}],"NormalizerParameterArray":[{"Name":"NP-1","ContentType":"CT_DOCUMENT","ColourMode":"ICM_GRAYSCALE"}]}'
				);
			} else {
				await DDN.initRuntimeSettingsFromString(
					'{"GlobalParameter":{"Name":"GP","MaxTotalImageDimension":0},"ImageParameterArray":[{"Name":"IP-1","NormalizerParameterName":"NP-1","BaseImageParameterName":""}],"NormalizerParameterArray":[{"Name":"NP-1","ContentType":"CT_DOCUMENT","ColourMode":"ICM_BINARY"}]}'
				);
			}
			let points = route.params.points;
			let detectionResult: DetectedQuadResult = {
				confidenceAsDocumentBoundary: 90,
				location: {
					points: [points[0], points[1], points[2], points[3]],
				},
			};
			let photoPath = route.params.photoPath;
			let normalizedImageResult = await DDN.normalizeFile(photoPath, detectionResult.location, {
				saveNormalizationResultAsFile: true,
			});
			const id = await AsyncStorage.getItem('account');
			const {data} = await api.getSearch(id);

			if (normalizedImageResult.imageURL) {
				normalizedResult[value] = normalizedImageResult.imageURL;
				setNormalizedImagePath(normalizedImageResult.imageURL);
				const UpImages = await AsyncStorage.setItem('image', normalizedImageResult.imageURL);
				if (GetType === 'face') {
					const UpImages = await api.postUploadImage('file://' + normalizedImageResult.imageURL, 1, data[0]?.people_id);
					return UpImages;
				}
				if (GetType === 'passport') {
					const UpImages = await api.postUploadImage('file://' + normalizedImageResult.imageURL, 2, data[0]?.people_id);
					return UpImages;
				}
				if (GetType === 'visa') {
					const UpImages = await api.postUploadImage('file://' + normalizedImageResult.imageURL, 3, data[0]?.people_id);
					return UpImages;
				}
				if (GetType === 'visa2') {
					const UpImages = await api.postUploadImage('file://' + normalizedImageResult.imageURL, 7, data[0]?.people_id);
					return UpImages;
				}
				if (GetType === 'request') {
					const UpImages = await api.postUploadImage('file://' + normalizedImageResult.imageURL, 4, data[0]?.people_id);
					return UpImages;
				}
				if (GetType === 'secure') {
					const UpImages = await api.postUploadImage('file://' + normalizedImageResult.imageURL, 5, data[0]?.people_id);
					return UpImages;
				}
				if (GetType === 'health') {
					const UpImages = await api.postUploadImage('file://' + normalizedImageResult.imageURL, 6, data[0]?.people_id);

					return UpImages;
				}
				// navigation.navigate('detail');

				return UpImages;
			}
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{normalizedImagePath && (
				<View style={styles.imageBorder}>
					<Image style={[StyleSheet.absoluteFill, styles.image]} source={{uri: 'file://' + normalizedImagePath}} />
				</View>
			)}
			<View
				style={{
					// width: '50%',
					height: '30%',
					position: 'absolute',
					top: 0,
					zIndex: 999,
				}}
			>
				<TouchableOpacity style={{flex: 0.5}}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={{...styles.button, backgroundColor: 'grey'}}>
						<Text style={{fontSize: 15, color: 'white', alignSelf: 'center'}}>ย้อนกลับ</Text>
					</TouchableOpacity>
				</TouchableOpacity>
			</View>
			<View style={styles.control}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={share} style={styles.buttonOut}>
						<Text style={{fontSize: 15, color: 'black', alignSelf: 'center'}}>แชร์</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.radioContainer}>
					<RadioForm
						radio_props={radio_props}
						initial={0}
						formHorizontal={true}
						labelHorizontal={false}
						onPress={value => {
							normalize(value);
						}}
					/>
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={() => navigation.navigate('detail', {props: 'result'})} style={styles.button}>
						<Text style={{fontSize: 15, color: 'white', alignSelf: 'center'}}>บันทึก</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	control: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		height: '100%',
		width: '100%',
		alignSelf: 'flex-start',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
	},
	radioContainer: {
		// flex: 1,
		padding: 5,
		margin: 3,
	},
	buttonContainer: {
		padding: 5,
		margin: 3,
	},
	button: {
		backgroundColor: '#2F8DE4',
		borderRadius: 15,
		padding: 8,
		margin: 5,
	},
	buttonOut: {
		backgroundColor: 'ghostwhite',
		borderRadius: 15,
		padding: 8,
		margin: 5,
	},
	image: {
		resizeMode: 'contain',
		// width: windowWidth / 1.3,
		margin: 40,
		alignSelf: 'center',
	},
	imageBorder: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default ResultViewerScreen;
