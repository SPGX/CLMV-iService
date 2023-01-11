import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/env';
// import {FormData} from 'react-native';

export default {
	postLogin: async (username: any, password: any) => {
		return await axios
			.post(`${config.api}/login?username=${username}&password=${password}`, {
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
			})
			.then(async (res: any) => {
				if (res && res?.data?.data?.token) {
					await AsyncStorage.setItem('token', res?.data?.data?.token);
				}
				return res;
			})
			.catch((err: any) => {
				console.log(err);
				return err;
			});
	},

	postSaveUsers: async (full_name_en: any, people_id: any, wp_rn_no: any, wp_type_th: any) => {
		const token = await AsyncStorage.getItem('token');
		const data = {
			full_name_en: full_name_en,
			people_id: people_id,
			wp_rn_no: wp_rn_no,
			wp_type_th: wp_type_th,
		};

		return await axios
			.post(`${config.api}/saveforeigner`, data, {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			.then(async (res: any) => {
				return res;
			})
			.catch((err: any) => {
				console.log(err);
				return err;
			});
	},

	getSearch: async (search: any) => {
		return await axios
			.get(`${config.api}/getforeigner?search=${search}`)
			.then(async (res: any) => {
				return {
					data: res?.data?.data,
				};
			})
			.catch((err: any) => {
				return err;
			});
	},

	postUploadImage: async (file_img: string, pic_no: any, id: any) => {
		const token = await AsyncStorage.getItem('token');
		// console.log('TOKEN', token);
		// console.log('file_img', file_img);
		// console.log('pic_no', pic_no);
		// console.log('id', id);
		// let name: any = 'img_from_mobile.jpg';
		const formData = new FormData();

		type formData = {
			type: string;
			name: string;
			uri?: string;
		};

		// formData.append('file_img', {
		// 	uri: file_img,
		// 	type: 'mobile/jpg',
		// 	name: 'image.jpg',
		// });

		// if (!file_img)
		// 	formData.append('file_img', {
		// 		type: 'image/jpg',
		// 		name: 'img_from_mobile.jpg',
		// 	});

		// if (file_img)
		// 	formData.append('file_img', {
		// 		uri: file_img,
		// 		type: 'image/jpg',
		// 		name: 'image.jpg',
		// 	});

		if (file_img == null) {
			formData.append('file_img', {
				type: 'image/jpg',
				name: 'img_from_mobile.jpg',
			});
		} else {
			formData.append('file_img', {
				uri: file_img,
				type: 'image/jpg',
				name: 'image.jpg',
			});
		}
		formData.append('pic_no', pic_no);
		formData.append('people_id', id);

		// console.log('=========== formData ===========', JSON.stringify(formData));

		return await axios({
			method: 'post',
			url: `${config.api}/uploadfile`,
			data: formData,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': `multipart/form-data`,
			},
		})
			.then(async (res: any) => {
				// console.log('res -->', res);
				return res;
			})
			.catch((err: any) => {
				// console.log('ERR >>', err);
				return err;
			});
	},
};
