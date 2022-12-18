import React, {useState, useEffect, useRef} from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image,
	RefreshControl,
	Platform,
	Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../../templates/theme';
import Modal from '../../components/Modal';
import ModalImage from '../../components/ModalImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import { RNCamera } from 'react-native-camera';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {replaceBackground} from 'react-native-image-selfie-segmentation';

interface Home {
	resolve: () => void;
	useCameraDevices: () => void;
}

export default function Home() {
	const navigation = useNavigation<any>();
	//Images
	const [imageFace, setImageFace] = useState<any>(null); //1
	const [closeCamera, setCloseCamera] = useState(false);
	const [, setStartCamera] = useState(false);
	const [, setPart] = useState(null);
	const [imagePassport, setImagePassport] = useState<any>(null); // 2
	const [imageHealth, setImageHealth] = useState<any>(null); // 6
	const [imageSecure, setImageSecure] = useState<any>(null); // 5
	const [imageVisa, setImageVisa] = useState<any>(null); // 3
	const [imageRequest, setImageRequest] = useState<any>(null); // 4

	const windowHeight = Dimensions.get('window').height;
	const windowWidth = Dimensions.get('window').width;
	const [refreshing, setRefreshing] = useState(false);
	const [exImg, setExImg] = useState<any>(null);
	const [, setDAccount] = useState<any>([]);
	const [account, setAccount] = useState<any>(null);
	const [cam, setCam] = useState<any>();
	const [opencam, setOpenCam] = useState<boolean>(true);
	const [switch_c, setSwitch_c] = useState<boolean>(true);
	const [, setAvatarSource] = useState<any>(null);
	const camera = useRef<Camera>(null);
	const devices = useCameraDevices();

	const [image, setImage] = useState();
	const [backgroundImage] = useState(
		'https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg'
	);
	const isFocused = useIsFocused();

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getDataAccount();

		wait(2000).then(() => {
			setRefreshing(false);
		});
	}, []);

	const wait = (timeout: number | undefined) => {
		return new Promise((resolve: any) => setTimeout(resolve, timeout));
	};

	useEffect(() => {
		getDataAccount();
	}, []);

	const getDataAccount = async () => {
		setRefreshing(true);
		try {
			const id: string | null = await AsyncStorage.getItem('account');
			if (!id) {
				return Alert.alert('แจ้งเตือน', 'ไม่พบไอดีผู้ใช้งาน');
			}

			const {data} = await api.getSearch(id);
			console.log('data', data[0].img);
			if (data?.length === 0) return setRefreshing(false);
			await setFormatImage(data[0].img);
			await setAccount(data[0]);
			setRefreshing(false);
		} catch (error) {
			console.log('error', error);
			setRefreshing(false);
			// Alert.alert('แจ้งเตือน', 'เกิดข้อผิดพลาด');
		}
	};

	const setFormatImage = async (images: any[]) => {
		setImageFace(null);
		setImagePassport(null);
		setImageRequest(null);
		setImageVisa(null);
		setImageHealth(null);
		setImageSecure(null);
		for (const img of images) {
			const {pic_no, url} = img;
			console.log('url', url);
			if (pic_no === 1) {
				setImageFace(url);
			}
			if (pic_no === 2) {
				setImagePassport(url);
			}
			if (pic_no === 3) {
				setImageVisa(url);
			}
			if (pic_no === 4) {
				setImageRequest(url);
			}
			if (pic_no === 5) {
				setImageSecure(url);
			}
			if (pic_no === 6) {
				setImageHealth(url);
			}
		}
	};

	const handleRemove = async (v: any) => {
		if (v === 'face') {
			setCloseCamera(false);
		}
	};

	const handleImage = (v: any) => {
		setCloseCamera(false);
		ImagePicker.openPicker({
			width: 800,
			height: 1000,
			cropping: false,
		}).then(async image => {
			if (v === 'face') {
				const data = await api.postUploadImage(image?.path, 1, account?.id);
				getDataAccount();
				return data;
			}
			if (v === 'passport') {
				const data = await api.postUploadImage(image?.path, 2, account?.id);
				getDataAccount();
				return data;
			}
			if (v === 'visa') {
				const data = await api.postUploadImage(image?.path, 3, account?.id);
				getDataAccount();
				return data;
			}
			if (v === 'request') {
				const data = await api.postUploadImage(image?.path, 4, account?.id);
				getDataAccount();
				return data;
			}
			if (v === 'secure') {
				const data = await api.postUploadImage(image?.path, 5, account?.id);
				getDataAccount();
				return data;
			}
			if (v === 'health') {
				const data = await api.postUploadImage(image?.path, 6, account?.id);
				getDataAccount();
				return data;
			}
		});
	};

	const handleSave = async () => {
		console.log('handleSave');
		if (camera) {
			setOpenCam(true);
		}
	};

	const handleCap = async () => {
		if (camera) {
			const photo = await camera?.current?.takePhoto();
			setCam('file://' + photo?.path);
			// setImageFace('file://' + photo?.path);
			// await AsyncStorage.setItem('image_face', 'file://' + photo?.path);
			onProcessImageHandler('file://' + photo?.path);
		}
	};

	const onProcessImageHandler = async (data: any) => {
		console.log('data DADASDA', data);
		if (data && backgroundImage) {
			await replaceBackground(data, backgroundImage, 2000)
				.then(async (response: any) => {
					console.log('response >>>', response);
					const data = await api.postUploadImage(response, 1, account?.id);
					getDataAccount();
					console.log('data FaCE>>', data);
					return data;
				})
				.catch(error => {
					console.log(error);
				});
		}
	};

	const handleCamera = (_v: any) => {
		setCam(null);
		setCloseCamera(false);
		setOpenCam(false);
	};

	// const pickImageFace = async () => {
	// if (await AsyncStorage.getItem('image_face')) {
	// const data = await AsyncStorage.getItem('image_face');
	// setImageFace(data);
	// }
	// };

	const pickImagePassport = async () => {
		if (await AsyncStorage.getItem('image_passport')) {
			const data = await AsyncStorage.getItem('image_passport');
			setImagePassport(data);
		}
	};

	const pickImageVisa = async () => {
		if (await AsyncStorage.getItem('image_visa')) {
			const data = await AsyncStorage.getItem('image_visa');
			setImageVisa(data);
		}
	};

	const pickImageRequest = async () => {
		if (await AsyncStorage.getItem('image_request')) {
			const data = await AsyncStorage.getItem('image_request');
			setImageRequest(data);
		}
	};

	const pickImageSecure = async () => {
		if (await AsyncStorage.getItem('image_secure')) {
			const data = await AsyncStorage.getItem('image_secure');
			setImageSecure(data);
		}
	};

	const pickImageHealth = async () => {
		if (await AsyncStorage.getItem('image_health')) {
			const data = await AsyncStorage.getItem('image_health');
			setImageHealth(data);
		}
	};

	const handleฺBack = async () => navigation.goBack();

	const handleOpenCamera = async (v: any) => {
		if (v === 'face') {
			// pickImageFace();
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'passport') {
			// pickImagePassport();
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'visa') {
			// pickImageVisa();
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'request') {
			// pickImageRequest();
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'secure') {
			// pickImageSecure();
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'health') {
			// pickImageHealth();
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
	};

	const handleCloseCamera = () => {
		setCloseCamera(false);
		setExImg(null);
	};

	const handleUpload = async (v: any) => {
		setCloseCamera(true);
		if (v === 'face') {
			// pickImageFace();
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'passport') {
			// pickImagePassport();
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'visa') {
			// pickImageVisa();
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'request') {
			// pickImageRequest();
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'secure') {
			// pickImageSecure();
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'health') {
			// pickImageHealth();
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		setPart(v);
	};

	const handleDelete = async (v: any) => {
		if (v === 'face') {
			const data = await api.postUploadImage('', 1, account?.id);
			getDataAccount();
			return data;
		}
		if (v === 'passport') {
			const data = await api.postUploadImage('', 2, account?.id);
			getDataAccount();
			return data;
		}
		if (v === 'visa') {
			const data = await api.postUploadImage('', 3, account?.id);
			getDataAccount();
			return data;
		}
		if (v === 'request') {
			const data = await api.postUploadImage('', 4, account?.id);
			getDataAccount();
			return data;
		}
		if (v === 'secure') {
			const data = await api.postUploadImage('', 5, account?.id);
			getDataAccount();
			return data;
		}
		if (v === 'health') {
			const data = await api.postUploadImage('', 6, account?.id);
			getDataAccount();
			return data;
		}
	};

	const handleReset = () => {
		setCam(null);
	};

	const DocumentCamera = (Name: any, Color: string, onPress: any) => {
		return (
			<TouchableOpacity activeOpacity={1} onPress={() => (Color ? setExImg(Color) : {})} style={styles.new_border}>
				<View style={styles.new_b_doc}>
					<View style={{flexDirection: 'column'}}>
						<Text style={styles.new_b_text_1}>{Name}</Text>
						<View style={{width: '100%'}}>
							<Text
								numberOfLines={1}
								style={{
									fontFamily: 'Kanit-Regular',
									fontSize: 12,
									color: Color ? 'green' : 'red',
									maxWidth: Color ? '70%' : '100%',
								}}
							>
								{Color ? Color : 'ยังไม่ได้อัพโหลด'}
							</Text>
						</View>
					</View>
					<View style={styles.new_icon}>
						{Color ? (
							<>
								<TouchableOpacity
									onPress={() => handleOpenCamera(onPress)}
									style={{...styles.iconFile, marginRight: 2}}
								>
									<Icon name='camera' size={20} color='#fff' />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => handleImage(onPress)} style={styles.iconFile}>
									<AntDesign name='picture' size={20} color='#fff' />
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleDelete(onPress)}
									style={{
										...styles.iconFile,
										backgroundColor: 'rgba(255,0,0,0.7)',
										marginLeft: 2,
									}}
								>
									<FontAwesome name='trash' size={20} color='#fff' />
								</TouchableOpacity>
							</>
						) : (
							<>
								<TouchableOpacity
									onPress={() => handleOpenCamera(onPress)}
									style={{...styles.iconFile, marginRight: 2}}
								>
									<Icon name='camera' size={20} color='#fff' />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => handleImage(onPress)} style={styles.iconFile}>
									<AntDesign name='picture' size={20} color='#fff' />
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<>
			{closeCamera && (
				<Modal
					handleCamera={() => handleCamera('face')}
					handleGallery={() => handleImage('face')}
					// handleGallery={() => Alert.alert('แจ้งเตือน', 'รออัพเดท...')}
					handleClose={handleCloseCamera}
					handleDelete={() => handleRemove('face')}
					cancel={undefined}
					Check={imageFace}
				/>
			)}

			{exImg && <ModalImage getImage={exImg} handleClose={handleCloseCamera} cancel={undefined} />}

			{opencam ? (
				<ScrollView
					style={{height: '100%', position: 'relative'}}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				>
					<View
						style={{
							flexDirection: 'column',
							height: '100%',
							// paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
						}}
					>
						<View
							style={{
								flex: 0.3,
								height: Platform.OS === 'ios' ? windowHeight / 5 : windowHeight / 6,
								backgroundColor: '#4399DB',
							}}
						>
							<TouchableOpacity
								onPress={handleฺBack}
								style={{
									position: 'absolute',
									width: 'auto',
									height: 30,
									left: 10,
									top: Platform.OS === 'android' ? 20 : 40,
									flexDirection: 'row',
								}}
							>
								<Icon name='chevron-back' size={20} color='#fff' />
								<Text style={{fontFamily: 'Kanit-Bold', color: '#fff'}}>ย้อนกลับ</Text>
							</TouchableOpacity>
						</View>

						<View style={{flex: 5}}>
							<View
								style={{
									backgroundColor: 'transparent',
									height: 140,
									position: 'relative',
									alignItems: 'center',
								}}
							>
								<View style={styles.borderTop}>
									<View
										style={{
											flexDirection: 'row',
											flex: 1,
										}}
									>
										<View
											style={{
												flex: 0.5,
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<TouchableOpacity
												onPress={() => handleUpload('face')}
												style={{
													borderRadius: 10,
													width: '90%',
													height: '90%',
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: imageFace ? 'transparent' : 'grey',
												}}
											>
												{imageFace ? (
													<Image
														resizeMode='contain'
														source={{uri: imageFace}}
														style={{width: '100%', height: '100%'}}
													/>
												) : (
													<>
														<AntDesign name='plus' size={50} color='#fff' />
														<Text style={{...styles.TextF, color: '#fff'}}>โปรดอัพโหลดรูปหน้าตรง</Text>
													</>
												)}
											</TouchableOpacity>
										</View>
										<View style={{flex: 0.5}}>
											<View>
												<Text style={styles.TextF}>เลขประจำตัวคนต่างด้าว</Text>
												<Text style={styles.TextS}>{account?.people_id}</Text>
												<Text style={styles.TextF}>เลขที่คำขอ</Text>
												<Text style={styles.TextS}>{account?.wp_rn_no}</Text>
												<Text style={styles.TextF}>ชื่อ-นามสกุล</Text>
												<Text style={styles.TextS}>{account?.full_name_en}</Text>
												<Text style={styles.TextF}>ประเภทงาน</Text>
												<Text style={styles.TextS}>{account?.wp_type_th}</Text>
											</View>
										</View>
									</View>
								</View>
							</View>
						</View>

						<View
							style={{
								height: '100%',
								alignItems: 'flex-start',
								paddingBottom: 30,
							}}
						>
							{/* <Image resizeMode='contain' source={{uri: image}} style={{width: '50%', height: '50%'}} /> */}
							<TouchableOpacity style={styles.bgTitle}>
								<Text style={styles.textBlue}>เอกสารสำคัญ</Text>
							</TouchableOpacity>
							{DocumentCamera('รูป Passport', imagePassport, 'passport')}
							{DocumentCamera('รูป VISA', imageVisa, 'visa')}
							{DocumentCamera('หนังสือรับรองการจ้าง(บต.46)', imageRequest, 'request')}
							{DocumentCamera('ใบเสร็จรับเงินประกันสังคมเดือนล่าสุด', imageSecure, 'secure')}
							{DocumentCamera('บัตรประกันสุขภาพ/ใบเสร็จจาก รพ.ของรัฐ', imageHealth, 'health')}
						</View>
					</View>
				</ScrollView>
			) : (
				<View style={{flex: 1, justifyContent: 'center', backgroundColor: '#000'}}>
					<View
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							backgroundColor: '#000',
							width: '100%',
							height: '10%',
							zIndex: 99,
						}}
					>
						<TouchableOpacity
							onPress={() => setOpenCam(true)}
							style={{
								backgroundColor: 'rgba(255,255,255,0.4)',
								alignSelf: 'flex-start',
								padding: 10,
								borderRadius: 10,
								marginTop: 20,
								marginLeft: 10,
								zIndex: 5,
							}}
						>
							<Text style={{color: '#fff', fontFamily: 'Kanit-Bold'}}>ย้อนกลับ</Text>
						</TouchableOpacity>
					</View>
					{!cam ? (
						<>
							<Camera
								ref={camera}
								style={{
									width: 'auto',
									height: '60%',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'relative',
								}}
								photo={true}
								device={switch_c ? devices.front : devices.back}
								isActive={true}
							/>
							{/* <RNCamera
                ref={cameraRef}
                captureAudio={false}
                type={
                  switch_c
                    ? RNCamera.Constants.Type.front
                    : RNCamera.Constants.Type.back
                }
                style={{
                  width: 'auto',
                  height: '60%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    position: 'absolute',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={require('../../assets/images/frame.png')}
                    style={{
                      width: windowWidth,
                      height: windowHeight,
                      zIndex: 0,
                      // backgroundColor: 'red',
                    }}
                  />
                </View>
              </RNCamera> */}
							<View
								style={{
									position: 'absolute',
									bottom: 0,
									backgroundColor: '#000',
									width: '100%',
									height: '15%',
									justifyContent: 'space-around',
									alignItems: 'center',
									flexDirection: 'row',
								}}
							>
								<View
									style={{
										width: 80,
										height: 80,
										borderRadius: 50,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								/>
								<TouchableOpacity
									onPress={() => handleCap()}
									style={{
										backgroundColor: 'rgba(255,255,255,0.5)',
										width: 80,
										height: 80,
										borderRadius: 50,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<View
										style={{
											backgroundColor: '#fff',
											width: 60,
											height: 60,
											borderRadius: 50,
										}}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setSwitch_c(!switch_c)}
									style={{
										backgroundColor: 'rgba(255,255,255,0.1)',
										width: 80,
										height: 80,
										borderRadius: 50,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Icon name='ios-camera-reverse-outline' size={40} color='#fff' />
								</TouchableOpacity>
							</View>
						</>
					) : (
						// <View>
						//   <Text>Test</Text>
						// </View>
						<>
							<View
								style={{
									width: 'auto',
									height: '80%',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'relative',
								}}
							>
								<Image
									resizeMode='contain'
									source={{uri: 'file://' + cam}}
									style={{
										width: windowWidth,
										height: windowHeight,
										zIndex: 0,
										// backgroundColor: 'red',
									}}
								/>
							</View>
							<View
								style={{
									position: 'absolute',
									bottom: 0,
									backgroundColor: '#000',
									width: '100%',
									height: '15%',
									justifyContent: 'space-around',
									alignItems: 'center',
									flexDirection: 'row',
								}}
							>
								<TouchableOpacity
									onPress={() => handleReset()}
									style={{
										backgroundColor: 'rgba(255,255,255,0.5)',
										width: 80,
										padding: 10,
										borderRadius: 10,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Text style={{color: '#fff', fontFamily: 'Kanit-Bold'}}>ถ่ายใหม่</Text>
								</TouchableOpacity>
								<View
									style={{
										width: 80,
										height: 80,
										borderRadius: 50,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								/>

								<TouchableOpacity
									onPress={() => handleSave()}
									style={{
										backgroundColor: 'rgba(41, 214, 71, 0.8)',
										width: 80,
										padding: 10,
										borderRadius: 10,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Text style={{color: '#fff', fontFamily: 'Kanit-Bold'}}>บันทึก</Text>
								</TouchableOpacity>
							</View>
						</>
					)}
				</View>
			)}
		</>
	);
}
