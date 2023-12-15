import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { AddToDonate } from '../helper/api/homeApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';


const CoupanAddItemModal = (props) => {
  const toast = useToast()
  const data = props.coupanData ?? ''
  const [quantityNumber, setquantityNumber] = useState(1)
  const [totalPrice, settotalPrice] = useState(data.price ? parseInt(data.price) : 0)

  const onChangeTotalQty = member => {
    if (member === 'plus') {
      setquantityNumber(quantityNumber + 1);
      settotalPrice(parseInt(data.price) * (quantityNumber + 1))
    } else {
      if (quantityNumber > 1) {
        setquantityNumber(quantityNumber - 1);
        settotalPrice(parseInt(data.price) * (quantityNumber - 1))
      }
    }
  };



  const doneteNow = async () => {
    const userId = await AsyncStorage.getItem('user_Id')
    if (data.donation_categories_arabic === null) {
      donation_name = data.donation_categories
    } else {
      donation_name = data.donation_categories_arabic
    }
    let url = `?id=${data.id}&name=${donation_name}&quantity=${quantityNumber}&amount=${data.price}&item_type=3`
    if (userId) {
      url = `?id=${data.id}&name=${donation_name}&quantity=${quantityNumber}&kioskId=${props.kioskId}&userId=${userId}&amount=${data.price}&item_type=3`
    }
    const res = await AddToDonate(url)
    if (res.success) {
      toast.show('Add To Cart Successfully', {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
      const uId = res.data.user_id
      const newData = JSON.stringify(uId)
      if (uId && !userId) {
        await AsyncStorage.setItem('user_Id', newData);
      }
      props.navigation.navigate('cart')
    } else {
      toast.show(res.errors ?? res.message, {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
    }
    props.setshowcoupanModal(false)
  }
  return (
    <View style={styles.contentBlock}>
      <Text style={{ textAlign: 'center', color: '#000' }}>{
        props.isEnglish ? data.donation_categories
          : !props.isEnglish && data.donation_categories_arabic == null ? data.donation_categories
            : data.donation_categories_arabic
      }</Text>
      <Image source={require('../assets/3man.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Pressable onPress={() => { onChangeTotalQty('minus') }}>

          <Image source={require('../assets/minus.png')} style={{ width: 35, height: 35 }} />
        </Pressable>
        <Text style={{ marginHorizontal: '5%', fontSize: 20, color: '#000' }}>{quantityNumber}</Text>
        <Pressable onPress={() => { onChangeTotalQty('plus') }}>
          <Image source={require('../assets/plus.png')} style={{ width: 35, height: 35 }} />
        </Pressable>
      </View>
      <View>
        <Text style={{ textAlign: 'center', fontSize: 22, color: '#000', marginVertical: 20 }}>AED {totalPrice > 0 ? totalPrice : '00'}.00</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: '#d73a4a', padding: 7, marginHorizontal: 2, borderRadius: 5 }} onPress={() => { props.setshowcoupanModal(false) }}>
          <Text style={{ color: '#fff' }}>إلغاء/ Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#65b8b0', padding: 7, marginHorizontal: 2, borderRadius: 5 }} onPress={() => { doneteNow() }}>
          <Text style={{ color: '#fff' }}>تبرع/Donate</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CoupanAddItemModal

const styles = StyleSheet.create({
  contentBlock: {
    // height: 300,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    width: Dimensions.get('window').width,
    padding: 20,
    borderWidth: 1,
  },
})