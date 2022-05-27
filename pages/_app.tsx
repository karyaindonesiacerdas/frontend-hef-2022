import "../styles/globals.css";
import "nprogress/nprogress.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, Global } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import nProgress from "nprogress";
import Router from "next/router";
import { appWithTranslation } from "next-i18next";

import { AuthProvider } from "contexts/auth.context";
import ChatButton from "@/components/chat/ChatButton";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

const client = new QueryClient();

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <AuthProvider>
      <QueryClientProvider client={client}>
        <Head>
          <title>HEF 2022</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            // colorScheme: "light",
            primaryColor: "teal",
            fontFamily: "Inter var, sans-serif",
          }}
          defaultProps={{
            Container: {
              sizes: {
                xs: 540,
                sm: 720,
                md: 960,
                lg: 1140,
                xl: 1320,
                "2xl": 1700,
              },
            },
          }}
        >
          <Global
            styles={(theme) => ({
              // html: { overflowY: "scroll" },
            })}
          />
          <ModalsProvider>
            <NotificationsProvider position="top-right">
              <Component {...pageProps} />
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(App);
