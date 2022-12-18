import React, {useState, useEffect} from 'react';
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image,
	RefreshControl,
	Platform,
	Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../templates/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import api from '../api/api';
import {useIsFocused} from '@react-navigation/native';
import ModalAlert from '../components/ModalAlert';

export type IHome = {
	ScannedImage: any;
};

export default function Home() {
	const navigation = useNavigation<any | null>();
	// const [nocustomer, setNoCustomer] = useState<any | null>(null);
	const [norequest, setNoRequest] = useState<any | null>(null);
	const [, setData] = useState<any | null>(null);
	const [, setImage] = useState<any | null>('https://i.imgur.com/WyGNtPn.png');
	const [, setCheck] = useState<boolean>(false);
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
	const [empty, setEmpty] = useState<boolean>(false);

	const isFocused = useIsFocused();

	// useEffect(() => {
	// 	getDataAccount();
	// }, []);

	const getDataAccount = async () => {
		setRefreshing(true);
		try {
			const id: string | null = await AsyncStorage.getItem('account');
			// if (!id) {
			// 	return Alert.alert('แจ้งเตือน', 'ไม่พบไอดีผู้ใช้งาน');
			// }

			const {data} = await api.getSearch(id);
			console.log('data', data[0].img);
			if (data?.length === 0) return setRefreshing(false);
			await setFormatImage(data[0].img);
			await setAccount(data[0]);
			console.log('setAccount', data[0].full_name_en);
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

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setIsLoading(true);
		// checkStatus();
		wait(2000).then(() => {
			setRefreshing(false), setIsLoading(false);
		});
	}, []);

	const GetIMG = async () => {
		if (await AsyncStorage.getItem('image')) {
			setCheck(false);
			setImage(await AsyncStorage.getItem('image'));
		} else {
			setImage('https://i.imgur.com/WyGNtPn.png');
		}
	};

	useEffect(() => {
		getDataAccount();
		GetIMG();
		return () => {
			setIsLoading(true);
			wait(1000).then(() => {
				setRefreshing(false), setIsLoading(false);
			});
		};
	}, [isFocused]);

	const wait = (timeout: number | undefined) => {
		return new Promise((resolve: any) => setTimeout(resolve, timeout));
	};

	const handleLogout = async () => {
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('account');
		navigation.navigate('login');
		setData(null);
		setAccount(null);
	};

	const handleSearch = async () => {
		getDataAccount();
		if (norequest === null) {
			Alert.alert('แจ้งเตือน', 'กรุณากรอกเลขประจำตัว หรือ เลขที่คำขอ');
			return;
		}
		await AsyncStorage.setItem('account', norequest);
		const data = await api.getSearch(norequest);
		setAccount([]);
		if (data?.data?.code === 200) {
			if (data?.data?.data?.length === 0) {
				// Alert.alert('แจ้งเตือน', 'ไม่พบข้อมูลแรงงาน');
				setEmpty(true);
				setTimeout(() => {
					setEmpty(false);
				}, 2000);
				setAccount(null);
				return;
			}
			if (data?.data?.data?.length > 0) {
				setAccount(data?.data?.data);
				// console.log('da account >>', data?.data?.data);
				checkStatus(data?.data?.data);
				setIsLoading(true);
				setTimeout(() => {
					setIsLoading(false);
				}, 200);
			}

			return data;
		}
	};

	// const getDataAccount = async () => {
	// 	const id: string | null = await AsyncStorage.getItem('account');
	// 	const {data} = await api.getSearch(id);
	// 	return id;
	// };

	const checkStatus = async (dataimg: any) => {
		setImageFace(null);
		setImagePassport(null);
		setImageRequest(null);
		setImageVisa(null);
		setImageHealth(null);
		setImageSecure(null);
		console.log('dataimg >>', dataimg);
		const img = account[0]?.img;
		console.log('IMGGG >>>', img);
		const data = await img.filter((item: any) => {
			return item.pic_no === 1;
		});
		const data1 = await img.filter((item: any) => {
			return item.pic_no === 1;
		});
		setImageFace(JSON.stringify(data1[0]?.url));
		const data2 = await img.filter((item: any) => {
			return item.pic_no === 2;
		});
		setImagePassport(JSON.stringify(data2[0]?.url));
		const data3 = await img.filter((item: any) => {
			return item.pic_no === 3;
		});
		setImageVisa(JSON.stringify(data3[0]?.url));
		const data4 = await img.filter((item: any) => {
			return item.pic_no === 4;
		});
		setImageRequest(JSON.stringify(data4[0]?.url));
		const data5 = await img.filter((item: any) => {
			return item.pic_no === 5;
		});
		setImageSecure(JSON.stringify(data5[0]?.url));
		const data6 = img.filter((item: any) => {
			return item.pic_no === 6;
		});
		setImageHealth(JSON.stringify(data6[0]?.url));
		return data;
	};

	const handleEdit = async () => {
		navigation.navigate('detail');
	};

	return (
		<>
			<ScrollView
				// style={{ height: windowHeight + 120 }}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				<View
					style={{
						flexDirection: 'column',
						height: '100%',
						// paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
						<TouchableOpacity
							onPress={handleLogout}
							style={{
								position: 'absolute',
								width: 'auto',
								height: 30,
								right: 20,
								top: Platform.OS === 'android' ? 20 : 40,
							}}
						>
							<Text style={{fontFamily: 'Kanit-Bold', color: '#fff'}}>ออกจากระบบ</Text>
						</TouchableOpacity>
					</View>
					<View style={{flex: 5}}>
						<View
							style={{
								backgroundColor: 'transparent',
								height: 80,
								position: 'relative',
								alignItems: 'center',
							}}
						>
							<View style={styles.borderTop}>
								<Text
									style={{
										fontFamily: 'Kanit-Bold',
										color: 'rgba(0,0,0,0.7)',
										marginBottom: 5,
										fontSize: 16,
										marginLeft: 10,
									}}
								>
									กรอกข้อมูลแรงงาน
								</Text>
								<View
									style={{
										flexDirection: 'row',
										width: '100%',
										justifyContent: 'space-around',
									}}
								>
									<View style={{width: '70%'}}>
										{/* <View style={{ width: '100%' }}>
                      <TextInput
                        onChangeText={(e) => setNoCustomer(e)}
                        value={nocustomer}
                        style={{ ...styles.input, fontFamily: 'Kanit-Regular' }}
                        placeholder="เลขประจำตัวคนต่างด้าว"
                        keyboardType="number-pad"
                      />
                    </View> */}
										<View style={{width: '100%', marginTop: 5}}>
											<TextInput
												onChangeText={e => setNoRequest(e)}
												value={norequest}
												style={{...styles.input, fontFamily: 'Kanit-Regular'}}
												placeholder='เลขประจำตัว หรือ เลขที่คำขอ'
												keyboardType='default'
											/>
										</View>
									</View>
									<TouchableOpacity
										onPress={handleSearch}
										style={{
											width: '20%',
											backgroundColor: '#2F8DE4',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 13,
										}}
									>
										<Text style={{fontFamily: 'Kanit-Regular', color: '#fff'}}>ค้นหา</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
						{/* {check ? (
              <Image
                resizeMode="contain"
                style={{ width: 200, height: 200 }}
                source={{ uri: image }}
              />
            ) : (
              <Image
                resizeMode="contain"
                style={{ width: 200, height: 200 }}
                source={{ uri: 'file://' + image }}
                // source={require(image)}
              />
            )} */}

						{account ? (
							<>
								{isLoading ? (
									<>
										<View style={{justifyContent: 'center', alignItems: 'center'}}>
											<LottieView
												autoPlay
												style={{
													width: 200,
													height: 200,
													backgroundColor: 'transparent',
												}}
												source={require('../assets/animation/loading.json')}
											/>
										</View>
									</>
								) : (
									<>
										<TouchableOpacity
											onPress={() => handleEdit()}
											activeOpacity={0.8}
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												marginBottom: 30,
											}}
										>
											<View style={{width: 150, height: 200, borderRadius: 10}}>
												<Image
													resizeMode='contain'
													style={{
														width: '100%',
														height: '100%',
														borderRadius: 10,
													}}
													source={{
														uri: imageFace ? imageFace : 'https://www.w3schools.com/howto/img_avatar.png',
													}}
												/>
											</View>
											<Text
												style={{
													fontFamily: 'Kanit-Regular',
													color: 'rgba(0,0,0,8)',
													fontSize: 10,
													// marginLeft: 10,
													marginTop: 5,
												}}
											>
												แก้ไขข้อมูล
											</Text>
										</TouchableOpacity>
										<View
											style={{
												backgroundColor: 'transparent',
												alignItems: 'flex-start',
											}}
										>
											<View style={styles.bgTitle}>
												<Text
													style={{
														fontFamily: 'Kanit-Bold',
														color: '#fff',
														fontSize: 16,
														marginLeft: 20,
													}}
												>
													ข้อมูลแรงงาน
												</Text>
											</View>
										</View>
										<View style={{flex: 1}}>
											<View style={{...styles.borderInput, paddingHorizontal: 10}}>
												<View style={{flex: 1}}>
													<View style={styles.borderInputBody}>
														<Text style={{fontFamily: 'Kanit-Regular'}}>เลขประจำตัวต่างด้าว</Text>
														<View style={{width: '50%'}}>
															<Text style={{fontFamily: 'Kanit-Regular'}}>{account?.people_id}</Text>
														</View>
													</View>
													<View style={styles.borderInputBody}>
														<Text style={{fontFamily: 'Kanit-Regular'}}>เลขที่คำขอ</Text>
														<View style={{width: '50%', flexWrap: 'wrap'}}>
															<Text style={{fontFamily: 'Kanit-Regular'}}>{account?.wp_rn_no}</Text>
														</View>
													</View>
													<View style={styles.borderInputBody}>
														<Text style={{fontFamily: 'Kanit-Regular'}}>ชื่อ-นามสกุล</Text>
														<View style={{width: '50%'}}>
															<Text style={{fontFamily: 'Kanit-Regular'}}>{account?.full_name_en}</Text>
														</View>
													</View>
													<View style={styles.borderInputBody}>
														<Text style={{fontFamily: 'Kanit-Regular'}}>ประเภทงาน</Text>
														<View style={{width: '50%'}}>
															<Text style={{fontFamily: 'Kanit-Regular'}}>{account?.wp_type_th}</Text>
														</View>
													</View>
												</View>
											</View>
										</View>
										<View
											style={{
												backgroundColor: 'transparent',
												alignItems: 'flex-start',
											}}
										>
											<View style={styles.bgTitle}>
												<Text
													style={{
														fontFamily: 'Kanit-Bold',
														color: '#fff',
														fontSize: 16,
														marginLeft: 20,
													}}
												>
													สถานะการอัพโหลดเอกสาร
												</Text>
											</View>
											<View style={{width: '100%', paddingHorizontal: 10}}>
												<View style={{flex: 1}}>
													<View style={styles.borderInputBottom}>
														<View
															style={{
																width: '40%',
																flexDirection: 'row',
																alignItems: 'center',
															}}
														>
															<View
																style={{
																	...styles.circle,
																	backgroundColor: imageFace ? '#1AFB74' : '#FB5F4A',
																}}
															>
																<Text
																	style={{
																		fontFamily: 'Kanit-Regular',
																		color: '#fff',
																		fontWeight: 'bold',
																	}}
																>
																	{imageFace ? '100%' : '0%'}
																</Text>
															</View>
															<Text style={{fontFamily: 'Kanit-Regular'}}>รูปใบหน้าคน</Text>
														</View>
														<View
															style={{
																width: '40%',
																flexDirection: 'row',
																alignItems: 'center',
															}}
														>
															<View
																style={{
																	...styles.circle,
																	backgroundColor: imageRequest ? '#1AFB74' : '#FB5F4A',
																}}
															>
																<Text
																	style={{
																		fontFamily: 'Kanit-Regular',
																		color: '#fff',
																		fontWeight: 'bold',
																	}}
																>
																	{imageRequest ? '100%' : '0%'}
																</Text>
															</View>
															<Text style={{fontFamily: 'Kanit-Regular'}}>หนังสือรับรอง การจ้าง (บต.46)</Text>
														</View>
													</View>
													<View style={styles.borderInputBottom}>
														<View
															style={{
																width: '40%',
																flexDirection: 'row',
																alignItems: 'center',
															}}
														>
															<View
																style={{
																	...styles.circle,
																	backgroundColor: imagePassport ? '#1AFB74' : '#FB5F4A',
																}}
															>
																<Text
																	style={{
																		fontFamily: 'Kanit-Regular',
																		color: '#fff',
																		fontWeight: 'bold',
																	}}
																>
																	{imagePassport ? '100%' : '0%'}
																</Text>
															</View>
															<Text style={{fontFamily: 'Kanit-Regular'}}>Passport</Text>
														</View>
														<View
															style={{
																width: '40%',
																flexDirection: 'row',
																alignItems: 'center',
															}}
														>
															<View
																style={{
																	...styles.circle,
																	backgroundColor: imageSecure ? '#1AFB74' : '#FB5F4A',
																}}
															>
																<Text
																	style={{
																		fontFamily: 'Kanit-Regular',
																		color: '#fff',
																		fontWeight: 'bold',
																	}}
																>
																	{imageSecure ? '100%' : '0%'}
																</Text>
															</View>
															<Text style={{fontFamily: 'Kanit-Regular'}}>ใบเสร็จรับเงิน ประกันสังคมเดือนล่าสุด</Text>
														</View>
													</View>
													<View style={styles.borderInputBottom}>
														<View
															style={{
																width: '40%',
																flexDirection: 'row',
																alignItems: 'center',
															}}
														>
															<View
																style={{
																	...styles.circle,
																	backgroundColor: imageVisa ? '#1AFB74' : '#FB5F4A',
																}}
															>
																<Text
																	style={{
																		fontFamily: 'Kanit-Regular',
																		color: '#fff',
																		fontWeight: 'bold',
																	}}
																>
																	{imageVisa ? '100%' : '0%'}
																</Text>
															</View>
															<Text style={{fontFamily: 'Kanit-Regular'}}>VISA</Text>
														</View>
														<View
															style={{
																width: '40%',
																flexDirection: 'row',
																alignItems: 'center',
															}}
														>
															<View
																style={{
																	...styles.circle,
																	backgroundColor: imageHealth ? '#1AFB74' : '#FB5F4A',
																}}
															>
																<Text
																	style={{
																		fontFamily: 'Kanit-Regular',
																		color: '#fff',
																		fontWeight: 'bold',
																	}}
																>
																	{imageHealth ? '100%' : '0%'}
																</Text>
															</View>
															<Text style={{fontFamily: 'Kanit-Regular'}}>บัตรประกันสุขภาพ/ใบเสร็จ รพ.ของรัฐ</Text>
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
										<View
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												height: 300,
											}}
										>
											<LottieView
												autoPlay
												style={{
													width: 200,
													height: 200,
													backgroundColor: 'transparent',
												}}
												source={require('../assets/animation/loading.json')}
											/>
										</View>
									</>
								) : (
									<>
										<View
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												height: 300,
											}}
										>
											<View
												style={{
													justifyContent: 'center',
													alignItems: 'center',
													height: 300,
												}}
											>
												<LottieView
													autoPlay
													style={{
														width: 130,
														height: 130,
														backgroundColor: 'transparent',
													}}
													source={require('../assets/animation/empty.json')}
												/>
												<Text style={{fontFamily: 'Kanit-Regular', fontSize: 18}}>ไม่พบข้อมูล</Text>
											</View>
										</View>
									</>
								)}
							</>
						)}
					</View>
				</View>
			</ScrollView>
		</>
	);
}
