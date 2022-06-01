/* eslint-disable @next/next/no-img-element */
import {
  createStyles,
  Image,
  keyframes,
  Loader,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit, PlayerPlay, UserPlus } from "tabler-icons-react";
import dynamic from "next/dynamic";
// import Marquee from "react-fast-marquee";
// import Marquee from "react-easy-marquee";

import AppLayout from "@/components/app-layout/AppLayout";
// import AboutUsModal from "@/components/booth/AboutUsModal";
const AboutUsModal = dynamic(() => import("@/components/booth/AboutUsModal"), {
  ssr: false,
});
import CatalogModal from "@/components/booth/CatalogModal";
import VideoModal from "@/components/booth/VideoModal";
import { useRouter } from "next/router";
import { useAuth } from "contexts/auth.context";
import { NextLink } from "@mantine/next";
import { SocketProvider, useSocket } from "contexts/socket.context";
import ChatButton from "@/components/chat/ChatButton";
import { createConversation } from "services/chat/conversation";
import { useNotifications } from "@mantine/notifications";
import { useExhibitor } from "services/exhibitor/hooks";
import { useQueryClient } from "react-query";
import { getFileUrl } from "utils/file-storage";
import EditBoothDrawer from "@/components/booth/EditBoothDrawer";
import { postActivity } from "services/activity/activity";
import { useSettings } from "services/settings/hooks";

export const pulse = keyframes({
  "from, to": { opacity: 1 },
  "50%": { opacity: 0.3 },
});

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url('/hef-2022/booth.jpg')",
    width: "100%",
    height: "100%",
    aspectRatio: "2 / 1",
  },
  logoContainer: {
    position: "absolute",
    width: "23%",
    top: "33%",
    left: "40%",
    perspective: "1000px",
    perspectiveOrigin: "right",
  },
  logo: {
    width: "100%",
    transform: "rotateY(30deg) rotateZ(0deg)",
  },
  catalogContainer: {
    position: "absolute",
    width: "9.7%",
    height: "11.6%",
    top: "37.1%",
    left: "19.1%",
    perspective: "400px",
  },
  catalog: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    opacity: 0.2,
    transform: "rotateY(10deg) rotateZ(0.5deg)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1vw",
    fontWeight: 600,
    border: "4px solid teal",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
  profileContainer: {
    position: "absolute",
    width: "7.6%",
    height: "10.5%",
    top: "31.7%",
    right: "21.3%",
    perspective: "110px",
  },
  profile: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    opacity: 0.4,
    fontSize: "1vw",
    fontWeight: 600,
    transform: "rotateY(-3.5deg) rotateZ(-1.5deg)",
    transformOrigin: "right",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid teal",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
  videoButtonContainer: {
    position: "absolute",
    width: "5%",
    height: "5%",
    top: "31.7%",
    right: "5.3%",
    perspective: "110px",
  },
  videoButton: {
    padding: "0.5vw",
    borderRadius: "1000px",
    backgroundColor: "white",
    opacity: 0.4,
    transform: "rotateY(-15deg) rotateZ(-1.5deg)",
    transformOrigin: "right",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid teal",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
  marqueContainer: {
    position: "absolute",
    width: "33%",
    height: "5%",
    top: "13%",
    left: "15.5%",
    perspective: "1010px",
  },
  marque: {
    overflow: "hidden",
    transform: "rotateY(15deg) rotateZ(5.5deg) rotateX(5deg)",
    transformOrigin: "left",
  },
  marqueText: {
    fontSize: "1.1vw",
  },
  deskContainer: {
    position: "absolute",
    width: "5.5%",
    top: "61%",
    right: "29%",
    perspective: "1000px",
    perspectiveOrigin: "left",
  },
  deskLogo: {
    width: "100%",
    transform: "rotateY(-25deg) rotateZ(2deg)",
  },
  addContactContainer: {
    position: "absolute",
    width: "5.5%",
    top: "53%",
    right: "25%",
    perspective: "1000px",
    perspectiveOrigin: "left",
  },
  addContact: {
    padding: "0.5vw",
    borderRadius: "1000px",
    backgroundColor: "white",
    opacity: 0.4,
    transform: "rotateY(-15deg) rotateZ(-1.5deg)",
    transformOrigin: "right",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid teal",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
  backButton: {
    zIndex: 10,
    position: "fixed",
    top: 20,
    left: 100,
    fontWeight: 600,
    color: theme.colors.dark,
    background: "rgba( 255, 255, 255, 0.5  )",
    boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    textDecoration: "none",
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: theme.colors[theme.primaryColor][6],
    },
  },
  editBoothButtonContainer: {
    position: "absolute",
    width: "3%",
    height: "3%",
    top: "2%",
    right: "2%",
  },
  editBoothButton: {
    padding: "0.5vw",
    borderRadius: "1000px",
    backgroundColor: "white",
    opacity: 0.4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid teal",
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
}));

const ExhibitorBooth: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes } = useStyles();
  const [isOpenCatalog, setIsOpenCatalog] = useState(false);
  const [isOpenAboutUs, setIsOpenAboutUs] = useState(false);
  const [isOpenEditContent, setIsOpenEditContent] = useState(false);
  const [isOpenVideo, setIsOpenVideo] = useState(false);
  const notifications = useNotifications();
  const [isLoadingAddContact, setIsLoadingAddContact] = useState(false);
  const queryClient = useQueryClient();
  const [postingActivity, setPostingActivity] = useState(false);

  const {
    data: exhibitor,
    isLoading,
    isSuccess,
  } = useExhibitor(router.query.id ? String(router.query.id) : "");
  const { data: settings } = useSettings();
  console.log({ settings });

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  console.log({ package: exhibitor?.package_id });
  console.log({ isLoading });

  useEffect(() => {
    if (!exhibitor?.package_id && isSuccess) {
      router.push("/app/exhibitor");
    }
  }, [exhibitor?.package_id, isSuccess, router]);

  const handleAddContact = async () => {
    if (!user?.id || !exhibitor?.id) return;

    setIsLoadingAddContact(true);
    try {
      await createConversation({
        sender: {
          id: user?.id,
          email: user?.email,
          name: user?.name,
          img_profile:
            user?.img_profile && user?.img_profile !== "undefined"
              ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/profiles/${user?.img_profile}`
              : `https://ui-avatars.com/api/?name=${user?.name}`,
        },
        receiver: {
          id: exhibitor?.id,
          email: exhibitor?.email,
          name: exhibitor?.company_name,
          img_profile: exhibitor?.company_logo
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/companies/${exhibitor?.company_logo}`
            : `https://ui-avatars.com/api/?name=${exhibitor?.company_name}`,
        },
      });
      await queryClient.invalidateQueries("conversation");
      setIsLoadingAddContact(false);
      notifications.showNotification({
        title: "Success",
        message: "Contact added!",
        color: "green",
      });
    } catch (error: any) {
      setIsLoadingAddContact(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error add contact",
        color: "red",
      });
    }
  };

  const handleClickPoster = async () => {
    if (!exhibitor?.id || !user?.id) return;
    try {
      setPostingActivity(true);
      await postActivity({
        subject_id: exhibitor?.id,
        subject_type: "reward",
        subject_name: `view_poster`,
        causer_id: user?.id,
      });
      setPostingActivity(false);
    } catch (error) {
      setPostingActivity(false);
    }
  };

  if (!isInitialized || !isAuthenticated || isLoading) {
    return null;
  }

  return (
    <SocketProvider>
      <div style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}>
        <AppLayout />
      </div>
      <NextLink className={classes.backButton} href="/app/exhibitor">
        <ArrowLeft size={15} style={{ marginRight: 4 }} />
        <span>Back to Exhibitor Hall</span>
      </NextLink>
      <CatalogModal
        opened={isOpenCatalog}
        setOpened={setIsOpenCatalog}
        posters={
          exhibitor?.banners?.filter((banner) =>
            [1, 2, 3, 4, 5].includes(banner.order)
          ) || []
        }
        catalog={exhibitor?.banners?.find((banner) => banner.order === 12)}
      />
      <AboutUsModal
        opened={isOpenAboutUs}
        setOpened={setIsOpenAboutUs}
        exhibitor={exhibitor}
      />
      <VideoModal
        opened={isOpenVideo}
        setOpened={setIsOpenVideo}
        exhibitor={exhibitor}
      />
      {String(user?.id) === String(router.query.id) && exhibitor && (
        <EditBoothDrawer
          opened={isOpenEditContent}
          setOpened={setIsOpenEditContent}
          exhibitor={exhibitor}
        />
      )}
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          {/* {exhibitor?.company_logo ? ( */}
          <img
            src={
              exhibitor?.company_logo
                ? getFileUrl(exhibitor.company_logo, "companies")
                : "/hef-2022/logoipsum.svg"
            }
            alt="Panasonic"
            className={classes.logo}
          />
          {/* ) : null} */}
        </div>
        <div className={classes.catalogContainer}>
          <UnstyledButton
            className={classes.catalog}
            onClick={() => {
              setIsOpenCatalog(true);
              handleClickPoster();
            }}
          >
            Poster
          </UnstyledButton>
        </div>
        <div className={classes.profileContainer}>
          <UnstyledButton
            className={classes.profile}
            onClick={() => setIsOpenAboutUs(true)}
            style={{ textAlign: "center" }}
          >
            Catalog & Name Card
          </UnstyledButton>
        </div>
        <div className={classes.videoButtonContainer}>
          <Tooltip label="Play Video">
            <UnstyledButton
              className={classes.videoButton}
              onClick={() => setIsOpenVideo(true)}
            >
              <PlayerPlay color="teal" size={"2vw"} />
            </UnstyledButton>
          </Tooltip>
        </div>
        {/* <div className={classes.marqueContainer}>
          <Marquee speed={80} gradientWidth={0} className={classes.marque}>
            <Text className={classes.marqueText} weight={700}>
              Panasonic - A Better Life, A Better World.
            </Text>
          </Marquee>
        </div> */}
        <div className={classes.deskContainer}>
          {/* {exhibitor?.company_logo ? ( */}
          <Image
            className={classes.deskLogo}
            src={
              exhibitor?.company_logo
                ? getFileUrl(exhibitor.company_logo, "companies")
                : "/hef-2022/logoipsum.svg"
            }
            alt="Desk logo"
          />
          {/* ) : null} */}
        </div>
        {user?.role === "visitor" && (
          <div className={classes.addContactContainer}>
            <Tooltip label="Add Contact">
              <UnstyledButton
                className={classes.addContact}
                onClick={handleAddContact}
                disabled={isLoadingAddContact}
              >
                {isLoadingAddContact ? (
                  <Loader />
                ) : (
                  <UserPlus color="teal" size={"2vw"} />
                )}
              </UnstyledButton>
            </Tooltip>
          </div>
        )}
        {String(user?.id) === String(router.query.id) && (
          <div className={classes.editBoothButtonContainer}>
            <Tooltip label="Edit Booth Content">
              <UnstyledButton
                className={classes.editBoothButton}
                onClick={() => setIsOpenEditContent(true)}
              >
                <Edit color="teal" size={"2vw"} />
              </UnstyledButton>
            </Tooltip>
          </div>
        )}
      </div>
      {settings?.is_chat === "1" && <ChatButton />}
    </SocketProvider>
  );
};

export default ExhibitorBooth;
