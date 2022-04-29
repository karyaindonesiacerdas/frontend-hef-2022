import React from "react";
import { Affix, Button, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { ArrowUp } from "tabler-icons-react";

import { HeaderMenu } from "./Header";
import { Footer } from "./Footer";

const WebLayout: React.FC = ({ children }) => {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <>
      <HeaderMenu />
      {children}
      <Footer />
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftIcon={<ArrowUp size={16} />}
              style={transitionStyles}
              styles={{
                root: {
                  paddingLeft: 8,
                },
              }}
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
};

export default WebLayout;
