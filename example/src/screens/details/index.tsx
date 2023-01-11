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
	// BackHandler,
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
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {replaceBackground} from 'react-native-image-selfie-segmentation';
import ModalWait from '../../components/ModalWait';
import ModalSelect from '../../components/ModalSelect';

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
	const [imageVisa2, setImageVisa2] = useState<any>(null); // 7
	const [test, setTest] = useState<any>(null); // 7

	const windowHeight = Dimensions.get('window').height;
	const windowWidth = Dimensions.get('window').width;
	const [refreshing, setRefreshing] = useState(false);
	const [exImg, setExImg] = useState<any>(null);
	const [account, setAccount] = useState<any>(null);
	const [cam, setCam] = useState<any>();
	const [opencam, setOpenCam] = useState<boolean>(true);
	const [switch_c, setSwitch_c] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [editcamera, setEditCamera] = useState<boolean>(false);
	const [editcam, setEditCam] = useState<any>(null);
	const camera = useRef<Camera>(null);
	const devices = useCameraDevices('wide-angle-camera');

	const [backgroundImage] = useState('https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg');

	useEffect(() => {
		getDataAccount();
	}, []);

	// useEffect(() => {
	// 	const onBackPress = () => {
	// 		return false;
	// 	};
	// 	BackHandler.addEventListener('hardwareBackPress', onBackPress);

	// 	return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
	// }, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getDataAccount();
			setRefreshing(true);
			wait(500).then(() => {
				setRefreshing(false);
			});
		});
		return () => {
			unsubscribe;
		};
	}, []);

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

	const getDataAccount = async () => {
		setRefreshing(true);
		await Camera.getCameraPermissionStatus();
		await Camera.getMicrophonePermissionStatus();
		setImageFace(null);
		setImageVisa(null);
		setImageVisa2(null);
		setImagePassport(null);
		setImageRequest(null);
		setImageSecure(null);
		setImageHealth(null);
		wait(500).then(async () => {
			try {
				const id: string | null = await AsyncStorage.getItem('account');
				if (!id) {
					return Alert.alert('แจ้งเตือน', 'ไม่พบไอดีผู้ใช้งาน');
				}

				const {data} = await api.getSearch(id);

				if (data?.length === 0) return setRefreshing(false);
				if (data[0]?.img !== null) {
					await setFormatImage(data[0].img);
				}
				await setAccount(data[0]);
			} catch (error) {
				console.log('error >>>>>>>>>>>>', error);
				// Alert.alert('แจ้งเตือน', 'เกิดข้อผิดพลาด');
			}
			setRefreshing(false);
		});
	};

	const setFormatImage = async (images: any[]) => {
		for (const img of images) {
			const {pic_no, url} = img;
			if (pic_no === 1) setImageFace(url);
			if (pic_no === 2) setImagePassport(url);
			if (pic_no === 3) setImageVisa(url);
			if (pic_no === 4) setImageRequest(url);
			if (pic_no === 5) setImageSecure(url);
			if (pic_no === 6) setImageHealth(url);
			if (pic_no === 7) setImageVisa2(url);
		}
	};

	const handleRemove = async (v: string) => {
		if (v === 'face') {
			const data = await api.postUploadImage(null, 1, account?.people_id);
			getDataAccount();
			setCloseCamera(false);
			return data;
		}
	};

	const handleImage = (v: string) => {
		setCloseCamera(false);
		ImagePicker.openPicker({
			width: 800,
			height: 1000,
			cropping: false,
		}).then(async image => {
			console.log('image ===>', image);
			if (v === 'face') {
				const data = await api.postUploadImage(image?.path, 1, account?.people_id);
				getDataAccount();
				return data;
			}
			if (v === 'passport') {
				const data = await api.postUploadImage(image?.path, 2, account?.people_id);
				getDataAccount();
				return data;
			}
			if (v === 'visa') {
				const data = await api.postUploadImage(image?.path, 3, account?.people_id);
				getDataAccount();
				return data;
			}
			if (v === 'visa2') {
				const data = await api.postUploadImage(image?.path, 7, account?.people_id);
				getDataAccount();
				return data;
			}
			if (v === 'request') {
				const data = await api.postUploadImage(image?.path, 4, account?.people_id);
				getDataAccount();
				return data;
			}
			if (v === 'secure') {
				const data = await api.postUploadImage(image?.path, 5, account?.people_id);
				getDataAccount();
				return data;
			}
			if (v === 'health') {
				const data = await api.postUploadImage(image?.path, 6, account?.people_id);
				getDataAccount();
				return data;
			}
		});
	};

	const handleSave = async () => {
		if (camera) {
			setOpenCam(true);
			getDataAccount();
		}
	};

	const handleCap = async () => {
		if (camera) {
			const photo = await camera?.current?.takePhoto();
			console.log('photo >>>', photo?.path);
			setCam('file://' + photo?.path);
			let cap = 'file://' + photo?.path;
			onProcessImageHandler(cap);
		}
	};

	const onProcessImageHandler = async (data: string) => {
		// console.log('onProcessImageHandler >>', data);
		if (data) {
			await replaceBackground(data, backgroundImage, 1000)
				.then((response: any) => {
					console.log('if response', response);
					setTest(response);
					ProfileImages(response);
					setLoading(true);
					setTimeout(async () => {
						setLoading(false);
					}, 1000);
				})
				.catch((error: string) => {
					console.log('errorerror>>', error);
				});
		}
	};

	const ProfileImages = async (response: any) => {
		console.log('==================================================================');
		// console.log('response ------->', response);
		const posts: any = await api.postUploadImage(response, 1, account?.people_id);
		if (posts?.data?.status) {
			const data = posts?.data?.data?.url;
			console.log('resProfile >>', posts?.data);
			setTest(data);
			setLoading(true);
			setTimeout(async () => {
				setLoading(false);
			}, 1000);
			getDataAccount();
		} else {
			console.log('------------------------------ ELSE ------------------------------');
			ProfileImages(response);
			return;
		}
	};

	const handleCamera = (_v: string) => {
		setCam(null);
		setCloseCamera(false);
		setOpenCam(false);
	};

	const handleSelectCam = (v: any) => {
		console.log('V ->', v);
		ImagePicker.openCamera({
			width: 800,
			height: 1000,
			cropping: true,
		}).then(async (image: any) => {
			console.log('image ===>', image.path);
			if (v === 'face') {
				const data = await api.postUploadImage(image?.path, 1, account?.people_id);
				getDataAccount();
				console.log('data>>>>>', data.data.data);
				return data;
			}
			if (v === 'passport') {
				const data = await api.postUploadImage(image?.path, 2, account?.people_id);
				getDataAccount();
				console.log('data>>>>>', data.data);
				return data;
			}
			if (v === 'visa') {
				const data = await api.postUploadImage(image?.path, 3, account?.people_id);
				getDataAccount();
				console.log('data>>>>>', data.data);
				return data;
			}
			if (v === 'visa2') {
				const data = await api.postUploadImage(image?.path, 7, account?.people_id);
				getDataAccount();
				console.log('data>>>>>', data.data);
				return data;
			}
			if (v === 'request') {
				const data = await api.postUploadImage(image?.path, 4, account?.people_id);
				getDataAccount();
				console.log('data>>>>>', data.data);
				return data;
			}
			if (v === 'secure') {
				const data = await api.postUploadImage(image?.path, 5, account?.people_id);
				getDataAccount();
				console.log('data>>>>>', data.data);
				return data;
			}
			if (v === 'health') {
				const data = await api.postUploadImage(image?.path, 6, account?.people_id);
				getDataAccount();
				console.log('data>>>>>', data.data);
				return data;
			}
		});
		setEditCamera(false);
	};

	const handleSelectScan = () => {
		handleOpenCamera(editcam);
		setEditCamera(false);
	};

	const handleฺBack = async () => navigation.goBack();

	const handleOpenCamera = async (v: string) => {
		if (v === 'face') {
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'passport') {
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'visa') {
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'visa2') {
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'request') {
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'secure') {
			const data = await AsyncStorage.setItem('cameraType', v);
			navigation.navigate('Scanner');
			setStartCamera(true);
			setCloseCamera(false);
			return data;
		}
		if (v === 'health') {
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
		setEditCamera(false);
	};

	const handleSelectCamera = async (v: any) => {
		if (v === 'face') {
			const data = await AsyncStorage.setItem('cameraType', v);
			setEditCamera(v);
			setEditCam(v);
			return data;
		}
		if (v === 'passport') {
			const data = await AsyncStorage.setItem('cameraType', v);
			setEditCamera(v);
			setEditCam(v);
			return data;
		}
		if (v === 'visa') {
			const data = await AsyncStorage.setItem('cameraType', v);
			setEditCamera(v);
			setEditCam(v);
			return data;
		}
		if (v === 'visa2') {
			const data = await AsyncStorage.setItem('cameraType', v);
			setEditCamera(v);
			setEditCam(v);
			return data;
		}
		if (v === 'request') {
			const data = await AsyncStorage.setItem('cameraType', v);
			setEditCamera(v);
			setEditCam(v);
			return data;
		}
		if (v === 'secure') {
			const data = await AsyncStorage.setItem('cameraType', v);
			setEditCamera(v);
			setEditCam(v);
			return data;
		}
		if (v === 'health') {
			const data = await AsyncStorage.setItem('cameraType', v);
			setEditCamera(v);
			setEditCam(v);
			return data;
		}
	};

	const handleUpload = async (v: any) => {
		setCloseCamera(true);
		if (v === 'face') {
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'passport') {
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'visa') {
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'visa2') {
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'request') {
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'secure') {
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		if (v === 'health') {
			const data = await AsyncStorage.setItem('cameraType', v);
			return data;
		}
		setPart(v);
	};

	const handleDelete = async (v: string) => {
		if (v === 'face') {
			const data = await api.postUploadImage(null, 1, account?.people_id);
			getDataAccount();
			return data;
		}
		if (v === 'passport') {
			const data = await api.postUploadImage(null, 2, account?.people_id);
			getDataAccount();
			return data;
		}
		if (v === 'visa') {
			const data = await api.postUploadImage(null, 3, account?.people_id);
			getDataAccount();
			return data;
		}
		if (v === 'visa2') {
			const data = await api.postUploadImage(null, 7, account?.people_id);
			getDataAccount();
			return data;
		}
		if (v === 'request') {
			const data = await api.postUploadImage(null, 4, account?.people_id);
			getDataAccount();
			return data;
		}
		if (v === 'secure') {
			const data = await api.postUploadImage(null, 5, account?.people_id);
			getDataAccount();
			return data;
		}
		if (v === 'health') {
			const data = await api.postUploadImage(null, 6, account?.people_id);
			getDataAccount();
			return data;
		}
	};

	const handleReset = () => {
		setCam(null);
	};

	const Check = async (onPress: string) => {
		getDataAccount();
		if (onPress === 'face') setExImg(imageFace);
		if (onPress === 'passport') setExImg(imagePassport);
		if (onPress === 'visa') setExImg(imageVisa);
		if (onPress === 'visa2') setExImg(imageVisa2);
		if (onPress === 'request') setExImg(imageRequest);
		if (onPress === 'secure') setExImg(imageSecure);
		if (onPress === 'health') setExImg(imageHealth);
	};

	const DocumentCamera = (Name: any, Color: string, onPress: any) => {
		return (
			<TouchableOpacity activeOpacity={1} onPress={() => Check(onPress)} style={styles.new_border}>
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
									maxWidth: Color ? '100%' : '100%',
								}}
							>
								{Color
									? Color.split(`https://203.150.33.118:4585/oss_api/public/display/${account?.img[0]?.id}-`)
									: 'ยังไม่ได้อัพโหลด'}
							</Text>
						</View>
					</View>
					{/* <Image resizeMode='contain' source={{uri: imgcheck}} style={{width: 20, height: 20}} /> */}
					<View style={styles.new_icon}>
						{Color ? (
							<>
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
									onPress={() => handleSelectCamera(onPress)}
									// onPress={() => handleOpenCamera(onPress)}
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
			{refreshing && (
				<>
					<ModalWait text={'กำลังโหลดข้อมูล'} />
					<View
						style={{height: '100%', width: '100%', backgroundColor: 'transparent', zIndex: 999, position: 'absolute'}}
					/>
				</>
			)}
			{loading && (
				<>
					<ModalWait text={'กำลังประมวลผลภาพ'} />
					<View
						style={{height: '100%', width: '100%', backgroundColor: 'transparent', zIndex: 999, position: 'absolute'}}
					/>
				</>
			)}
			{closeCamera && (
				<Modal
					handleCamera={() => handleCamera('face')}
					handleGallery={() => handleImage('face')}
					handleClose={handleCloseCamera}
					handleDelete={() => handleRemove('face')}
					cancel={undefined}
					Check={imageFace}
				/>
			)}
			{editcamera && (
				<ModalSelect
					handleSelectCam={() => handleSelectCam(editcam)}
					handleScan={() => handleSelectScan()}
					handleClose={handleCloseCamera}
					cancel={undefined}
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
						}}
					>
						<View
							style={{
								flex: 0.3,
								height: Platform.OS === 'ios' ? windowHeight / 5 : windowHeight / 6,
								backgroundColor: '#4399DB',
							}}
						>
							<TouchableOpacity onPress={handleฺBack} style={styles.bBack}>
								<Icon name='chevron-back' size={20} color='#fff' />
								<Text style={{fontFamily: 'Kanit-Bold', color: '#fff'}}>กลับ</Text>
							</TouchableOpacity>
						</View>

						<View style={{flex: 5, paddingBottom: 30}}>
							<View style={styles.bBorderTop}>
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
													...styles.tFace,
													backgroundColor: imageFace ? 'transparent' : 'grey',
												}}
											>
												{imageFace ? (
													<Image resizeMode='cover' source={{uri: imageFace}} style={{width: '100%', height: '100%'}} />
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
							{/* <Image resizeMode='contain' source={{uri: test}} style={{width: 200, height: 200}} /> */}
							<TouchableOpacity activeOpacity={1} style={styles.bgTitle}>
								<Text style={styles.textBlue}>เอกสารสำคัญ</Text>
							</TouchableOpacity>
							{DocumentCamera('รูป Passport', imagePassport, 'passport')}
							{/* {DocumentCamera('รูป VISA', imageVisa, 'visa')} */}
							<TouchableOpacity activeOpacity={1} style={styles.new_border}>
								<View style={styles.new_b_doc}>
									<View style={{flexDirection: 'column'}}>
										<TouchableOpacity onPress={() => Check('visa')}>
											<Text style={styles.new_b_text_1}>รูป VISA</Text>
											<View style={{width: '100%'}}>
												<Text
													numberOfLines={1}
													style={{
														fontFamily: 'Kanit-Regular',
														fontSize: 12,
														color: imageVisa ? 'green' : 'red',
														maxWidth: imageVisa ? '100%' : '100%',
													}}
												>
													{imageVisa
														? imageVisa.split(
																`https://203.150.33.118:4585/oss_api/public/display/${account?.img[0]?.id}-`
														  )
														: 'ยังไม่ได้อัพโหลด'}
												</Text>
											</View>
										</TouchableOpacity>
										<TouchableOpacity onPress={() => Check('visa2')}>
											<Text style={styles.new_b_text_1}>รูป VISA 2</Text>
											<View style={{width: '100%'}}>
												<Text
													numberOfLines={1}
													style={{
														fontFamily: 'Kanit-Regular',
														fontSize: 12,
														color: imageVisa2 ? 'green' : 'red',
														maxWidth: imageVisa2 ? '100%' : '100%',
													}}
												>
													{imageVisa2
														? imageVisa2.split(
																`https://203.150.33.118:4585/oss_api/public/display/${account?.img[0]?.id}-`
														  )
														: 'ยังไม่ได้อัพโหลด'}
												</Text>
											</View>
										</TouchableOpacity>
									</View>
									{/* <Image resizeMode='contain' source={{uri: imgcheck}} style={{width: 20, height: 20}} /> */}
									<View style={{...styles.new_icon, flexDirection: 'column', alignItems: 'center'}}>
										{imageVisa ? (
											<View style={styles.borderImages}>
												<View
													style={{
														...styles.iconFile,
														marginLeft: 2,
														backgroundColor: 'transparent',
													}}
												/>
												<TouchableOpacity
													onPress={() => handleDelete('visa')}
													style={{
														...styles.iconFile,
														backgroundColor: 'rgba(255,0,0,0.7)',
														marginLeft: 2,
													}}
												>
													<FontAwesome name='trash' size={20} color='#fff' />
												</TouchableOpacity>
											</View>
										) : (
											<View style={styles.borderImages}>
												<TouchableOpacity
													onPress={() => handleSelectCamera('visa')}
													style={{...styles.iconFile, marginRight: 2}}
												>
													<Icon name='camera' size={20} color='#fff' />
												</TouchableOpacity>
												<TouchableOpacity onPress={() => handleImage('visa')} style={styles.iconFile}>
													<AntDesign name='picture' size={20} color='#fff' />
												</TouchableOpacity>
											</View>
										)}
										{imageVisa2 ? (
											<View style={styles.borderImages}>
												<View
													style={{
														...styles.iconFile,
														marginLeft: 2,
														backgroundColor: 'transparent',
													}}
												/>
												<TouchableOpacity
													onPress={() => handleDelete('visa2')}
													style={{
														...styles.iconFile,
														backgroundColor: 'rgba(255,0,0,0.7)',
														marginLeft: 2,
													}}
												>
													<FontAwesome name='trash' size={20} color='#fff' />
												</TouchableOpacity>
											</View>
										) : (
											<View style={{flexDirection: 'row', width: '100%', height: 'auto', alignItems: 'center'}}>
												<TouchableOpacity
													onPress={() => handleSelectCamera('visa2')}
													style={{...styles.iconFile, marginRight: 2}}
												>
													<Icon name='camera' size={20} color='#fff' />
												</TouchableOpacity>
												<TouchableOpacity onPress={() => handleImage('visa2')} style={styles.iconFile}>
													<AntDesign name='picture' size={20} color='#fff' />
												</TouchableOpacity>
											</View>
										)}
									</View>
								</View>
							</TouchableOpacity>
							{DocumentCamera('หนังสือรับรองการจ้าง(บต.46)', imageRequest, 'request')}
							{DocumentCamera('ใบเสร็จรับเงินประกันสังคมเดือนล่าสุด', imageSecure, 'secure')}
							{DocumentCamera('บัตรประกันสุขภาพ/ใบเสร็จจาก รพ.ของรัฐ', imageHealth, 'health')}
						</View>
					</View>
				</ScrollView>
			) : (
				<View style={{flex: 1, justifyContent: 'center', backgroundColor: '#000', position: 'relative'}}>
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
								device={switch_c ? devices?.front : devices?.back}
								isActive={true}
							/>
							<View style={styles.viewImg1}>
								<Image
									resizeMode='contain'
									source={require('../../assets/images/frame.png')}
									style={{
										width: windowWidth,
										height: windowHeight,
										zIndex: 0,
									}}
								/>
							</View>
							<View style={styles.viewImg2}>
								<View style={styles.viewImg3} />
								<TouchableOpacity onPress={() => handleCap()} style={styles.viewImg4}>
									<View style={styles.viewImg5} />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => setSwitch_c(!switch_c)} style={styles.switchT}>
									<Icon name='ios-camera-reverse-outline' size={40} color='#fff' />
								</TouchableOpacity>
							</View>
						</>
					) : (
						<>
							<View style={styles.viewBorder}>
								<Image
									resizeMode='contain'
									source={{uri: 'file://' + cam}}
									style={{
										width: windowWidth / 1,
										height: windowHeight,
										zIndex: 0,
									}}
								/>
							</View>
							<View style={styles.vTouch}>
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
