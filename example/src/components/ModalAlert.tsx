import {Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {styles} from '../templates/theme';
import LottieView from 'lottie-react-native';
import React, {FunctionComponent, useRef, useEffect} from 'react';

// export default function ModalImage({ text }) {
export type IModal = {
	text?: string;
};

const ModalAlert: FunctionComponent<IModal> = ({text}) => {
	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;

	const lottieRef = useRef<LottieView>(null);

	useEffect(() => {
		if (lottieRef.current) {
			setTimeout(() => {
				lottieRef.current?.reset();
				lottieRef.current?.play();
			}, 100);
		}
	}, [lottieRef.current]);

	return (
		<>
			<View style={styles.FlexCamera}>
				<View
					style={{
						height: windowHeight,
						width: windowWidth,
						position: 'relative',
					}}
				>
					<TouchableOpacity
						activeOpacity={1}
						style={{
							width: windowWidth,
							height: '100%',
							// backgroundColor: 'rgba(0,0,0,0.3)',
						}}
					>
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								position: 'relative',
							}}
						>
							<View style={styles.borderCamera}>
								<View
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										flex: 1,
									}}
								>
									<LottieView
										ref={lottieRef}
										autoPlay
										style={{
											width: 100,
											height: 100,
											backgroundColor: 'transparent',
										}}
										source={require('../assets/animation/warning.json')}
									/>
									<Text
										style={{
											fontFamily: 'Kanit-Regular',
											fontSize: 13,
											padding: 10,
											textAlign: 'center',
										}}
									>
										{text}
									</Text>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

export default ModalAlert;
