import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomBar from "../component/BottomBar";
import { Dropdown, SelectCountry } from "react-native-element-dropdown";
import {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
} from "react-native-orientation-locker";
import {
  AddToDonate,
  getCountryList,
  getProjectItemList,
} from "../helper/api/homeApi";
import { BackArrow } from "../assets/svgIcons";
import Loader from "../component/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { Divider } from "react-native-paper";
import FastImage from "react-native-fast-image";

const CharityProject = ({ route, navigation }) => {
  const toast = useToast();
  const { projectId, category } = route.params;
  const [isPortrait, setIsPortrait] = useState(true);
  const windowDimensions = useWindowDimensions();
  const [itemListData, setitemListData] = useState([]);
  const [countryList, setcountryList] = useState([]);
  const [country, setCountry] = useState(0);
  const [isLoading, setisLoading] = useState(true);
  const [isEnglish, setisEnglish] = useState(true);
  const [kioskId, setkioskId] = useState();
  useEffect(() => {
    if (windowDimensions.width > windowDimensions.height) {
      setIsPortrait(false);
    }
    languagesSet();
    fetchKioskId();
    fetchCountry();
  }, [navigation]);

  const fetchKioskId = async () => {
    const kiosk = await AsyncStorage.getItem("kioskId");
    setkioskId(kiosk);
  };

  const languagesSet = async () => {
    const lang = await AsyncStorage.getItem("language");
    setisEnglish(Number(lang) === 2 ? true : false);
  };

  useEffect(() => {
    fetchItem();
  }, [country]);

  const onChangeLanguage = (e) => {
    setisEnglish(Number(e) === 2 ? true : false);
  };

  const [arabicCountryList, setArabicCountryList] = useState([]);

  const fetchCountry = async () => {
    // setisLoading(true)
    let url = `?category=${projectId}`;
    const res = await getCountryList(url);
    if (res.success) {
      const newData = res.data.map((e, i) => {
        const countrylst = { label: `${e.name_arabic}`, value: e.id };
        return countrylst;
      });

      const newDataEnglish = res.data.map((e, i) => {
        const countrylst = { label: `${e.name_english}`, value: e.id };
        return countrylst;
      });
      setcountryList(newDataEnglish);
      setArabicCountryList(newData);
    }
    // setisLoading(false)
  };

  const fetchItem = async () => {
    setisLoading(true);
    let url = `?category=${projectId}`;
    if (Number(country) > 0) {
      url = `?category=${projectId}&country=${country}`;
    }
    const res = await getProjectItemList(url);
    if (res.success) {
      if (res.data.length > 0) {
        setitemListData(res.data);
      } else {
        toast.show(isEnglish ? "No Data Found" : "لاتوجد بيانات", {
          type: "normal",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "zoom-in",
        });
      }
      setTimeout(() => {
        setisLoading(false);
      }, 3000);
    }
  };

  const onPressHome = () => {
    navigation.navigate("Home");
  };

  const onPressCart = () => {
    navigation.navigate("cart");
  };

  // const [sortOrder, setSortOrder] = useState('1');

  const onDonate = async (item) => {
    const userId = await AsyncStorage.getItem("user_Id");
    let url = `?id=${item.id}&name=${item.title}&quantity=${1}&amount=${item.total_amount}&kioskId=${kioskId}&item_type=1`;
    if (userId) {
      url = `?id=${item.id}&name=${item.title}&quantity=${1}&amount=${item.total_amount}&kioskId=${kioskId}&userId=${userId}&item_type=1`;
    }
    const res = await AddToDonate(url);
    if (res.success) {
      toast.show("Add To Cart Successfully", {
        type: "normal",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in",
      });
      const uId = res.data.user_id;
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

  const renderBanner = ({ item }) => {
    return (
      <View
        style={[
          styles.card,
          {
            width: isPortrait
              ? windowDimensions.width / 3 - 17
              : (windowDimensions.width * 0.9) / 2,
            // height:350,
          },
        ]}
      >
        {/* <Image source={{ uri: item.image }} style={styles.cardImg} /> */}
        <FastImage
          style={styles.cardImg}
          source={{
            uri: item.image,
            priority: FastImage.priority.high,
          }}
        />
        {/* <View style={{width:'100%',borderTopLeftRadius:30,paddingTop:10}}> */}
        <View
          style={{
            borderTopLeftRadius: 30,
            paddingHorizontal: 10,
            paddingTop: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, height: 60, alignItems: 'flex-start' }}>
              <Text
                style={[{ fontSize: 12, fontWeight: "500", color: "#000" }]}
              >
                {isEnglish ? "Project" : " المشروع"}
              </Text>
              {!isEnglish ? (
                <Text style={styles.cardText}>
                  {item.title_arabic.slice(0, 100)}
                </Text>
              ) : (
                <Text style={styles.cardText}>{item.title.slice(0, 100)}</Text>
              )}
            </View>
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                style={[{ fontSize: 12, fontWeight: "500", color: "#000" }]}
              >
                {isEnglish ? "Country" : " الدولة"}
              </Text>
              <Text style={styles.cardText}>
                {isEnglish ? item.country : item.country_arabic}
              </Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 10 }} />
          <View style={{ display: "flex", alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#000" }}>
              {isEnglish ? "Amount" : "المبلغ"}
            </Text>
            <Text
              style={[
                styles.cardText,
                { textAlign: isEnglish ? "left" : "right" },
              ]}
            >
              {item?.total_amount
                ? Number(item?.total_amount).toLocaleString("en-IN")
                : "0"}
              .00
            </Text>
          </View>
        </View>
        <Divider style={{ marginBottom: 10, marginHorizontal: 10 }} />
        <TouchableOpacity
          style={styles.cardBtn}
          onPress={() => {
            onDonate(item);
          }}
        >
          {/* <Text style={styles.cardBtnText}>Donate /يتبرع</Text> */}
          <Text style={styles.cardBtnText}>
            {isEnglish ? "Donate" : "تبرع"}
          </Text>
        </TouchableOpacity>

        {/* </View> */}
      </View>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#d6d6d6", flex: 1 }}>
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
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
            <BackArrow />
          </Pressable>
          <View style={{ flex: 20, paddingRight: 50 }}>
            {!isEnglish ? (
              <Text style={styles.headerTitle}>المشاريع الخيرية</Text>
            ) : (
              <Text style={styles.headerTitle}>Charity Projects</Text>
            )}
          </View>
        </View>

        <View>
          <View style={styles.searchBlockContainer} />
          <View style={styles.searchBlock}>
            <View>
              <Dropdown
                style={styles.dropdown}
                data={isEnglish ? countryList : arabicCountryList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={country}
                onChange={(item) => {
                  setCountry(item.value);
                }}
                placeholder={isEnglish ? "All" : "جميع الدول"}
                placeholderStyle={{textAlign:'left'}}
                itemTextStyle={{textAlign:'left'}}

              />
              {/* <Pressable style={styles.searchBtn} onPress={fetchItemData}>
                <Text style={styles.cardBtnText}>Search /يبحث</Text>
              </Pressable> */}
            </View>
          </View>
        </View>

        <View style={styles.sortingBlock}>
          {/* <Dropdown
            style={styles.dropdownsort}
            data={sortlist}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={sortOrder}
            onChange={item => {
              setSortOrder(item.value);
            }}
          />
          <Text>:Sort / نوع</Text> */}
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingHorizontal: 5,
          }}
        >
          {itemListData.length > 0 && (
            <FlatList
              scrollEnabled={false}
              data={itemListData}
              renderItem={renderBanner}
              keyExtractor={(item, index) => index}
              numColumns={3}
              contentContainerStyle={styles.flatlistContainer}
            />
          )}
        </View>
        {!isLoading && itemListData.length === 0 && (
          <Text style={{ textAlign: "center" }}>
            {isEnglish ? "No Data Found" : "لاتوجد بيانات"}
          </Text>
        )}
      </ScrollView>
      <BottomBar
        onPressHome={onPressHome}
        onPressCart={onPressCart}
        onChangeLanguage={onChangeLanguage}
        isshowLogo={false}
        kioskId={kioskId}
        isShowLanguage={false}
        isShowRightIcon={false}
        isEnglish={isEnglish}
      />
      <Loader loader={isLoading} />
    </SafeAreaView>
  );
};

export default CharityProject;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#36b0c8",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginVertical: 3,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    paddingBottom: 10,
    marginVertical: 2,
    width: (Dimensions.get("window").width / 2) * 0.9,
    alignSelf: "center",
    marginHorizontal: 5,
  },
  cardImg: {
    width: "100%",
    height: Platform.isTV ? 200 : 150,
    borderBottomRightRadius: 30,
    backgroundColor: "#F4F4F4",
  },
  cardText: { fontSize: 10, fontWeight: "400", lineHeight: 16 },
  cardBtn: {
    backgroundColor: "#36b0c8",
    alignSelf: "center",
    // marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,

    width: "95%",
  },
  cardBtnText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
  searchBtn: {
    backgroundColor: "#36b0c8",
    alignSelf: "center",
    padding: 10,
    paddingHorizontal: 20,
    borderTopRightRadius: 12,
    marginVertical: 10,
  },
  flatlistContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },
  dropdown: {
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "95%",
    alignSelf: "center",
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 0.5,
  
  },
  dropdownsort: {
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "70%",
    alignSelf: "center",
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 0.5,
  },
  searchBlockContainer: {
    height: 120,
    width: "100%",
    backgroundColor: "#36b0c8",
    position: "relative",
  },
  searchBlock: {
    paddingVertical: 10,
    backgroundColor: "#fff",
    // marginHorizontal: 10,
    borderRadius: 10,
    position: "absolute",
    top: 30,
    width: "96%",
    alignSelf: "center",
  },
  sortingBlock: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 20,
  },
});
