import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import AppTheme from "theme";

export default function Applicaton({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <ChakraProvider theme={AppTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
