import { ChakraProvider } from "@chakra-ui/react";
import Home from "@/components/Home";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Home {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
