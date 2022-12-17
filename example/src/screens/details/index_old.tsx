import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../templates/theme';
import LottieView from 'lottie-react-native';
import Modal from '../../components/Modal';
import ModalImage from '../../components/ModalImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

export default function Home(route: any) {
  const navigation = useNavigation<any>();
  //Images
  // const [, setPreview] = useState(null);
  const [imageFace, setImageFace] = useState<any>(null);
  const [closeCamera, setCloseCamera] = useState(false);
  const [, setStartCamera] = useState(false);
  // const [, setImage] = useState(null);
  const [, setPart] = useState(null);
  const [imagePassport, setImagePassport] = useState<any>(null);
  const [imageHealth, setImageHealth] = useState<any>(null);
  const [imageSecure, setImageSecure] = useState<any>(null);
  const [imageVisa, setImageVisa] = useState<any>(null);
  const [imageRequest, setImageRequest] = useState<any>(null);
  const [gallery] = useState<any>(null);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  // Loading
  const [refreshing, setRefreshing] = useState(false);
  const [exImg, setExImg] = useState<any>(null);
  const [, setDAccount] = useState<any>([]);
  const [account, setAccount] = useState<any>(null);

  // interface Action {
  //   title: string;
  //   type: 'capture' | 'library';
  //   options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
  // }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDataAccount();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const wait = (timeout: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    getDataAccount();
    pickImageFace();
    pickImagePassport();
    pickImageVisa();
    pickImageRequest();
    pickImageHealth();
    pickImageSecure();
    getAccount();
  }, [route]);

  const handleImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };

  const handleCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };

  const getAccount = async () => {
    const data = await AsyncStorage.getItem('account');
    setDAccount(data);
  };

  const pickImageFace = async () => {
    if (await AsyncStorage.getItem('image_face')) {
      const data = await AsyncStorage.getItem('image_face');
      setImageFace(data);
    }
    if (gallery === 'face') {
    }
  };

  const getDataAccount = async () => {
    const data = await api.getSearch(await AsyncStorage.getItem('account'));
    if (data?.data?.code === 200) {
      if (data?.data?.data?.length === 0) {
        Alert.alert('แจ้งเตือน', 'เกิดข้อผิดพลาดบางอย่างขึ้น');
        return;
      }
      if (data?.data?.data?.length > 0) {
        setAccount(data?.data?.data[0]);
      }

      return data;
    }
  };

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

  const handleฺBack = async () => {
    navigation.goBack();
  };

  const getNoImage = () => {
    return (
      <>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            autoPlay
            style={{
              width: '100%',
              height: windowWidth / 4,
              backgroundColor: 'transparent',
            }}
            source={require('../../assets/animation/noimg.json')}
          />
        </View>
        <Text style={{ fontFamily: 'Kanit-Regular', color: '#fff' }}>
          โปรดอัพโหลดรูปภาพ
        </Text>
      </>
    );
  };

  // const handleCancel = () => {
  //   setPreview(null);
  //   setImage(null);
  //   setStartCamera(false);
  // };

  const handleOpenCamera = () => {
    navigation.navigate('Scanner');
    setStartCamera(true);
    setCloseCamera(false);
  };

  // const handleOpenGallery = () => {
  //   if (part === 'face') {
  //     pickImageFace();
  //     setCloseCamera(false);
  //     return;
  //   }
  //   if (part === 'passport') {
  //     pickImagePassport();
  //     setCloseCamera(false);
  //     return;
  //   }
  //   if (part === 'visa') {
  //     pickImageVisa();
  //     setCloseCamera(false);
  //     return;
  //   }
  //   if (part === 'request') {
  //     pickImageRequest();
  //     setCloseCamera(false);
  //     return;
  //   }
  //   if (part === 'secure') {
  //     pickImageSecure();
  //     setCloseCamera(false);
  //     return;
  //   }
  //   if (part === 'health') {
  //     pickImageHealth();
  //     setCloseCamera(false);
  //     return;
  //   }
  // };

  const handleCloseCamera = () => {
    setCloseCamera(false);
    setExImg(null);
  };

  const handleUpload = async (v: any) => {
    setCloseCamera(true);
    if (v === 'face') {
      pickImageFace();
      const data = await AsyncStorage.setItem('cameraType', v);
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'passport') {
      pickImagePassport();
      const data = await AsyncStorage.setItem('cameraType', v);
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'visa') {
      pickImageVisa();
      const data = await AsyncStorage.setItem('cameraType', v);
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'request') {
      pickImageRequest();
      const data = await AsyncStorage.setItem('cameraType', v);
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'secure') {
      pickImageSecure();
      const data = await AsyncStorage.setItem('cameraType', v);
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'health') {
      pickImageHealth();
      const data = await AsyncStorage.setItem('cameraType', v);
      // navigation.navigate('Scanner');
      return data;
    }
    setPart(v);
    // setCloseCamera(true);
  };

  const handleDelete = async (v: any) => {
    if (v === 'face') {
      pickImageFace();
      const data = await AsyncStorage.removeItem('image_face');
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'passport') {
      pickImagePassport();
      const data = await AsyncStorage.removeItem('image_passport');
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'visa') {
      pickImageVisa();
      const data = await AsyncStorage.removeItem('image_visa');
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'request') {
      pickImageRequest();
      const data = await AsyncStorage.removeItem('image_request');
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'secure') {
      pickImageSecure();
      const data = await AsyncStorage.removeItem('image_secure');
      // navigation.navigate('Scanner');
      return data;
    }
    if (v === 'health') {
      const data = await AsyncStorage.removeItem('image_health');
      return data;
    }
  };

  return (
    <>
      {closeCamera && (
        <Modal
          handleCamera={handleOpenCamera}
          // handleGallery={handleOpenGallery}
          handleGallery={() => Alert.alert('แจ้งเตือน', 'รออัพเดท...')}
          handleClose={handleCloseCamera}
          cancel={undefined}
        />
      )}

      {exImg && (
        <ModalImage
          getImage={'file://' + exImg}
          handleClose={handleCloseCamera}
          cancel={undefined}
        />
      )}

      <ScrollView
        style={{ height: '100%', position: 'relative' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
              height:
                Platform.OS === 'ios' ? windowHeight / 5 : windowHeight / 6,
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
                top: Platform.OS === 'android' ? 10 : 40,
                flexDirection: 'row',
              }}
            >
              <Text style={{ fontFamily: 'Kanit-Bold', color: '#fff' }}>
                ย้อนกลับ
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 5 }}>
            <View
              style={{
                backgroundColor: 'transparent',
                height: 140,
                position: 'relative',
                alignItems: 'center',
              }}
            >
              <View style={styles.borderTop}>
                <View style={{ flex: 2 }}>
                  <View style={styles.borderInputBody}>
                    <Text style={{ fontFamily: 'Kanit-Regular' }}>
                      เลขประจำตัวคนต่างด้าว
                    </Text>
                    <View style={{ width: '50%' }}>
                      <Text style={{ fontFamily: 'Kanit-Regular' }}>
                        {account?.people_id}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.borderInputBody}>
                    <Text style={{ fontFamily: 'Kanit-Regular' }}>
                      เลขที่คำขอ
                    </Text>
                    <View style={{ width: '50%', flexWrap: 'wrap' }}>
                      <Text style={{ fontFamily: 'Kanit-Regular' }}>
                        {account?.wp_rn_no}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.borderInputBody}>
                    <Text style={{ fontFamily: 'Kanit-Regular' }}>
                      ชื่อ-นามสกุล
                    </Text>
                    <View style={{ width: '50%' }}>
                      <Text style={{ fontFamily: 'Kanit-Regular' }}>
                        {account?.full_name_en}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.borderInputBody}>
                    <Text style={{ fontFamily: 'Kanit-Regular' }}>
                      ประเภทงาน
                    </Text>
                    <View style={{ width: '50%' }}>
                      <Text style={{ fontFamily: 'Kanit-Regular' }}>
                        {account?.wp_type_th}
                      </Text>
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
            <View style={styles.bgTitle}>
              <Text style={styles.textBlue}>รูปใบหน้าคนงาน</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {imageFace ? (
                <TouchableOpacity
                  onPress={() => {
                    handleDelete('face');
                    // setImageFace(null);
                  }}
                  style={styles.deleteImg}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular', color: '#fff' }}>
                    ลบ
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleUpload('face')}
                  style={styles.buttonUpload}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular' }}>
                    กดเพื่ออัพโหลดรูป
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={1}
                style={{ width: '100%' }}
                onPress={() => (imageFace ? setExImg(imageFace) : {})}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Kanit-Regular',
                    color: imageFace ? 'green' : 'red',
                    width: '50%',
                  }}
                >
                  {imageFace ? imageFace : 'ยังไม่ได้อัพโหลด'}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: windowHeight / 5,
                width: '100%',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{ ...styles.borderDetail, height: windowHeight / 5 }}
                // onPress={() => Alert.alert('แจ้งเตือน', 'รออัพเดท...')}
                onPress={() => handleImage()}
              >
                {imageFace ? (
                  <Image
                    resizeMode="contain"
                    source={{ uri: 'file://' + imageFace }}
                    style={{ width: '50%', height: '100%' }}
                  />
                ) : (
                  <>{getNoImage()}</>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ ...styles.bgTitle, marginTop: 30 }}>
              <Text style={styles.textBlue}>รูป Passport</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {imagePassport ? (
                <TouchableOpacity
                  onPress={
                    () => handleDelete('passport')
                    // setImagePassport(null)
                  }
                  style={styles.deleteImg}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular', color: '#fff' }}>
                    ลบ
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleUpload('passport')}
                  style={styles.buttonUpload}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular' }}>
                    กดเพื่ออัพโหลดรูป
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={1}
                style={{ width: '100%' }}
                onPress={() => (imagePassport ? setExImg(imagePassport) : {})}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Kanit-Regular',
                    color: imagePassport ? 'green' : 'red',
                    width: '50%',
                  }}
                >
                  {imagePassport ? imagePassport : 'ยังไม่ได้อัพโหลด'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ ...styles.bgTitle, marginTop: 30 }}>
              <Text style={styles.textBlue}>รูป VISA</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {imageVisa ? (
                <TouchableOpacity
                  onPress={
                    () => handleDelete('visa')
                    // setImageVisa(null)
                  }
                  style={styles.deleteImg}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular', color: '#fff' }}>
                    ลบ
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleUpload('visa')}
                  style={styles.buttonUpload}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular' }}>
                    กดเพื่ออัพโหลดรูป
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={1}
                style={{ width: '100%' }}
                onPress={() => (imageVisa ? setExImg(imageVisa) : {})}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Kanit-Regular',
                    color: imageVisa ? 'green' : 'red',
                    width: '50%',
                  }}
                >
                  {imageVisa ? imageVisa : 'ยังไม่ได้อัพโหลด'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ ...styles.bgTitle, marginTop: 30 }}>
              <Text style={styles.textBlue}>
                รูปหนังสือรับรองการจ้าง (บต.46)
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {imageRequest ? (
                <TouchableOpacity
                  onPress={
                    () => handleDelete('request')
                    // setImageRequest(null)
                  }
                  style={styles.deleteImg}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular', color: '#fff' }}>
                    ลบ
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleUpload('request')}
                  style={styles.buttonUpload}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular' }}>
                    กดเพื่ออัพโหลดรูป
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={1}
                style={{ width: '100%' }}
                onPress={() => (imageRequest ? setExImg(imageRequest) : {})}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Kanit-Regular',
                    color: imageRequest ? 'green' : 'red',
                    width: '50%',
                  }}
                >
                  {imageRequest ? imageRequest : 'ยังไม่ได้อัพโหลด'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ ...styles.bgTitle, marginTop: 30 }}>
              <Text style={styles.textBlue}>
                ใบเสร็จรับเงินประกันสังคมล่าสุด
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {imageSecure ? (
                <TouchableOpacity
                  onPress={
                    () => handleDelete('secure')
                    // setImageSecure(null)
                  }
                  style={styles.deleteImg}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular', color: '#fff' }}>
                    ลบ
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleUpload('secure')}
                  style={styles.buttonUpload}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular' }}>
                    กดเพื่ออัพโหลดรูป
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={1}
                style={{ width: '100%' }}
                onPress={() => (imageSecure ? setExImg(imageSecure) : {})}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Kanit-Regular',
                    color: imageSecure ? 'green' : 'red',
                    width: '50%',
                  }}
                >
                  {imageSecure ? imageSecure : 'ยังไม่ได้อัพโหลด'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ ...styles.bgTitle, marginTop: 30 }}>
              <Text style={styles.textBlue}>
                บัตรประกันสุขภาพ/ใบเสร็จจาก รพ.ของรัฐ
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {imageHealth ? (
                <TouchableOpacity
                  onPress={
                    () => handleDelete('health')
                    // setImageHealth(null)
                  }
                  // onPress={() => setImageHealth(null)}
                  style={styles.deleteImg}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular', color: '#fff' }}>
                    ลบ
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleUpload('health')}
                  style={styles.buttonUpload}
                >
                  <Text style={{ fontFamily: 'Kanit-Regular' }}>
                    กดเพื่ออัพโหลดรูป
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={1}
                style={{ width: '100%' }}
                onPress={() => (imageHealth ? setExImg(imageHealth) : {})}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Kanit-Regular',
                    color: imageHealth ? 'green' : 'red',
                    width: '50%',
                  }}
                >
                  {imageHealth ? imageHealth : 'ยังไม่ได้อัพโหลด'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
