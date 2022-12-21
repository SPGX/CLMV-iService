import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/env';

export default {
	postLogin: async (username: any, password: any) => {
		return await axios
			.post(`${config.api}/login?username=${username}&password=${password}`)
			.then(async (res: any) => {
				// console.log('res LOGIN >>', res?.data);
				if (res && res?.data?.data?.token) {
					await AsyncStorage.setItem('token', res?.data?.data?.token);
				}
				return res;
			})
			.catch((err: any) => {
				// console.log('postLogin Error >>', err);
				return err;
			});
	},

	getSearch: async (search: any) => {
		return await axios
			.get(`${config.api}/getforeigner?search=${search}`)
			.then(async (res: any) => {
				// console.log('res?.data?.data', res);
				return {
					data: res?.data?.data,
				};
			})
			.catch((err: any) => {
				console.log('ERR >>', err);
				return err;
			});
	},

	postUploadImage: async (file_img: any, pic_no: number, id: number) => {
		// console.log('file_img', file_img);
		// console.log('pic_no', pic_no);
		// console.log('id', id);
		const formData = new FormData();
		if (!file_img) {
			formData.append('file_img', {
				type: 'image/jpg',
				name: 'image.jpg',
			});
		} else {
			formData.append('file_img', {
				uri: file_img,
				type: 'image/jpg',
				name: 'image.jpg',
			});
		}
		formData.append('pic_no', pic_no);
		formData.append('id', id);

		const token = await AsyncStorage.getItem('token');

		await axios({
			method: 'post',
			url: `${config.api}/uploadfile`,
			data: formData,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': `multipart/form-data`,
			},
		})
			.then(async (res: any) => {
				return res;
			})
			.catch((err: any) => {
				console.log('ERR >>', err);
				return err;
			});
	},
};
