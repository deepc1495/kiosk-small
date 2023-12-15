import {
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomBar from "../component/BottomBar";
import CountdownTimer from "../component/CountDown";
import {
  addDeviceId,
  deleteCartItem,
  deleteCasrtItem,
  getcartList,
} from "../helper/api/homeApi";
import Table from "../component/table";
import { successMessage } from "../helper/messages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlackBackArrow, QRLoader } from "../assets/svgIcons";
import Loader from "../component/loader";
import { useToast } from "react-native-toast-notifications";
import QRCode from "react-native-qrcode-svg";
import { Pusher } from "@pusher/pusher-websocket-react-native";
import { getAndroidId } from "react-native-device-info";

const Cart = ({ navigation }) => {
  const toast = useToast();
  const [cartData, setcartData] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [isEnglish, setisEnglish] = useState(true);
  const [showQRLoader, setshowQRLoader] = useState(false);
  const [paymentStatus, setpaymentStatus] = useState(0);
  const [deviceId, setdeviceId] = useState();
  const [permitUrl, setPermitUrl] = useState();
  //paymentstatus
  //  progress = 1,success = 2 ,failed = 3
  const [kioskId, setkioskId] = useState();
  const fetchData = async () => {
    const kiosk = await AsyncStorage.getItem("kioskId");
    setkioskId(kiosk);
    setisLoading(true);
    const user_id = await AsyncStorage.getItem("user_Id");
    const params = `user_id=${user_id}&kioskId=${kiosk}`;
    const data = await getcartList(params);
    setTimeout(() => {
      if (Number(data?.total_amount) < 1 || data?.success === false) {
        onPressBack()
      }
    }, 5000);
    setcartData(data);
    setisLoading(false);
    if (data?.success === false) {
      // toast.show(data.message, {
      //   type: "normal",
      //   placement: "bottom",
      //   duration: 4000,
      //   offset: 30,
      //   animationType: "zoom-in",
      // });
    }
  };

  useEffect(() => {
    getDevice();
    setTimeout(() => {
      if (Number(cartData?.total_amount) < 1) {
        onPressBack()
      }
    }, 5000);
  }, [cartData]);

  const pusher = Pusher.getInstance();

  const channelName = "dc-qr-channel";

  const getDevice = async () => {
    const test = await getAndroidId();
    const res = await addDeviceId(test);
    if (res.success) {
      await AsyncStorage.setItem("kioskId", JSON.stringify(res.kiosk_id));
      setdeviceId(res.kiosk_id);
      setPermitUrl(res.permit_url);
    } else {
      console.log("error");
    }
  };

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
      console.log("Pusher Cart ERROR: " + e);
    }
  };

  const onError = (message, code, error) => {
    console.log(`onError: ${message} code: ${code} exception: ${error}`);
  };

  const onEvent = async (event) => {
    const kioskId = await AsyncStorage.getItem("kioskId");
    if (event.eventName === "qr-event") {
      let eventData = JSON.parse(event.data);
      setshowQRLoader(true);
      if (
        eventData.method === "scan" &&
        eventData.cartId === cartData.cart.id &&
        Number(eventData.kiosk) === Number(kioskId)
      ) {
        setpaymentStatus(1);
      } else if (
        eventData.method === "payment" &&
        eventData.cartId === cartData.cart.id &&
        Number(eventData.kiosk) === Number(kioskId) &&
        eventData.status === "1"
      ) {
        setpaymentStatus(2);
      } else {
        setpaymentStatus(3);
      }
    }
  };

  const languagesSet = async () => {
    const lang = await AsyncStorage.getItem("language");
    setisEnglish(Number(lang) === 2 ? true : false);
  };

  useEffect(async () => {
    languagesSet();
    fetchData();
    const backAction = async () => {
      await pusher.unsubscribe({ channelName });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (cartData && cartData?.total_amount > 0) {
      connect();
    }
  }, [cartData]);

  const onChangeLanguage = (e) => {
    setisEnglish(Number(e) === 2 ? true : false);
  };

  const onPressHome = async () => {
    await pusher?.unsubscribe({ channelName });
    navigation?.navigate("Home");
  };

  const onPressCart = () => {
    navigation.navigate("cart");
  };

  const onTimeOut = async () => {
    await pusher.unsubscribe({ channelName });
    navigation.navigate("Home");
  };

  const onPressDelete = async (e) => {
    const user_id = await AsyncStorage.getItem("user_Id");
    // const data = `user_id/36326?id=${e.id}`
    var formdata = new FormData();
    formdata.append("_method", "DELETE");
    const url = `user_id/${user_id}?id=${e.id}`;
    const res = await deleteCartItem({ data: formdata, url: url });
    if (res.success) {
      toast.show("Item Removed Successfully", {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
      fetchData();
    } else {
      toast.show(res?.errors ?? res?.message, {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
    }
  };

  const onPressDeleteCart = async (e) => {
    const user_id = await AsyncStorage.getItem("user_Id");
    let formdata = new FormData();
    formdata.append("_method", "DELETE");
    const url = `user_id/${user_id}`;
    const res = await deleteCartItem({ data: formdata, url: url });
    if (res.success) {
      toast.show(res.message, {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
      fetchData();
    } else {
      toast.show(res.errors ?? res.message, {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
    }
  };

  const onPressBack = async()=>{
    await pusher.unsubscribe({ channelName });
    navigation.goBack()
  }

  return (
    <>
      {!showQRLoader ? (
        <View style={styles.container}>
          {cartData?.total_amount > 0 ? (
            <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
              <View style={{ marginTop: 100 }}>
                <Pressable
                  style={{ marginLeft: 20 }}
                  onPress={async () => {
                    await pusher.unsubscribe({ channelName }),
                      navigation.goBack();
                  }}
                >
                  <BlackBackArrow />
                </Pressable>
                {!isEnglish ? (
                  <Text style={styles.title}>إمسح الرمز</Text>
                ) : (
                  <Text style={styles.title}>Scan and Donate</Text>
                )}
              </View>
              <CountdownTimer initialSeconds={120} onTimeOut={onTimeOut} />
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <QRCode value={cartData["qr_url "]} size={200} />
              </View>
              <View>
                <Pressable
                  onPress={onPressDeleteCart}
                  style={{
                    backgroundColor: "#dc3645",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 14,
                    alignSelf: "center",
                  }}
                >
                  {/* <Text style={{ color: '#fff' }}>
              Empty Your cart / إفراغ سلة التسوق الخاصة بك
            </Text> */}
                  <Text style={{ color: "#fff" }}>
                    {isEnglish ? "Empty Your cart" : " إلغاء السلة"}
                  </Text>
                </Pressable>
              </View>
              <View>
                <View>
                  {/* <Table borderStyle={{borderColor: 'transparent'}}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              {tableData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={
                        cellIndex === 0 ? element(cellData, index) : cellData
                      }
                      textStyle={styles.text}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table> */}
                  <Table
                    data={cartData}
                    onDelete={onPressDelete}
                    isEnglish={isEnglish}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#f4f4f4",
                    paddingVertical: 20,
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}
                >
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text>{Number(cartData?.cart?.amount).toFixed(2)}</Text>
                  </View>
                  <View style={{ flex: 2, alignItems: "flex-end" }}>
                    {!isEnglish ? (
                      <Text>المبلغ الإجمالي</Text>
                    ) : (
                      <Text>Donation Amount</Text>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={{ marginTop: 100 }}>
              <Pressable
                style={{ marginLeft: 20 }}
                onPress={onPressBack}
              >
                <BlackBackArrow />
              </Pressable>
              {cartData?.total_amount > 0 &&
                (!isEnglish ? (
                  <Text style={styles.title}>مسح وتبرع</Text>
                ) : (
                  <Text style={styles.title}>Scan and Donate</Text>
                ))}

              <View style={{ marginTop: 50 }}>
                {!isEnglish ? (
                  <Text style={styles.title}>سلة التبرعات فارغة</Text>
                ) : (
                  <Text style={styles.title}>Donation basket is empty</Text>
                )}
              </View>
            </View>
          )}
          <BottomBar
            onPressHome={onPressHome}
            onPressCart={onPressCart}
            onChangeLanguage={onChangeLanguage}
            kioskId={kioskId}
            isEnglish={isEnglish}
            permitUrl={permitUrl}
          />
          <Loader loader={isLoading} />
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          {paymentStatus === 1 && (
            <View>
              <Image
                source={require("../assets/Ripple.gif")}
                style={{ width: 200, height: 200 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {isEnglish ? "Transaction in progress" : "العملية قيد الإجراء"}
              </Text>
              <Image
                source={{
                  uri: "https://kiosk.dubaicharity.org/assets/images/mobile-payment.png",
                }}
                style={{ width: 200, height: 200, marginVertical: 20 }}
              />
            </View>
          )}
          {paymentStatus === 2 && (
            <View>
              <Image
                source={require("../assets/success.jpg")}
                style={{ width: 300, height: 300, marginVertical: 20 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                {isEnglish
                  ? "Thank you for your donation"
                  : "شكرا لتبرعكم، تم الإنتهاء من عملية التبرع"}
              </Text>
            </View>
          )}
          {paymentStatus === 3 && (
            <View>
              <Image
                source={{
                  uri: "https://kiosk.dubaicharity.org/assets/images/reject.png",
                }}
                style={{ width: 300, height: 300, marginVertical: 20 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                {isEnglish
                  ? "You have cancelled the transaction"
                  : "تم إلغاء الطلب"}
              </Text>
            </View>
          )}
          <View style={{ marginTop: "15%" }}>
            <CountdownTimer
              initialSeconds={120}
              onTimeOut={onTimeOut}
              timerFont={40}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#36b0c9",
                padding: 15,
                borderTopRightRadius: 12,
                marginTop: 30,
                alignSelf: "center",
              }}
              onPress={async () => {
                await pusher.unsubscribe({ channelName });
                navigation.goBack();
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15 }}>
                {paymentStatus === 1
                  ? isEnglish
                    ? "Cancel"
                    : "إلغاء العملية"
                  : isEnglish
                    ? "Go to home"
                    : "الرجوع الى الصفحة الرئيسية"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  head: { height: 40, backgroundColor: "#fff", borderBottomWidth: 2 },
  text: { margin: 6, textAlign: "right" },
  row: { flexDirection: "row", backgroundColor: "#fff" },
  btn: {
    width: 58,
    height: 18,
    backgroundColor: "#78B7BB",
    borderRadius: 2,
    alignSelf: "flex-end",
  },
  btnText: { textAlign: "center", color: "#fff" },
});
