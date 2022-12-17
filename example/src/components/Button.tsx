import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity } from 'react-native';

export type IButton = {
  bg: any;
  text?: string;
  c?: string;
  onPress?: () => void;
};

// export default function Button({ bg, text, c, onPress }) {
const Button: FunctionComponent<IButton> = ({ bg, text, c, onPress }) => {
  return (
    <>
      <TouchableOpacity
        onPressIn={onPress}
        style={{
          backgroundColor: `${bg ? bg : 'green'}`,
          width: '100%',
          borderRadius: 5,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: `${c ? c : 'white'}`,
            fontFamily: 'Kanit-Regular',
          }}
        >
          {text ? text : ''}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default Button;
