const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.assetExts = config.resolver.assetExts.filter(
    (ext) => ext !== "css"
  );
  config.transformer = {
    babelTransformerPath: require.resolve("react-native-css-transformer"),
  };

  return config;
})();
