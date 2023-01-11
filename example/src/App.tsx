import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScannerScreen from './screens/Scanner';
import HomeScreen from './screens/Home';
import ResultViewerScreen from './screens/ResultViewer';
import CropperScreen from './screens/Cropper';
import LoginScreen from './screens/auth/login';
import HomeScreen1 from './screens/index';
import DetailScreen from './screens/details/index';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='login' screenOptions={{headerShown: false}}>
				<Stack.Screen name='Home' component={HomeScreen} options={{headerLeft: () => null, headerBackVisible: false}} />
				<Stack.Screen name='Scanner' component={ScannerScreen} />
				<Stack.Screen name='Cropper' component={CropperScreen} />
				<Stack.Screen name='ResultViewer' component={ResultViewerScreen} />
				{/* <Stack.Screen name="check" component={CheckScreen} /> */}
				<Stack.Screen name='login' component={LoginScreen} />
				<Stack.Screen
					name='home1'
					component={HomeScreen1}
					options={{
						headerBackVisible: false,
						gestureEnabled: true,
					}}
				/>
				<Stack.Screen name='detail' component={DetailScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
