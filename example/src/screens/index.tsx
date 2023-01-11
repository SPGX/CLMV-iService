import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image,
	RefreshControl,
	Alert,
	Linking,
	BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../templates/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import api from '../api/api';
import {useIsFocused} from '@react-navigation/native';
import ModalAlert from '../components/ModalAlert';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ImagePicker from 'react-native-image-crop-picker';
import jpeg from 'jpeg-js';
import {Buffer} from 'buffer';
import jsQR from 'jsqr';
const PNG = require('pngjs/browser').PNG;

export type IHome = {
	ScannedImage: any;
};

export default function Home() {
	const navigation = useNavigation<any | null>();
	const [norequest, setNoRequest] = useState<any | null>(null);
	const [, setData] = useState<any | null>(null);
	const [account, setAccount] = useState<any>(null);

	const windowHeight = Dimensions.get('window').height;
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [imagePassport, setImagePassport] = useState<any>(null);
	const [imageHealth, setImageHealth] = useState<any>(null);
	const [imageSecure, setImageSecure] = useState<any>(null);
	const [imageVisa, setImageVisa] = useState<any>(null);
	const [imageRequest, setImageRequest] = useState<any>(null);
	const [imageFace, setImageFace] = useState<any>(null);
	const [imageVisa2, setImageVisa2] = useState<any>(null); // 7
	const [empty, setEmpty] = useState<boolean>(false);
	const [acc, setAcc] = useState<any>(null);
	const [on, setOn] = useState<Boolean>(false);
	const [waitB, setWaitB] = useState<Boolean>(false);
	const isFocused = useIsFocused();
	const [textQR, setTextQR] = useState<any>(null);
	const [QR, setQR] = useState<any>(null);

	const devices = useCameraDevices('wide-angle-camera');
	const device = devices.back;
	const [, setHasPermission] = useState<Boolean>(false);

	const lottieRef = useRef<LottieView>(null);

	useEffect(() => {
		if (lottieRef.current) {
			setTimeout(() => {
				lottieRef.current?.reset();
				lottieRef.current?.play();
			}, 100);
		}
	}, [lottieRef.current]);

	useEffect(() => {
		const onBackPress = () => {
			return true;
		};
		BackHandler.addEventListener('hardwareBackPress', onBackPress);

		return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
	}, []);

	const checkCameraPermission = async () => {
		const devices = await Camera.getAvailableCameraDevices();
		const status = await Camera.getCameraPermissionStatus();
		setHasPermission(status === 'authorized');
		return devices;
	};

	useEffect(() => {
		checkCameraPermission();
		getDataAccount();
		return () => {
			setNoRequest(null);
		};
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getSearch();
			setRefreshing(true);
			wait(500).then(async () => {
				setRefreshing(false);
				handleSearch(norequest);
			});
		});
		return () => {
			unsubscribe;
		};
	}, []);

	const getSearch = async () => {
		const data = await AsyncStorage.getItem('searchh');
		setNoRequest(data);
		handleSearch(data);
		return data;
	};

	useEffect(() => {
		return () => {
			setIsLoading(true);
			getDataAccount();
			wait(1000).then(() => {
				setRefreshing(false), setIsLoading(false);
			});
		};
	}, [isFocused]);

	useEffect(() => {
		requestCameraPermission();
	}, [on]);

	const requestCameraPermission = useCallback(async () => {
		const permisison = await Camera.requestCameraPermission();

		if (permisison === 'denied') await Linking.openSettings();
	}, []);

	const getDataAccount = async () => {
		if ((await Camera.requestCameraPermission()) !== 'authorized') {
			await Camera.requestCameraPermission();
			await Camera.requestMicrophonePermission();
		}

		setAccount(null);
		try {
			const id: string | null = acc;
			const {data} = await api.getSearch(id);
			if (data?.length === 0) return setRefreshing(false);
			if (data.img !== null) return await setFormatImage(data[0].img);
			await setAccount(data[0]);
		} catch (error) {
			console.log('error', error);
		}
	};

	const setFormatImage = async (images: any[]) => {
		setImageFace(null);
		setImagePassport(null);
		setImageRequest(null);
		setImageVisa(null);
		setImageVisa2(null);
		setImageHealth(null);
		setImageSecure(null);
		if (images === null) return;
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

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setIsLoading(true);
		wait(1000).then(() => {
			setRefreshing(false), setIsLoading(false);
		});
	}, []);

	const wait = (timeout: number | undefined) => {
		return new Promise((resolve: any) => setTimeout(resolve, timeout));
	};

	const handleLogout = async () => {
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('account');
		navigation.navigate('login');
		setData(null);
		setAccount(null);
		setImageFace(null);
		setImageVisa(null);
		setImagePassport(null);
		setImageRequest(null);
		setImageSecure(null);
		setImageHealth(null);
		setNoRequest(null);
		setImageVisa2(null);
	};

	const handleSearch = async (search: any) => {
		if (search) {
			setWaitB(true);
			wait(300).then(() => {
				setWaitB(false);
			});

			setAcc(search);
			setAccount(null);
			setImageFace(null);
			setImageVisa(null);
			setImageVisa2(null);
			setImagePassport(null);
			setImageRequest(null);
			setImageSecure(null);
			setImageHealth(null);
			const {data} = await api.getSearch(search);
			if (data?.length === 0) {
				Alert.alert('แจ้งเตือน', 'ไม่พบเลขประจำตัว หรือ เลขที่คำขอ');
				setRefreshing(false);
				return;
			}
			if (data[0]?.img !== null) {
				await setFormatImage(data[0].img);
			}
			await setAccount(data[0]);
			if (search) {
				await AsyncStorage.setItem('account', search);
			}

			if (data?.data?.length === 0) {
				setEmpty(true);
				setTimeout(() => {
					setEmpty(false);
				}, 2000);
				setAccount(null);
				return;
			}

			if (data?.data?.length > 0) {
				setAccount(data?.data[0]);
				checkStatus(data?.data);
				setIsLoading(true);
				setTimeout(() => {
					setIsLoading(false);
				}, 200);
			}
		} else {
			const data = await AsyncStorage.removeItem('searchh');
			setAcc(search);
			setAccount(null);
			setImageFace(null);
			setImageVisa(null);
			setImageVisa2(null);
			setImagePassport(null);
			setImageRequest(null);
			setImageSecure(null);
			setImageHealth(null);
			return data;
		}
	};

	const checkStatus = async (dataimg: any) => {
		const images = dataimg[0]?.img;
		for (const img of images) {
			const {pic_no, url} = img;
			if (pic_no === 1) setImageFace(url);
			if (pic_no === 2) setImagePassport(url);
			if (pic_no === 3) setImageVisa(url);
			if (pic_no === 7) setImageVisa2(url);
			if (pic_no === 4) setImageRequest(url);
			if (pic_no === 5) setImageSecure(url);
			if (pic_no === 6) setImageHealth(url);
		}
	};

	const handleSaveUsers = async () => {
		const data = await api.postSaveUsers(
			account?.full_name_en,
			account?.people_id,
			account?.wp_rn_no,
			account?.wp_type_th
		);
		return data;
	};

	const handleEdit = async () => {
		await AsyncStorage.setItem('searchh', norequest);
		navigation.navigate('detail');
		handleSaveUsers();
	};

	const handleQRCode = (e: any) => {
		setTextQR(e?.data);
		handleSearch(e?.data);
		setNoRequest(e?.data);
		setOn(false);
	};

	const handleScan = () => {
		setTextQR(null);
		setOn(true);
	};

	const handleImage = () => {
		ImagePicker.openPicker({
			width: 800,
			height: 1000,
			cropping: false,
			includeBase64: true,
		}).then(async (image: any) => {
			const base64Buffer = Buffer.from(image.data, 'base64');
			let pixelData: any;
			let imageBuffer: any;

			// Handle decoding based on different mimetypes
			if (image.mime === 'image/jpeg') {
				pixelData = jpeg.decode(base64Buffer, {useTArray: true}); // --> useTArray makes jpeg-js work on react-native without needing to nodeify it
				imageBuffer = pixelData.data;
			} else if (image.mime === 'image/png') {
				pixelData = PNG.sync.read(base64Buffer);
				imageBuffer = pixelData.data;
			} else {
				return;
			}

			const data = Uint8ClampedArray.from(imageBuffer);
			const code = jsQR(data, image.width, image.height);
			setOn(false);
			setNoRequest(code?.data);
			handleSearch(code?.data);
		});
	};

	const handleRemove = async () => {
		setNoRequest(null);
		await AsyncStorage.removeItem('searchh');
	};

	return (
		<>
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{on ? (
					<>
						<View style={{width: '100%', height: windowHeight, position: 'relative', flexDirection: 'column'}}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={() => setOn(false)}
								style={{position: 'absolute', width: 'auto', height: 30, left: 20, marginTop: 30}}
							>
								<View style={{backgroundColor: 'red', padding: 5, borderRadius: 10, paddingHorizontal: 10}}>
									<Text style={{fontFamily: 'Kanit-Bold', color: '#fff'}}>ออก</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity activeOpacity={1} onPress={() => handleImage()} style={styles.tAb}>
								<View style={styles.selectGall}>
									<Text style={{fontFamily: 'Kanit-Bold', color: '#fff'}}>เลือกจากคลัง</Text>
								</View>
							</TouchableOpacity>

							<QRCodeScanner
								onRead={e => handleQRCode(e)}
								reactivate={true}
								topContent={
									<Text style={{fontFamily: 'Kanit-Bold', color: '#000'}}>{textQR ? textQR : 'ยังไม่มีข้อมูล'}</Text>
								}
								showMarker={true}
								bottomContent={
									<TouchableOpacity>
										<Text style={{fontFamily: 'Kanit-Bold', color: '#000'}}>
											นำกล้องไปสแกนกับ QR CODE เพื่อค้นหาข้อมูล
										</Text>
									</TouchableOpacity>
								}
							/>
						</View>
					</>
				) : (
					<View
						style={{
							flexDirection: 'column',
							height: '100%',
						}}
					>
						{empty && <ModalAlert text='ไม่พบข้อมูลแรงงาน' />}
						<View
							style={{
								flex: 0.3,
								height: windowHeight / 5,
								backgroundColor: '#4399DB',
							}}
						>
							<TouchableOpacity onPress={handleLogout} style={styles.tAb}>
								<Text style={{fontFamily: 'Kanit-Bold', color: '#fff'}}>ออกจากระบบ</Text>
							</TouchableOpacity>
						</View>
						<View style={{flex: 5}}>
							<View style={styles.borderCus}>
								<View style={styles.borderTop}>
									<Text style={styles.InputCus}>กรอกข้อมูลแรงงาน</Text>
									<View style={styles.raround}>
										<View style={{width: '60%'}}>
											<View style={styles.bText}>
												<View style={{width: '100%'}}>
													<TextInput
														onChangeText={e => setNoRequest(e)}
														value={norequest}
														style={{
															...styles.input,
															fontFamily: 'Kanit-Regular',
															width: '100%',
															paddingRight: norequest ? 40 : 0,
														}}
														placeholder='เลขประจำตัว หรือ เลขที่คำขอ'
														keyboardType='default'
														selectTextOnFocus={true}
													/>
												</View>
												{norequest ? (
													<TouchableOpacity onPress={() => handleRemove()} style={styles.tX}>
														<Text
															style={{
																position: 'absolute',
																fontFamily: 'Kanit-Bold',
																top: 3,
															}}
														>
															x
														</Text>
													</TouchableOpacity>
												) : (
													<Text style={{position: 'absolute', right: 20}} />
												)}
											</View>
										</View>
										<TouchableOpacity
											disabled={waitB ? true : false}
											onPress={() => handleSearch(norequest)}
											style={{
												...styles.searchT,
												backgroundColor: waitB ? 'grey' : '#2F8DE4',
											}}
										>
											<Text style={{fontFamily: 'Kanit-Regular', color: '#fff'}}>ค้นหา</Text>
										</TouchableOpacity>
										<TouchableOpacity
											disabled={waitB ? true : false}
											onPress={() => handleScan()}
											style={{
												...styles.TScan,
												borderColor: waitB ? 'grey' : '#2F8DE4',
											}}
										>
											<LottieView
												ref={lottieRef}
												autoPlay
												style={{
													backgroundColor: 'transparent',
												}}
												source={require('../assets/animation/qrcode.json')}
											/>
										</TouchableOpacity>
									</View>
								</View>
							</View>

							{account ? (
								<>
									{isLoading ? (
										<>
											<View style={{justifyContent: 'center', alignItems: 'center'}}>
												<LottieView
													autoPlay
													style={styles.bgLottie}
													source={require('../assets/animation/loading.json')}
												/>
											</View>
										</>
									) : (
										<>
											<TouchableOpacity onPress={() => handleEdit()} activeOpacity={0.8} style={styles.tborder}>
												<View style={{width: 150, height: 200, borderRadius: 10}}>
													<Image
														resizeMode='cover'
														style={styles.bImg}
														source={{
															uri: imageFace ? imageFace : 'https://www.w3schools.com/howto/img_avatar.png',
														}}
													/>
												</View>
												<Text style={styles.textEdit}>แก้ไขข้อมูล</Text>
											</TouchableOpacity>
											<View style={styles.tranStart}>
												<View style={styles.bgTitle}>
													<Text style={styles.textCustomer}>ข้อมูลแรงงาน</Text>
												</View>
											</View>
											<View style={{flex: 1}}>
												<View style={{...styles.borderInput, paddingHorizontal: 10}}>
													<View style={{flex: 1}}>
														<View style={styles.borderInputBody}>
															<Text style={styles.fontT}>เลขประจำตัวต่างด้าว</Text>
															<View style={styles.width50}>
																<Text style={styles.fontT}>{account?.people_id}</Text>
															</View>
														</View>
														<View style={styles.borderInputBody}>
															<Text style={styles.fontT}>เลขที่คำขอ</Text>
															<View style={{width: '50%', flexWrap: 'wrap'}}>
																<Text style={styles.fontT}>{account?.wp_rn_no}</Text>
															</View>
														</View>
														<View style={styles.borderInputBody}>
															<Text style={styles.fontT}>ชื่อ-นามสกุล</Text>
															<View style={styles.width50}>
																<Text style={styles.fontT}>{account?.full_name_en}</Text>
															</View>
														</View>
														<View style={styles.borderInputBody}>
															<Text style={styles.fontT}>ประเภทงาน</Text>
															<View style={styles.width50}>
																<Text style={styles.fontT}>{account?.wp_type_th}</Text>
															</View>
														</View>
													</View>
												</View>
											</View>
											<View style={styles.tranStart}>
												<View style={styles.bgTitle}>
													<Text style={styles.textStatus}>สถานะการอัพโหลดเอกสาร</Text>
												</View>
												<View style={{width: '100%', paddingHorizontal: 10}}>
													<View style={{flex: 1}}>
														<View style={styles.borderInputBottom}>
															<View style={styles.borderIm}>
																<View
																	style={{
																		...styles.circle,
																		backgroundColor: imageFace ? '#1AFB74' : '#FB5F4A',
																	}}
																>
																	<Text style={styles.fontimgg}>{imageFace ? '100%' : '0%'}</Text>
																</View>
																<Text style={styles.fontT}>รูปใบหน้าคน</Text>
															</View>
															<View style={styles.borderIm}>
																<View
																	style={{
																		...styles.circle,
																		backgroundColor: imageRequest ? '#1AFB74' : '#FB5F4A',
																	}}
																>
																	<Text style={styles.fontimgg}>{imageRequest ? '100%' : '0%'}</Text>
																</View>
																<Text style={styles.fontT}>หนังสือรับรอง การจ้าง (บต.46)</Text>
															</View>
														</View>
														<View style={styles.borderInputBottom}>
															<View style={styles.borderIm}>
																<View
																	style={{
																		...styles.circle,
																		backgroundColor: imagePassport ? '#1AFB74' : '#FB5F4A',
																	}}
																>
																	<Text style={styles.fontimgg}>{imagePassport ? '100%' : '0%'}</Text>
																</View>
																<Text style={styles.fontT}>Passport</Text>
															</View>
															<View style={styles.borderIm}>
																<View
																	style={{
																		...styles.circle,
																		backgroundColor: imageSecure ? '#1AFB74' : '#FB5F4A',
																	}}
																>
																	<Text style={styles.fontimgg}>{imageSecure ? '100%' : '0%'}</Text>
																</View>
																<Text style={styles.fontT}>ใบเสร็จรับเงิน ประกันสังคมเดือนล่าสุด</Text>
															</View>
														</View>
														<View style={styles.borderInputBottom}>
															<View style={styles.borderIm}>
																<View
																	style={{
																		...styles.circle,
																		backgroundColor: imageVisa ? '#1AFB74' : '#FB5F4A',
																	}}
																>
																	<Text style={styles.fontimgg}>{imageVisa ? '100%' : '0%'}</Text>
																</View>
																<Text style={styles.fontT}>VISA</Text>
															</View>
															<View style={styles.borderIm}>
																<View
																	style={{
																		...styles.circle,
																		backgroundColor: imageHealth ? '#1AFB74' : '#FB5F4A',
																	}}
																>
																	<Text style={styles.fontimgg}>{imageHealth ? '100%' : '0%'}</Text>
																</View>
																<Text style={styles.fontT}>VISA 2</Text>
															</View>
														</View>

														<View style={styles.borderInputBottom}>
															<View style={styles.borderIm}>
																<View
																	style={{
																		...styles.circle,
																		backgroundColor: imageHealth ? '#1AFB74' : '#FB5F4A',
																	}}
																>
																	<Text style={styles.fontimgg}>{imageHealth ? '100%' : '0%'}</Text>
																</View>
																<Text style={styles.fontT}>บัตรประกันสุขภาพ/ใบเสร็จ รพ.ของรัฐ</Text>
															</View>
														</View>
													</View>
												</View>
											</View>
										</>
									)}
								</>
							) : (
								<>
									{isLoading ? (
										<>
											<View style={styles.load1}>
												<LottieView
													autoPlay
													style={styles.lottie}
													source={require('../assets/animation/loading.json')}
												/>
											</View>
										</>
									) : (
										<>
											<View style={styles.load2}>
												<View style={styles.load2}>
													<LottieView
														autoPlay
														style={styles.empty1}
														source={require('../assets/animation/empty.json')}
													/>
													<Text style={styles.fontEmpty}>ไม่พบข้อมูล</Text>
												</View>
											</View>
										</>
									)}
								</>
							)}
						</View>
					</View>
				)}
			</ScrollView>
		</>
	);
}
function onBackPress(): boolean | null | undefined {
	throw new Error('Function not implemented.');
}
