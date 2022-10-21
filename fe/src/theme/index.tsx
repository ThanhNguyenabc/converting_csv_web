import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const AppTheme = extendTheme({
  config,
});

export default AppTheme;
