module.exports = {
  name: "kuwait-travel-guide",
  slug: "kuwait-travel-guide",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true
  },
  plugins: ["expo-router"],
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
    // Add these web-specific configurations
    build: {
      babel: {
        include: ["@expo/vector-icons", "lucide-react-native"]
      }
    }
  },
  ios: {
    supportsTablet: true
  }
};