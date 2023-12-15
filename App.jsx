/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import RNRestart from 'react-native-restart'; // Import package from node modules

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import AppNavigation from './screen/AppNavigation';
import { ToastProvider } from 'react-native-toast-notifications'
import { PaperProvider } from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import NoInternet from './screen/component/NoInternet';
import { Pusher } from "@pusher/pusher-websocket-react-native";
import { getAndroidId } from 'react-native-device-info';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const [isConnected, setIsConnected] = useState(true);
  const [showNoInternet, setshowNoInternet] = useState(false)
  const [networkType, setNetworkType] = useState()


  const unsubscribe = ()=> NetInfo.addEventListener(state => {
    setIsConnected(state.isConnected);
  });

  setTimeout(() => {
    unsubscribe();

  }, 10000);

  useEffect(() => {
    if (!isConnected) {
      setshowNoInternet(true)
    }
  }, [isConnected]);

  const hideNoInternet = () => {
    setshowNoInternet(false)
  }

  const pusher = Pusher.getInstance();
  const channelName = "dc-qr-channel";

  const connect = async () => {
    try {
      await pusher.init({
        apiKey: "f64964a3f456b02f0230",
        cluster: "ap2",
        onError,
        onEvent,
      });

      await pusher.connect();
      await pusher.subscribe({
        channelName,
        onEvent: (event) => {
          console.log(`Got channel event: ${event}`);
        },
      });
    } catch (e) {
      console.log("Pusher ERROR: ", e);
    }
  };

  const onError = (message, code, error) => {
    console.log(`onError: ${message} code: ${code} exception: ${error}`);
  };

  const onEvent = async (event) => {
    if (event.eventName === "refresh-event-1") {
      RNRestart.Restart()
    }
  };

  useEffect(async() => {
    const DeviceId = await getAndroidId()

    const intervalId = setInterval(() => {
      fetch(`https://kiosk.dubaicharity.org/live-cache?android_id=${DeviceId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('live-cache',data)
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }, 180000);
    connect()

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); 
 

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: '#fff' }]}>
      <StatusBar
        barStyle={'dark-content'}
      />
      <PaperProvider>
        <ToastProvider
          renderType={{
            custom_type: (toast) => (
              <View style={{ padding: 15, backgroundColor: 'grey' }}>
                <Text>{toast.message}</Text>
              </View>
            )
          }}
          style={{ marginBottom: 155 }}
        >
          {!showNoInternet ? <AppNavigation /> : isConnected && showNoInternet ? <NoInternet setshowNoInternet={hideNoInternet} /> : <NoInternet setshowNoInternet={hideNoInternet} />}
        </ToastProvider>
      </PaperProvider>
    </SafeAreaView>
  );
}

export default App;
