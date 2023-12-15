/* eslint-disable prettier/prettier */
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import FastImage from 'react-native-fast-image'

import React, { useEffect, useRef, useState } from "react";
import BottomBar from "../component/BottomBar";
// import BottomBar from './component/BottomBar';
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
  LANDSCAPE_LEFT,
} from "react-native-orientation-locker";
import {
  AddToDonate,
  addDeviceId,
  getContribute,
  getCoupanList,
  getHomeSlider,
  getProjectList,
} from "../helper/api/homeApi";
import SwiperFlatList from "react-native-swiper-flatlist";
import CoupanAddItemModal from "../component/coupanAddItemModal";
import { getAndroidId } from "react-native-device-info";
import Loader from "../component/loader";
import { useToast } from "react-native-toast-notifications";
import { NextIcon, PrevIcon } from "../assets/svgIcons";
import { SvgUri } from "react-native-svg";
// import { Modal } from 'react-native-paper';

const Home = ({ navigation }) => {
  const toast = useToast();
  const windowDimensions = useWindowDimensions();
  const [isPortrait, setIsPortrait] = useState(false);
  const [bannerImg, setbannerImg] = useState([]);
  const [CoupanList, setCoupanList] = useState([]);
  const [showcoupanModal, setshowcoupanModal] = useState(false);
  const [projectList, setprojectList] = useState([]);
  const [deviceId, setdeviceId] = useState();
  const [isLoading, setisLoading] = useState(false);

  const [contributeData, setcontributeData] = useState([]);
  const [contributeNumber, setcontributeNumber] = useState();
  const [isEnglish, setisEnglish] = useState(true);
  const [permitUrl, setPermitUrl] = useState();
  const [coupanData, setcoupanData] = useState();

  useEffect(() => {
    if (windowDimensions.width > windowDimensions.height) {
      setIsPortrait(false);
    }
    getDevice();
  }, [navigation]);

  

  const fetchdata = async (id) => {
    setisLoading(true);
    languagesSet();
    getBanner(id);
  };

  const getDevice = async () => {
    setisLoading(true);
    const test = await getAndroidId();
    const res = await addDeviceId(test);
    if (res.success) {
      await AsyncStorage.setItem("kioskId", JSON.stringify(res.kiosk_id));
      setdeviceId(res.kiosk_id);
      setPermitUrl(res.permit_url);
      fetchdata(res.kiosk_id);
    } else {
      setisLoading(false);
    }
  };

  const getBanner = async (id) => {
    const data = await getHomeSlider(id);
    if (data.success) {
      setbannerImg(data.data);
    }
    getProjectListData(id);
  };
  const getCoupan = async (id) => {
    const data = await getCoupanList(id);
    if (data.success) {
      setCoupanList(data?.data);
    }
    setisLoading(false);
  };
  const getProjectListData = async (id) => {
    const data = await getProjectList(id);
    if (data.success) {
      setprojectList(data.data);
    }
    getContributeDonatetData(id);
  };

  const getContributeDonatetData = async (id) => {
    const data = await getContribute(id);
    if (data.success) {
      setcontributeData(data.data);
      const newArr = Number(data.data.length) / 4;
      const newData = new Array(Math.floor(newArr)).fill(0);
      setcontributeNumber(newData);
    }
    getCoupan(id);
  };

  const languagesSet = async () => {
    const lang = await AsyncStorage.getItem("language");
    setisEnglish(Number(lang) === 2 ? true : false);
  };

  const onChangeLanguage = (e) => {
    setisEnglish(Number(e) === 2 ? true : false);
  };

  const renderBanner = ({ item, index }) => {
    return (
      <Pressable
        style={styles.bannerView}
        onPress={() => {
          navigation.navigate("charityProject", {
            projectId: item.id,
            category: item.category,
          });
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Image source={{ uri: item.category_icon }} resizeMode='contain' style={{ height:80,width:80,backgroundColor:'#ecf6f9',borderRadius:100}} /> */}
          <SvgUri width={80} height={80} source={{ uri: item.category_icon }} />
          <SvgUri width={80} height={80} uri={item.category_icon} />
        </View>
        <View style={{ paddingVertical: 5 }}>
          {!isEnglish && (
            <Text style={styles.bannerText}>{item.category_arabic}</Text>
          )}
          {isEnglish && <Text style={styles.bannerText}>{item.category}</Text>}
        </View>
      </Pressable>
    );
  };

  const onDonateContribute = async ({ amt, item }) => {
    const userId = await AsyncStorage.getItem("user_Id");
    let url = `?id=${item.id}&name=${
      isEnglish ? item.donation_categories : item.donation_categories_arabic
    }&quantity=${1}&amount=${amt}&kioskId=${deviceId}&item_type=3`;
    if (userId) {
      url = `?id=${item.id}&name=${
        isEnglish ? item.donation_categories : item.donation_categories_arabic
      }&quantity=${1}&amount=${amt}&kioskId=${deviceId}&userId=${userId}&item_type=3`;
    }

    const res = await AddToDonate(url);
    if (res.success) {
      toast.show("Redirecting to Cart...", {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
      const uId = res.data?.user_id;
      const newData = JSON.stringify(uId);
      if (uId && !userId) {
        await AsyncStorage.setItem("user_Id", newData);
      }
      setTimeout(() => {
        navigation.navigate("cart");
      }, 2000);
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

  const ContributeCharity = ({ item, index }) => {
    return (
      <LinearGradient
        key={index}
        colors={["rgba(54,176,201,1)", "rgba(101,186,175,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0 }}
        style={[
          styles.cardView,
          {
            flex: 1,
            width: windowDimensions.width / 2 - 20,
            marginHorizontal: 10,
            paddingVertical: 20,
            paddingBottom: 25,
          },
        ]}
      >
        {/* <View > */}
        <View>
          <View style={{ marginBottom: 10 }}>
            {!isEnglish ? (
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {item.donation_categories_arabic}
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {item.donation_categories}
              </Text>
            )}
          </View>
          <View>
            <View style={styles.cardNumberView}>
              {[100, 50, 20, 10].map((v, i) => {
                // const item = item
                return (
                  <TouchableOpacity
                    style={styles.cardNumberBlock}
                    onPress={() => {
                      onDonateContribute({ amt: v, item: item });
                    }}
                    key={i}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: 12,
                        color: "#000",
                      }}
                    >
                      {v}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.cardNumberView}>
              {[2000, 1000, 500, 200].map((v, i) => {
                return (
                  <TouchableOpacity
                    style={styles.cardNumberBlock}
                    onPress={() => {
                      onDonateContribute({ amt: v, item: item });
                    }}
                    key={i}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: 12,
                        color: "#000",
                      }}
                    >
                      {v}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        {/* </View> */}
      </LinearGradient>
    );
  };

  const onPressHome = () => {
    navigation.navigate("Home");
  };

  const onPressCart = () => {
    navigation.navigate("cart");
  };


  const CoupanItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.donateBannerContainer}
        onPress={() => {
          setcoupanData(item), setshowcoupanModal(true);
        }}
      >
       {/* {item.image && <Image
       resizeMode="stretch"
          source={{uri: item.image}}
          style={[
            styles.banner,
            styles.donateBanner,
            {
              height: isPortrait
                ? Platform.isTV
                  ? 250
                  : 180
                : Platform.isTV
                  ? 250
                  : 150,
            },
          ]}
        />} */}
         <FastImage
        style={{ width: '90%', height: 180 }}
        source={{
            uri: item.image,
            priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.stretch}
    />
        {/* <Image source={{uri:item.image}} style={{height:180,width:'90%'}}/> */}
        <LinearGradient
          colors={["rgba(54,176,201,1)", "rgba(101,186,175,1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.donateBtn}
        >
          {/* <Text style={styles.donateBtnText}>Donate Now</Text>
          <Text style={styles.donateBtnText}>تبرع الآن</Text> */}
          <Text style={styles.donateBtnText}>
            {isEnglish ? "Donate Now" : "تبرع الآن"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const [contributeIndex, setcontributeIndex] = useState(0);
  const onchangeIndex = (e) => {
    setcontributeIndex(e.index);
  };

  const swiperRef = useRef(null);
  const swipeToNextItem = () => {
    if (swiperRef.current && Number(swiperRef.current.getCurrentIndex()).toFixed(1) < 1.1) {
      swiperRef.current.scrollToIndex({
        index: swiperRef.current.getCurrentIndex()+ 0.5,
        animated: true,
      });
    }
  };

  // Function to swipe to the previous item in the swiper
  const swipeToPreviousItem = () => {
    if (swiperRef.current && swiperRef.current.getCurrentIndex() > 0) {
  
        swiperRef.current.scrollToIndex({
          index: swiperRef.current.getCurrentIndex() - 0.5,
          animated: true,
        });
      
    }
    
  };

  const [showHelpVedio, setshowHelpVedio] = useState(false);

  const onHelp = () => {
    setshowHelpVedio(!showHelpVedio);
  };
  return (
    <>
      <OrientationLocker
        orientation={!Platform.isTV ? PORTRAIT : LANDSCAPE}
        onChange={(orientation) => {
          setIsPortrait(
            orientation === PORTRAIT ? (Platform.isTV ? false : true) : false
          );
        }}
        onDeviceChange={(orientation) => {
          setIsPortrait(
            orientation === PORTRAIT ? (Platform.isTV ? false : true) : false
          );
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 210 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <SwiperFlatList
            autoplay
            autoplayDelay={10}
            autoplayLoop
            initialScrollIndex={0}
            showPagination={true}
            paginationStyle={{ marginBottom: -5 }}
            paginationActiveColor="#5CB8B5"
            paginationStyleItemActive={{ width: 10, height: 10 }}
            paginationStyleItem={{ width: 8, height: 8 }}
            data={bannerImg}
            renderItem={({ item }) => (
              // <Image
              //   resizeMode="stretch"
              //   source={
              //     item.desktopimage
              //       ? { uri: item.desktopimage }
              //       : require("../assets/banner.jpeg")
              //   }
              //   style={[
              //     styles.banner,
              //     !isPortrait && {
              //       height: Platform.isTV || Platform.isPad ? 350 : 230,
              //     },
              //   ]}
              // />
              <FastImage
              style={[
                    styles.banner,
                    !isPortrait && {
                      height: Platform.isTV || Platform.isPad ? 350 : 230,
                    },
                  ]}
              source={{
                  uri: item.desktopimage,
                  priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.stretch}
          />
            )}
          />
        </View>
        <View style={{ marginVertical: 15 }}>
          {/* <Text style={styles.title}>تبرع لمشاريع خيرية</Text>
          <Text style={styles.title}>Donate for Charity Projects</Text> */}
          <Text style={styles.title}>
            {isEnglish ? "Donate for Charity Projects" : "مشاريعنا الخيرية"}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={swipeToPreviousItem}
            style={{ position: "absolute", left: 5 }}
           
          >
            {/* <LinearGradient
              colors={['rgba(54,176,201,1)', 'rgba(101,186,175,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 10, borderRadius: 30 }}
            > */}
            <View style={{ padding: 10, borderRadius: 30 }}>
              <PrevIcon />
            </View>

            {/* </LinearGradient> */}
          </TouchableOpacity>
          <View style={{ width: useWindowDimensions().width - 100 }}>
            <SwiperFlatList
              ref={swiperRef}
              data={projectList}
              renderItem={renderBanner}
              keyExtractor={(item, index) => index}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
              }}
              // disableGesture={true}
              // showPagination={true}  
            />
            
           
          </View>
          <TouchableOpacity
            onPress={swipeToNextItem}
            style={{ position: "absolute", right: 5 }}
          >
            {/* <LinearGradient
              colors={['rgba(54,176,201,1)', 'rgba(101,186,175,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 10, marginLeft: 5, borderRadius: 30 }}
            > */}
            <View style={{ padding: 10, marginLeft: 5, borderRadius: 30 }}>
              <NextIcon />
            </View>
            {/* </LinearGradient> */}
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 10, marginTop: 15 }}>
          {/* <Text style={styles.title}>المساهمة في الأعمال الخيرية</Text>
          <Text style={styles.title}>Contribute to Charity</Text> */}
          <Text style={styles.title}>
            {isEnglish
              ? "Contribute to Charity"
              : "المساهمة في الأعمال الخيرية"}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            // backgroundColor: "red",
          }}
        >
          <SwiperFlatList
            // autoplay
            // autoplayDelay={10}
            // autoplayLoop
            // index={2}
            onChangeIndex={onchangeIndex}
            data={contributeNumber}
            renderItem={({ item, i }) => (
              <View style={{ backgroundColor: "#fff" }}>
                <FlatList
                  data={contributeData.slice(
                    contributeIndex * 4,
                    contributeIndex * 4 + 4
                  )}
                  renderItem={ContributeCharity}
                  keyExtractor={(item, index) => index}
                  showsHorizontalScrollIndicator={false}
                  // horizontal
                  numColumns={2}
                  style={{ alignSelf: "flex-start" }}
                  contentContainerStyle={{ backgroundColor: "#fff" }}
                />
              </View>
            )}
            style={{ paddingHorizontal: 0 }}
          />
        </View>
        <View style={{ marginVertical: 10, marginBottom: 15 }}>
          {/* <Text style={styles.title}>التبرع بالكوبون</Text>
          <Text style={[styles.title]}>Coupon Donation</Text> */}
          <Text style={[styles.title]}>
            {isEnglish ? "Coupon Donation" : "التبرع بالكوبون"}
          </Text>
        </View>
        <View>
          <View style={{ alignSelf: "center", marginBottom: 20 }}>
            {CoupanList?.length === 0 && (
              <Text style={{ color: "#000", textAlign: "center" }}>
                {isEnglish ? "No Data Found" : "لاتوجد بيانات"}
              </Text>
            )}
            <Carousel
              layout={"tinder"}
              layoutCardOffset={`2`}
              data={CoupanList}
              renderItem={CoupanItem}
              sliderWidth={windowDimensions.width - 30}
              itemWidth={windowDimensions.width - 30}
              autoplay={true}
              loop={true}
              autoplayInterval={10000}
            />
          </View>
        </View>
      </ScrollView>

      <BottomBar
        onPressHome={onPressHome}
        onPressCart={onPressCart}
        onChangeLanguage={onChangeLanguage}
        showLanguage={true}
        onHelp={onHelp}
        kioskId={deviceId}
        isEnglish={isEnglish}
        permitUrl={permitUrl}
      />
      {showcoupanModal && (
        <CoupanAddItemModal
          coupanData={coupanData}
          setshowcoupanModal={setshowcoupanModal}
          navigation={navigation}
          kioskId={deviceId}
          isEnglish={isEnglish}
        />
      )}
      <Loader loader={isLoading} />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    // width: '100%',
    width: Dimensions.get("screen").width,
    height: Platform.isTV ? 350 : 250,
    // height:'auto'
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    color: "#000",
  },
  bannerView: {
    // backgroundColor: 'red',
    width: 140,
    // width: Platform.isTV ? Dimensions.get('screen').width / 3 : Dimensions.get('screen').width / 3 - 20,
    // height: Platform.isTV ? Dimensions.get('screen').width / 3 * 0.8 : Dimensions.get('screen').width / 3,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    // marginHorizontal: 10,
  },
  bannerImages: {
    width: "100%",
    height: Platform.isTV ? "70%" : "50%",
    borderBottomRightRadius: 120,
  },
  bannerText: {
    fontSize: Platform.isTV ? 18 : 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#000",
  },
  cardView: {
    backgroundColor: "#5CB8B5",
    // width: Platform.isPad || Platform.isTV ? Dimensions.get('window').width/2 - 30 : Dimensions.get('window').width - 50,
    // height: Dimensions.get('window').width * 0.5,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
    marginVertical: 5,
    padding: 5,
    paddingVertical: 10,
    flex: 1,
    display: "flex",
  },
  cardNumberView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    paddingHorizontal: 50,
  },
  cardNumberBlock: {
    backgroundColor: "#fff",
    padding: 5,
    width: 50,
    borderRadius: 7,
    marginHorizontal: 5,
  },
  donateBannerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
  },
  donateBtn: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
    backgroundColor: "#5CB8B5",
    width: Platform.isTV ? 100 : 90,
  },
  donateBtnText: {
    color: "#fff",
    fontSize: Platform.isTV ? 16 : 12,
    fontWeight: "700",
    textAlign: "center",
  },
  donateBanner: { alignSelf: "center", width: "95%", height: "100%" },
  contentBlock: {
    // height: 300,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    width: Dimensions.get("window").width,
    padding: 20,
    borderWidth: 1,
  },
});
