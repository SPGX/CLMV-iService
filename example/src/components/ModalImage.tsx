import { Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import { styles } from '../templates/theme';
import React, { FunctionComponent } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

// export default function ModalImage({ getImage, handleClose, cancel }) {
export type IModal = {
  cancel?: () => void;
  getImage?: any;
  handleGallery?: () => void;
  handleClose?: () => void;
};

const ModalImage: FunctionComponent<IModal> = ({
  getImage,
  handleClose,
  cancel,
}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <>
      <View style={styles.FlexCamera}>
        <View
          style={{
            height: windowHeight,
            width: windowWidth,
            position: 'relative',
          }}
        >
          <TouchableOpacity
            onPress={cancel}
            activeOpacity={1}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <View style={styles.borderCamera}>
                <TouchableOpacity
                  style={styles.IconClose}
                  onPress={handleClose}
                >
                  <Icon name="close" size={30} color="#4F8EF7" />
                  {/* <AntDesign name="close" size={30} color="#000" /> */}
                </TouchableOpacity>
                <Text style={styles.TextCamera}>ตัวอย่างรูปภาพ</Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: getImage
                        ? getImage
                        : 'https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png',
                    }}
                    style={{ width: 150, height: 150 }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ModalImage;
