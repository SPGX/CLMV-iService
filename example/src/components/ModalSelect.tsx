import {Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {styles} from '../templates/theme';
import React, {FunctionComponent} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// export default function Modal({
//   cancel,
//   handleSelectCam,
//   handleScan,
//   handleClose,
// }) {

export type IModalSelect = {
	cancel?: () => void;
	handleSelectCam?: () => void;
	handleScan?: () => void;
	handleClose?: () => void;
};

const ModalSelect: FunctionComponent<IModalSelect> = ({cancel, handleSelectCam, handleScan, handleClose}) => {
	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;

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
						onPress={cancel}
						activeOpacity={1}
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0,0,0,0.3)',
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
								<TouchableOpacity style={styles.IconClose} onPress={handleClose}>
									<Icon name='close' size={30} color='#4F8EF7' />
								</TouchableOpacity>
								<Text style={styles.TextCamera}>อัพโหลด</Text>
								<View style={styles.partCamera}>
									<TouchableOpacity onPress={handleSelectCam} style={{flexDirection: 'column', alignItems: 'center'}}>
										<Icon name='camera' size={30} color='#4F8EF7' />
										<Text style={styles.TextCamera}>ถ่ายรูป</Text>
									</TouchableOpacity>

									<TouchableOpacity onPress={handleScan} style={{flexDirection: 'column', alignItems: 'center'}}>
										<MaterialCommunityIcons name='cube-scan' size={30} color='#4F8EF7' />
										<Text style={styles.TextCamera}>สแกนรูป</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

export default ModalSelect;
