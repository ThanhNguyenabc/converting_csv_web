import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const AppTheme = extendTheme({
  config,
  colors: {
    light: {
      background: "#dee4e7",
    },
    dark: {
      background: "#dee4e7",
    },
  },
  styles: {
    global: (props: any) => ({
      "html, body": {
        background: mode("light.background", "dark.background")(props), //mode(light mode color, dark mode color)
      },
    }),
  },
});

export default AppTheme;
