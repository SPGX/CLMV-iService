// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import api from './index'
import config from '../config/env';

// const Bearer =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiMDgwMzg5IiwidXNlcm5hbWUiOiIxX2FybXNyaWNoYW4yQGdtYWlsLmNvbSIsImFjdGlvbiI6ImxvZ2luU3RlcDEiLCJpYXQiOjE2NjQ3ODA3MzIsImV4cCI6MTY2NDc4MTYzMn0.II76XgLadxCympGZNvPJ1FfqSoHnwbvBq_gxAsQElVE'

export default {
	postLogin: async (username: any, password: any) => {
		return await axios
			.post(`${config.api}/login?username=${username}&password=${password}`)
			.then(async (res: any) => {
				await AsyncStorage.setItem('token', res?.data?.data?.token);
				return res;
			})
			.catch((err: any) => {
				console.log('ERR >>', err);
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
				console.log('ERR >>', err);
				return err;
			});
	},

	postUploadImage: async (file_img: any, pic_no: number, id: number) => {
		const formData = new FormData();
		if (!file_img) {
			formData.append('file_img', {
				type: 'image/jpeg',
				name: 'image_file',
			});
		} else {
			formData.append('file_img', {
				uri: file_img,
				type: 'image/jpeg',
				name: 'image_file',
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

	postRemoveImg2: async (image_file: any, size: any) => {
		const formData = new FormData();
		formData.append('image_file', {
			uri: image_file,
			type: 'image/jpg',
			name: 'image_file',
		});

		formData.append('size', 'auto');

		return fetch('https://api.remove.bg/v1.0/removebg', {
			method: 'POST',
			headers: {
				'X-API-Key': 'GKc5DMGkfx9cR942N86eoEpe',
			},
			body: formData,
		})
			.then(res => {
				if (!res.ok) {
					return res.text().then(text => {
						let message = text;
						try {
							const json = JSON.parse(message);
							if (json && json.errors && json.errors[0]) {
								message = json.errors[0].title;
							}
						} catch (err) {}
						throw new Error(message);
					});
				}
				return res.blob();
			})
			.then(nsdata => {})
			.catch(err => {
				console.error(err);
			});
	},

	postRemoveImg: async (image_file: any, size: any) => {
		const formData = new FormData();
		formData.append('image_file', {
			uri: image_file,
			type: 'image/jpg',
			name: 'image_file',
		});
		formData.append('size', 'auto');

		const config = {
			method: 'post',
			url: 'https://api.remove.bg/v1.0/removebg',
			headers: {
				'X-API-Key': 'ssSP1keD4bdUEr7VZoiMU21K',
				'Content-Type': 'multipart/form-data',
			},
			data: formData,
		};

		await axios(config)
			.then(function (response) {})
			.catch(function (error) {
				console.log(error);
			});
	},
};
