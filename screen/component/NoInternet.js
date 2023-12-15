import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import VideoPlayer from 'react-native-video-player'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from "@react-native-community/netinfo";

const NoInternet = (props) => {
    const [lang, setlang] = useState(1)
    useEffect(async () => {
        const language = await AsyncStorage.getItem('language')
        if (language === '2') {
            setlang(2)
        } else {
            setlang(1)
        }
    }, [])

    const [isConnected, setIsConnected] = useState(false);

    const unsubscribe = () => NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
    });

    setTimeout(() => {
        unsubscribe();
    }, 10000);

    useEffect(() => {
        if (isConnected) {
            setTimeout(() => {
                props.setshowNoInternet(false)
            }, 10000);
        }
    }, [isConnected]);


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../assets/ai.gif')} style={{ width: 300, height: 300 }} />

            <View style={{ alignItems: 'center', marginTop: 0 }}>
              {!isConnected &&  <>
                {lang === 1 ? <Text style={{ fontSize: 22, marginHorizontal: 30, textAlign: 'center' }}>Hello, I am your AI assistant representing Dubai Charity. I am currently addressing an internet problem with this kiosk. Please bear with me for a moment.</Text> :
                    <Text style={{ fontSize: 22, marginHorizontal: 30, textAlign: 'center' }}>أهلاً بك، أنا المساعد الذكي من جمعية دبي الخيرية، أعمل حالياً على حل مشكلة الإنترنت في هذا الجهاز. أرجو منك الانتظار لبضع دقائق.</Text>}
                </>}
                {isConnected && <>
                {lang === 1 ? <Text style={{ fontSize: 22, marginVertical: 10 }}>I have fixed the issue, Launching App...</Text> :
                    <Text style={{ fontSize: 22, marginVertical: 10 }}> لقد أصلحت المشكلة، سيتم فتح التطبيق...</Text>
                }
                 </>}

            </View>
        </View>
    )
}

export default NoInternet

const styles = StyleSheet.create({})