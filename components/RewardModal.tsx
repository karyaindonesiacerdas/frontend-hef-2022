import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Center,
  Text,
  Stack,
  Anchor,
} from "@mantine/core";
import { Trophy } from "tabler-icons-react";
import { useRouter } from "next/router";
import ReactCanvasConfetti from "react-canvas-confetti";

import { NextLink } from "@mantine/next";

type IProps = {
  msg: {
    en: string;
    id: string;
  },
  visible: boolean;
  onClose: any;
}

const RewardModal = ({ msg, visible, onClose }: IProps) => {
  const router = useRouter();

  // Start Confetti
  const refAnimationInstance = useRef<any>(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    if (visible) {
      fire();
    }
  }, [visible, fire]);

  return (
    <>
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 10000,
        }}
      />
      <Modal
        centered
        closeOnClickOutside={false}
        opened={visible}
        onClose={onClose}
        size="lg"
      >
        <Center mt="md" sx={{ width: "100%" }}>
          <Stack align="center" spacing={4}>
            <Trophy size={50} color="	#FFD700" />
            <Text
              mt="md"
              sx={(theme) => ({ fontSize: theme.fontSizes.xl * 1.2 })}
              weight={600}
            >
              {" "}
              {router.locale === "en" ? "Congratulations" : "Selamat"}
            </Text>
            <Text size="lg" weight={400}>
              {router.locale === "en" ? msg.en : msg.id}
            </Text>
            <Text size="xs" color="dimmed">
              {router.locale === "en"
                ? "Points will be used for the draw at the end of the event."
                : "Point akan digunakan untuk undian diakhir acara."}{" "}
              <Anchor size="xs" component={NextLink} href="/app/my-account">
                Details
              </Anchor>
            </Text>
            <Button
              mt="xs"
              variant="light"
              fullWidth
              onClick={onClose}
            >
              Close
            </Button>
          </Stack>
        </Center>
      </Modal>
    </>
  )
}

export default RewardModal