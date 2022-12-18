import {useState, useEffect} from 'react';
import {Text, View, TextInput, Dimensions, Image, KeyboardAvoidingView, Pressable} from 'react-native';
import {styles} from '../../templates/theme';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalAlert from '../../components/ModalAlert';
import React from 'react';
import api from '../../api/api';

export default function Login() {
	const navigation = useNavigation<any>();
	const [username, setUsername] = useState<any>('');
	const [password, setPassword] = useState<string>('');
	const [alertText, setAlertText] = useState<string>('');
	const [alert, setAlert] = useState<boolean>(false);
	const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true);
	const [rightIcon, setRightIcon] = useState<string>('eye');

	// const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;

	const getToken = async () => {
		const token = await AsyncStorage.getItem('token');
		if (token !== null) {
			navigation.navigate('home1');
		}
		return token;
	};

	useEffect(() => {
		getToken();
	}, []);

	const handlePasswordVisibility = () => {
		if (rightIcon === 'eye') {
			setRightIcon('eye-off');
			setPasswordVisibility(!passwordVisibility);
		} else if (rightIcon === 'eye-off') {
			setRightIcon('eye');
			setPasswordVisibility(!passwordVisibility);
		}
	};

	const handleLogin = async () => {
		if (username === '' && password === '') {
			setAlert(true);
			setTimeout(() => {
				setAlert(false);
			}, 2000);
			setAlertText('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน.');
			return;
		}
		if (username === '') {
			setAlert(true);
			setTimeout(() => {
				setAlert(false);
			}, 2000);
			setAlertText('กรุณากรอกชื่อผู้ใช้');
			return;
		}
		if (password === '') {
			setAlert(true);
			setTimeout(() => {
				setAlert(false);
			}, 2000);
			setAlertText('กรุณากรอกรหัสผ่าน');
			return;
		}
		const login = await api.postLogin(username, password);
		if (login?.data?.code === 200) {
			await AsyncStorage.setItem('token', login?.data?.data?.token);
			navigation.navigate('home1');
			return login;
		}
	};
	return (
		<>
			{alert && <ModalAlert text={alertText} />}

			<KeyboardAvoidingView behavior={'position'}>
				<View
					style={{
						backgroundColor: '#4399DB',
						height: windowHeight,
						width: '100%',
					}}
				>
					<View style={{backgroundColor: '#4399DB', height: windowHeight / 3}}></View>
					<View style={styles.borderWhite}>
						<View style={{alignItems: 'center'}}>
							<Image
								resizeMode='contain'
								source={require('../../assets/images/logo.png')}
								style={{width: 200, height: 200}}
							/>
							<Text
								style={{
									fontSize: 20,
									fontFamily: 'Kanit-Bold',
									marginBottom: 10,
								}}
							>
								เข้าสู่ระบบ
							</Text>
						</View>
						<View style={{flex: 0.5, width: '80%'}}>
							<TextInput
								onChangeText={e => setUsername(e)}
								value={username}
								style={{...styles.input, fontFamily: 'Kanit-Regular'}}
								placeholder='ชื่อผู้ใช้'
								enablesReturnKeyAutomatically
							/>
							<View
								style={{
									flexDirection: 'row',
									width: '100%',
									alignItems: 'center',
								}}
							>
								<TextInput
									onChangeText={e => setPassword(e)}
									value={password}
									secureTextEntry={passwordVisibility ? true : false}
									style={{
										...styles.input,
										marginVertical: 10,
										fontFamily: 'Kanit-Regular',
										width: '100%',
										position: 'relative',
									}}
									placeholder='รหัสผ่าน'
									enablesReturnKeyAutomatically
								/>
								<Pressable onPress={handlePasswordVisibility} style={{position: 'absolute', right: 10}}>
									{/* <MaterialCommunityIcons
                    name={rightIcon}
                    size={22}
                    color="#232323"
                  /> */}
								</Pressable>
							</View>
							<Button onPress={handleLogin} bg={'#4399db'} text={'ยืนยัน'} />
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</>
	);
}
