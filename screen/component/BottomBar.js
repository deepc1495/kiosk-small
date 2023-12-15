import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CartIcon,
  HelpIcon,
  HomeIcon,
  TranslateIcon,
} from "../assets/svgIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import VideoPlayer from "react-native-video-player";
import { Divider } from "react-native-paper";

const BottomBar = ({
  onPressHome,
  onPressCart,
  onChangeLanguage,
  isEnglish,
  permitUrl,
  isshowLogo = true,
  isShowLanguage = true,
  isShowRightIcon = true,
  kioskId,
}) => {
  const [selectedLanguages, setselectedLanguages] = useState("2");
  const [showModal, setshowModal] = useState(false);
  const [showModalLang, setshowModalLang] = useState(false);
  // const [kioskId, setkioskId] = useState(kioskId);

  useEffect(async () => {
   
    const language = await AsyncStorage.getItem("language");
    if (language !== null) {
      setselectedLanguages(language);
      onChangeLanguage(language);
    } else {
      await AsyncStorage.setItem("language", "2");
      onChangeLanguage(selectedLanguages);
    }
  }, []);

  const onChangeLang = async (item) => {
    setselectedLanguages(item);
    await AsyncStorage.setItem("language", item);
    onChangeLanguage(item);
    setshowModalLang(false);
  };

  const onHelp = () => {
    setshowModal(true);
  };

  const closeHelp = () => {
    setshowModal(false);
  };

  return (
    <View
      style={{ position: "absolute", bottom: 10, justifyContent: "center" }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: Dimensions.get("window").width,
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          paddingBottom: 10,
        }}
      >
        {isShowLanguage && (
          <View style={{ flexDirection: "row" }}>
            <LinearGradient
              colors={["rgba(54,176,201,1)", "rgba(101,186,175,1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 7,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 13,
                }}
                onPress={() => setshowModalLang(true)}
              >
                {/* <TranslateIcon /> */}
                <Image source={require("../assets/arabic.png")} />
                <Text style={{ color: "#fff", marginLeft: 10, fontSize: 16 }}>
                  {Number(selectedLanguages) === 2 ? "English" : "العربية"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={["rgba(54,176,201,1)", "rgba(101,186,175,1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 7,
                justifyContent: "center",
                marginLeft: 10,
                width: "30%",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 7,
                  overflow: "hidden",
                  justifyContent: "center",
                  
                }}
                onPress={() => onHelp()}
              >
                <HelpIcon />
                {/* <Text style={{ color: "#fff", fontSize: 16, marginLeft: 7 }}>
      {isEnglish ? "Help" : "طريقة الإستخدام"}
    </Text> */}
              </TouchableOpacity>
            </LinearGradient>
            <Modal
              isVisible={showModal}
              onBackButtonPress={() => {
                closeHelp();
              }}
              animationInTiming={200}
              animationOutTiming={200}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  closeHelp();
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    paddingTop: "45%",
                  }}
                >
                  <VideoPlayer
                    video={require("../assets/help.mp4")}
                    videoWidth={1600}
                    videoHeight={800}
                    pauseOnPress
                    autoplay={true}
                    onEnd={() => {
                      setshowModal(false);
                    }}
                  />
                  <TouchableOpacity
                    onPress={closeHelp}
                    style={{ position: "absolute", right: 10, top: "40%" }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        alignSelf: "flex-end",
                        padding: 10,
                        color: "#fff",
                      }}
                    >
                      X
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        )}

        {!isShowLanguage && !isShowRightIcon ? (
          <View
            style={[styles.container, { left: '50%' }]}
          >
            <Pressable onPress={onPressCart} style={styles.homeBtn}>
              <View style={styles.btnInner}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CartIcon />
                </View>
                <Text style={{ color: "#36afc9" }}>
                  {Number(selectedLanguages) === 2 ? "Cart" : "السلة"}
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={onPressHome} style={styles.cartBtn}>
              <View style={styles.btnInner}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon />
                </View>
                <Text style={{ color: "#4f958e" }}>
                  {Number(selectedLanguages) === 2 ? "Home" : "الرئيسية"}
                </Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <View
            style={[styles.container1, { right: isEnglish ? "3%" : "1%" }]}
          >
            <Pressable onPress={onPressCart} style={styles.homeBtn}>
              <View style={styles.btnInner}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CartIcon />
                </View>
                <Text style={{ color: "#36afc9" }}>
                  {Number(selectedLanguages) === 2 ? "Cart" : "السلة"}
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={onPressHome} style={styles.cartBtn}>
              <View style={styles.btnInner}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon />
                </View>
                <Text style={{ color: "#4f958e" }}>
                  {Number(selectedLanguages) === 2 ? "Home" : "الرئيسية"}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
        {isShowRightIcon && (
          <Image
            source={require("../assets/ameen.png")}
            resizeMode="cover"
            style={{ width: 120, height: 120, justifyContent: "center", top:'3%' }}
          />
        )}

        <Modal
          isVisible={showModalLang}
          onBackButtonPress={() => {
            showModalLang(false);
          }}
          animationInTiming={200}
          animationOutTiming={200}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setshowModalLang(false);
            }}
          >
            <View
              style={{
                width: "auto",
                height: "100%",
                display: "flex",
                paddingTop: "70%",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 25,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#000",
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  Select language
                </Text>
                <Divider style={{ marginVertical: 15 }} />
                <TouchableOpacity
                  onPress={() => {
                    onChangeLang("2");
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    English
                  </Text>
                </TouchableOpacity>
                <Divider style={{ marginVertical: 15 }} />
                <TouchableOpacity
                  onPress={() => {
                    onChangeLang("1");
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    العربية
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      {isshowLogo && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={{ uri: permitUrl }}
            style={{ width: 200, height: 30, marginLeft: 10 }}
          />
          <Text style={{ fontSize: 18, color: "#000", marginRight: 20 }}>
            {kioskId}
          </Text>
        </View>
      )}
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    position: "relative",
    paddingRight: "3%",
    justifyContent: "center",
  },
  container1: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    position: "relative",
    paddingRight: "3%",
    justifyContent: "center",
    top: "10%",
  },
  homeBtn: {
    borderColor: "#2bb2c6",
    borderTopRightRadius: 25,
    overflow: "hidden",
    position: "relative",
    borderWidth: 15,
  },
  cartBtn: {
    borderColor: "#5bbbaf",
    borderTopRightRadius: 25,
    overflow: "hidden",
    position: "absolute",
    right: 100,
    borderWidth: 15,
  },
  btnInner: {
    padding: 5,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 25,
    borderTopRightRadius: 10,
  },
  dropdown: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 100,
    alignSelf: "center",
    color: "#fff",
  },
  dropShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
});
