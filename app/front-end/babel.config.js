module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo", // Expo includes metro-react-native-babel-preset by default
    ],
    plugins: [
      ["module:react-native-dotenv", {
        moduleName: "@env",
        path: ".env",
      }],
      "nativewind/babel", // Required for Nativewind
      "react-native-reanimated/plugin", // Required for React Native Reanimated
    ],
  };
};
