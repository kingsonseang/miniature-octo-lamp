import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerPadding: {
    paddingVertical: Dimensions.get("window").height * 0.02,
    paddingHorizontal: Dimensions.get("window").width * 0.06,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  headerbtn: {
    width: 50,
    height: 50,
    borderRadius: 30,
    overflow: "hidden"
  },
  TnCContainer: {
    flexDirection: "row",
    gap: Dimensions.get("window").width * 0.02,
    alignItems: "center",
  },
  textP: {
    fontFamily: "Poppins_400Regular",
  },
  textmP: {
    fontFamily: "Poppins_500Medium",
  },
  textM: {
    fontFamily: "Montserrat_400Regular",
  },
  textmM: {
    fontFamily: "Montserrat_500Medium",
  },
  textSG: {
    fontFamily: "SpaceGrotesk_400Regular",
  },
  textmSG: {
    fontFamily: "SpaceGrotesk_500Medium",
  },
  fs12: {
    fontSize: 12
  },
  fs14: {
    fontSize: 14
  },
  fs16: {
    fontSize: 16
  },
  fs18: {
    fontSize: 16
  },
  fs20: {
    fontSize: 20
  }
});

export default styles;
