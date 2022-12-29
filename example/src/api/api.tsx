import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/env';

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
		// console.log('tokennnnnnn', token);
		// console.log('full_name_en', full_name_en);
		// console.log('people_id', people_id);
		// console.log('wp_rn_no', wp_rn_no);
		// console.log('wp_type_th', wp_type_th);
		const data = {
			full_name_en: full_name_en,
			people_id: people_id,
			wp_rn_no: wp_rn_no,
			wp_type_th: wp_type_th,
		};

		// `${config.api}/saveforeigner?full_name_en=${JSON.stringify(full_name_en)}&people_id=${JSON.stringify(
		// 			people_id
		// 		)}&wp_rn_no=${JSON.stringify(wp_rn_no)}&wp_type_th=${JSON.stringify(wp_type_th)}`,

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

		// await axios({
		// 	method: 'post',
		// 	url: `${config.api}`,
		// 	data: data,
		// 	headers: {
		// 		Authorization: `Bearer ${token}`,
		// 	},
		// })
		// .then(async (res: any) => {
		// 	console.log('save >>>', res.data);
		// 	return res;
		// })
		// .catch((err: any) => {
		// 	console.log(err);
		// 	return err;
		// });
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

	postUploadImage: async (file_img: any, pic_no: number, id: number) => {
		// console.log('file_img', file_img);
		// console.log('pic_no', pic_no);
		// console.log('id', id);
		const formData = new FormData();
		if (file_img === null) {
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
		formData.append('people_id', id);

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
