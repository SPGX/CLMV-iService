import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as DDN from 'vision-camera-dynamsoft-document-normalizer';
import type { Point } from 'vision-camera-dynamsoft-document-normalizer';
import Svg, { Polygon, Rect } from 'react-native-svg';
import type { PhotoFile } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

// export default function CropperScreen({ route, navigation }) {
export type ICropperScreen = {
  route: any;
  navigation: any;
};

const CropperScreen: React.FunctionComponent<ICropperScreen> = ({
  navigation,
  route,
}) => {
  const isFocused = useIsFocused();
  const svgElement = useRef<Svg>(null);
  const [photoPath, setPhotoPath] = useState<string | undefined>();
  const [viewBox, setViewBox] = useState<string | undefined>();
  const [pointsData, setPointsData] = useState<string | undefined>();
  const pointsRef = useRef<Point[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const startX = useRef(-1);
  const startY = useRef(-1);
  useEffect(() => {
    if (route.params.photo) {
      let photo: PhotoFile = route.params.photo;
      setPhotoPath(photo.path);
      updateViewBox(photo);
      detectFile(photo.path);
    }
  }, []);

  const updateViewBox = (photo: PhotoFile) => {
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;

    let rotated = false; // image is rotated for display

    if (photo.width > photo.height && screenWidth < screenHeight) {
      rotated = true;
    }
    if (photo.width < photo.height && screenWidth > screenHeight) {
      rotated = true;
    }

    let viewBoxValue = '';
    if (rotated) {
      viewBoxValue = '0 0 ' + photo.height + ' ' + photo.width;
    } else {
      viewBoxValue = '0 0 ' + photo.width + ' ' + photo.height;
    }

    setViewBox(viewBoxValue);
  };

  const detectFile = async (path: string) => {
    let results = await DDN.detectFile(path);
    if (results.length > 0 && results[0]) {
      pointsRef.current = results[0].location.points;
      updatePointsData();
    }
  };

  const updatePointsData = () => {
    let points = pointsRef.current;
    if (points && points[0] && points[1] && points[2] && points[3]) {
      let data = points[0].x + ',' + points[0].y + ' ';
      data = data + points[1].x + ',' + points[1].y + ' ';
      data = data + points[2].x + ',' + points[2].y + ' ';
      data = data + points[3].x + ',' + points[3].y;
      setPointsData(data);
    }
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [isFocused]);

  const retake = () => {
    navigation.goBack();
  };

  const back = () => {
    navigation.goBack();
    navigation.goBack();
  };

  const okay = () => {
    if (pointsRef.current) {
      navigation.navigate({
        params: { photoPath: photoPath, points: pointsRef.current },
        name: 'ResultViewer',
      });
    }
  };

  const verticeSize = () => {
    const size = 100;
    let photoWidth: any = viewBox?.split(' ')[2];
    if (photoWidth) {
      photoWidth = parseInt(photoWidth);
      return size / (1920 / photoWidth);
    } else {
      return size;
    }
  };

  const strokeWidth = (selected: boolean) => {
    let width;
    if (selected) {
      width = 24;
    } else {
      width = 12;
    }
    let photoWidth: any = viewBox?.split(' ')[2];
    if (photoWidth) {
      photoWidth = parseInt(photoWidth);
      return width / (1920 / photoWidth);
    } else {
      return width;
    }
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    let offsetX = e.nativeEvent.locationX - startX.current;
    let offsetY = e.nativeEvent.locationY - startY.current;
    offsetX = convertCoordinate(offsetX, true);
    offsetY = convertCoordinate(offsetY, false);
    if (selectedIndex != -1) {
      let points = pointsRef.current;
      let point = points[selectedIndex];
      if (point) {
        let newPoint = { x: 0, y: 0 };
        newPoint.x = point.x + offsetX;
        newPoint.y = point.y + offsetY;
        points[selectedIndex] = newPoint;
        updatePointsData();
      }
    }
  };

  const onTouchStart = (e: GestureResponderEvent) => {
    startX.current = e.nativeEvent.locationX;
    startY.current = e.nativeEvent.locationY;
    //console.log(e);
  };

  const convertCoordinate = (value: number, isX: boolean) => {
    let photoWidth = parseInt(viewBox?.split(' ')[2] as any);
    let photoHeight = parseInt(viewBox?.split(' ')[3] as any);
    let xPercent = Dimensions.get('window').width / photoWidth;
    let yPercent = Dimensions.get('window').height / photoHeight;
    if (isX) {
      return value * xPercent;
    } else {
      return value * yPercent;
    }
  };

  // const convertCoordinate2 = (value: number, isX: boolean) => {
  //   if (svgElement.current) {
  //     let CTM = svgElement.current.getScreenCTM();
  //     if (isX) {
  //       return (value - CTM.e) / CTM.a;
  //     } else {
  //       return (value - CTM.f) / CTM.d;
  //     }
  //   }
  //   return value;
  // };

  const getVerticeOffsetX = (index: number) => {
    let size = verticeSize();
    if (index === 0) {
      return -size;
    } else if (index === 3) {
      return -size;
    }
    return 0;
  };

  const getVerticeOffsetY = (index: number) => {
    let size = verticeSize();
    if (index === 0) {
      return -size;
    } else if (index === 1) {
      return -size;
    }
    return 0;
  };

  return (
    <SafeAreaView
      onTouchStart={(e) => onTouchStart(e)}
      onTouchMove={(e) => onTouchMove(e)}
      style={styles.container}
    >
      <View
        style={{
          width: '50%',
          height: '30%',
          position: 'absolute',
          top: 0,
          zIndex: 999,
        }}
      >
        <TouchableOpacity style={{ flex: 0.5 }}>
          <TouchableOpacity onPress={back} style={styles.button}>
            <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }}>
              ย้อนกลับ
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      {photoPath != undefined &&
        pointsData != undefined &&
        viewBox != undefined && (
          <>
            <Image
              style={StyleSheet.absoluteFill}
              source={{ uri: 'file://' + photoPath }}
            />
            <Svg
              ref={svgElement}
              preserveAspectRatio="xMidYMid slice"
              style={StyleSheet.absoluteFill}
              viewBox={viewBox}
            >
              <Polygon
                points={pointsData}
                fill="lime"
                stroke="green"
                opacity="0.3"
                strokeWidth="1"
              />
              {pointsRef.current.map((point, idx) => (
                <Rect
                  key={idx}
                  x={point.x + getVerticeOffsetX(idx)}
                  y={point.y + getVerticeOffsetY(idx)}
                  width={verticeSize()}
                  height={verticeSize()}
                  fill="rgba(0,255,0,0.3)"
                  stroke="green"
                  strokeWidth={strokeWidth(idx == selectedIndex)}
                  onPressIn={() => setSelectedIndex(idx)}
                />
              ))}
            </Svg>
          </>
        )}

      <View style={styles.control}>
        <View style={{ flex: 0.5 }}>
          <TouchableOpacity onPress={retake} style={styles.button}>
            <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }}>
              ถ่ายใหม่
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.5 }}>
          <TouchableOpacity onPress={okay} style={styles.buttonOut}>
            <Text style={{ fontSize: 15, color: 'white', alignSelf: 'center' }}>
              ถัดไป
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  control: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    height: '15%',
    width: '100%',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  radioContainer: {
    flex: 0.7,
    padding: 5,
    margin: 3,
  },
  buttonContainer: {
    flex: 0.3,
    padding: 5,
    margin: 3,
  },
  button: {
    backgroundColor: 'ghostwhite',
    // borderColor: 'black',
    // borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    margin: 5,
  },
  buttonOut: {
    backgroundColor: '#2F8DE4',
    // borderColor: 'black',
    // borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    margin: 5,
  },
  image: {
    resizeMode: 'contain',
  },
});

export default CropperScreen;
