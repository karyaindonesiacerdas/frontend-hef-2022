/* eslint-disable @next/next/no-img-element */
import {
  Anchor,
  Box,
  Button,
  createStyles,
  Group,
  Image,
  keyframes,
  Loader,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Edit,
  Id,
  ListDetails,
  Mail,
  Phone,
  PlayerPlay,
  UserPlus,
} from "tabler-icons-react";
import dynamic from "next/dynamic";
// import Marquee from "react-fast-marquee";
// import Marquee from "react-easy-marquee";
import Ticker from "react-ticker";

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
import {
  allowToHaveCatalog,
  allowToHaveCatalogAndNameCard,
  allowToHaveLiveChat,
  allowToHaveNameCard,
  getMobileLink
} from "services/exhibitor/exhibitor";
import { useQueryClient } from "react-query";
import { getFileUrl } from "utils/file-storage";
import EditBoothDrawer from "@/components/booth/EditBoothDrawer";
import GuestBookDrawer from "@/components/booth/GuestBookDrawer";
import { postActivity } from "services/activity/activity";
import { useSettings } from "services/settings/hooks";
import BottomNav from "@/components/app-layout/BottomNav";
import { useMediaQuery, useOs } from "@mantine/hooks";
import RunningText from "@/components/RunningText";
import ReactPlayer from "react-player";
import AppMobileLayout from "@/components/app-layout/AppMobileLayout";
import { matchYoutubeUrl } from "utils/youtube";
import { Notebook } from "tabler-icons-react";

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
    overflowX: "hidden",
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
    transform: "rotateY(10deg) rotateZ(0.5deg)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1vw",
    fontWeight: 600,
    border: "4px solid teal",
    overflow: "clip",
  },
  catalogImg: {
    opacity: 0.7,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
    position: "absolute",
    left: 0,
    top: 0,
    maxWidth: "100%",
    objectFit: "cover",
  },
  catalogText: {
    fontSize: "0.9vw",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    textAlign: "center",
    padding: "4px 2px",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
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
    fontSize: "1vw",
    fontWeight: 600,
    transform: "rotateY(-3.5deg) rotateZ(-1.5deg)",
    transformOrigin: "right",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid teal",
    overflow: "clip",
  },
  profileImg: {
    opacity: 0.7,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
    position: "absolute",
    left: 0,
    top: 0,
    maxWidth: "100%",
    objectFit: "cover",
  },
  profileText: {
    fontSize: "0.9vw",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    textAlign: "center",
    padding: "4px 2px",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  },
  videoButtonContainer: {
    position: "absolute",
    width: "21%",
    height: "25%",
    top: "20.8%",
    right: "-0.8%",
    // transform: "rotateY(-30.5deg)",
    // perspective: "500px",
    perspective: "500px",
  },
  videoBackground: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: "rotateY(-18deg) rotateZ(-7deg) rotateX(11deg)",
    transformOrigin: "right",
    backgroundColor: "transparent",
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
    width: "31%",
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
    whiteSpace: "nowrap",
    paddingLeft: "60px",
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
  backButtonMobile: {
    zIndex: 10,
    position: "fixed",
    top: 20,
    left: 70,
    fontWeight: 600,
    color: theme.colors.dark,
    background: "rgba( 255, 255, 255, 0.5  )",
    boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    textDecoration: "none",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
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
    right: "6%",
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
  guestBookButtonContainer: {
    position: "absolute",
    width: "3%",
    height: "3%",
    top: "2%",
    right: "2%",
  },
  guestBookButton: {
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
  sidebar: {
    display: "block",
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  bottomNav: {
    display: "none",
    [theme.fn.smallerThan("xs")]: {
      display: "block",
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
  const [isOpenGuestBook, setIsOpenGuestBook] = useState(false);
  const [isOpenVideo, setIsOpenVideo] = useState(false);
  const notifications = useNotifications();
  const [isLoadingAddContact, setIsLoadingAddContact] = useState(false);
  const queryClient = useQueryClient();
  const [postingActivity, setPostingActivity] = useState(false);
  const theme = useMantineTheme();
  const largerThanXs = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);
  const [openPoster, setOpenPoster] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState("");
  const [posterIndex, setPosterIndex] = useState(1);
  const [posterPreview, setPosterPreview] = useState("");
  const timerRef: { current: NodeJS.Timeout | null } = useRef(null);
  const os = useOs();

  const {
    data: exhibitor,
    isLoading,
    isSuccess,
  } = useExhibitor(router.query.id ? String(router.query.id) : "");
  const { data: settings } = useSettings();

  const defaultVideo =
    "https://www.youtube.com/watch?v=c-jBYuYOuD0&ab_channel=HospitalEngineeringExpo";
  const videoId = matchYoutubeUrl(exhibitor?.company_video_url || defaultVideo);
  const previewURL = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    }
  }, [router, isInitialized, isAuthenticated]);

  // useEffect(() => {
  //   if (isInitialized && isAuthenticated && user?.role === "visitor") {
  //     router.replace("/app/main-hall");
  //   }
  // }, [router, isInitialized, isAuthenticated, user?.role]);

  // console.log({ package: exhibitor?.package_id });
  // console.log({ isLoading });

  useEffect(() => {
    if (!exhibitor?.exhibitor_type && isSuccess) {
      router.push("/app/exhibitor");
    }
  }, [exhibitor?.exhibitor_type, isSuccess, router]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (timerRef?.current) clearTimeout(timerRef.current);
      const nextIndex = posterIndex % 5 + 1;
      const poster = exhibitor?.banners?.find((banner) => banner.order === nextIndex);
      if (poster) {
        setPosterPreview(getFileUrl(poster.image, "banner"));
      }
      setPosterIndex(nextIndex);
    }, 4000);
    return () => {
      if (timerRef?.current) clearTimeout(timerRef.current);
    }
  }, [exhibitor?.banners, posterIndex]);

  const handleAddContact = async () => {
    if (!user?.id || !exhibitor?.id) return;

    setIsLoadingAddContact(true);
    try {
      await createConversation({
        sender: {
          id: user?.id,
          email: user?.email || "No name",
          name: user?.name || "No email",
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

  const nameCard = exhibitor?.banners?.find((banner) => banner.order === 11);
  const nameCardUrl = allowToHaveCatalogAndNameCard(exhibitor?.id) && nameCard ? getFileUrl(nameCard.image, "banner") : undefined;
  const catalog = exhibitor?.banners?.find((banner) => banner.order === 12);

  const isMobile = os === "android" || os === "ios";

  if (!isInitialized || !isAuthenticated || isLoading) {
    return null;
  }

  return (
    <SocketProvider>
      {largerThanXs && !isMobile ? (
        <div
          style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}
          className={classes.sidebar}
        >
          <AppLayout />
        </div>
      ) : isMobile && largerThanXs ? (
        <div style={{ position: "absolute", top: 20, left: 16, zIndex: 100 }}>
          <AppMobileLayout />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 50,
          width: "100%",
        }}
        className={classes.bottomNav}
      >
        <BottomNav />
      </div>

      {largerThanXs ? (
        <>
          <NextLink
            className={isMobile ? classes.backButtonMobile : classes.backButton}
            href="/app/exhibitor"
          >
            <ArrowLeft size={15} style={{ marginRight: 4 }} />
            <Text component="span" size={isMobile ? "sm" : "md"}>
              Back to Exhibitor Hall
            </Text>
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
          {String(user?.id) === String(router.query.id) && (
            <GuestBookDrawer
              opened={isOpenGuestBook}
              setOpened={setIsOpenGuestBook}
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
                alt={exhibitor?.company_name}
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
                style={{ opacity: posterPreview ? 1 : 0.5 }}
              >
                <img src={posterPreview} alt=" " className={classes.catalogImg} />
                <div className={classes.catalogText}>Poster</div>
              </UnstyledButton>
            </div>
            <div className={classes.profileContainer}>
              <UnstyledButton
                className={classes.profile}
                onClick={() => setIsOpenAboutUs(true)}
                style={{ opacity: nameCardUrl ? 1 : 0.5 }}
              >
                <img src={nameCardUrl} alt=" " className={classes.profileImg} />
                <div className={classes.profileText}>
                  {allowToHaveCatalogAndNameCard(exhibitor?.id) ? 'Catalog & Name Card' : 'Company Information'}
                </div>
              </UnstyledButton>
            </div>

            {exhibitor?.company_video_url && <div className={classes.videoButtonContainer}>
              <Box
                className={classes.videoBackground}
                style={{
                  backgroundImage: exhibitor?.company_video_url
                    ? `url(${previewURL})`
                    : undefined,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  overflow: "hidden",
                }}
              >
                <Tooltip label="Play Video">
                  <UnstyledButton
                    className={classes.videoButton}
                    onClick={() => setIsOpenVideo(true)}
                  >
                    <PlayerPlay color="teal" size={"2vw"} />
                  </UnstyledButton>
                </Tooltip>
              </Box>
            </div>}

            <div className={[classes.marqueContainer, classes.marque].join(' ')}>
              <Ticker move={true}>
                {() => (
                  <Text className={classes.marqueText} weight={700}>
                    {exhibitor?.company_running_text || exhibitor?.company_name}
                  </Text>
                )}
              </Ticker>
            </div>

            <div className={classes.deskContainer}>
              {/* {exhibitor?.company_logo ? ( */}
              <Image
                className={classes.deskLogo}
                src={
                  exhibitor?.company_logo
                    ? getFileUrl(exhibitor.company_logo, "companies")
                    : "/hef-2022/logoipsum.svg"
                }
                alt={exhibitor?.company_name}
              />
              {/* ) : null} */}
            </div>
            {/* {user?.role === "visitor" && (
              <div className={classes.addContactContainer}>
                <Tooltip
                  label={
                    !user?.name || !user?.email
                      ? "Set your name and email first!"
                      : "Add Contact"
                  }
                >
                  <UnstyledButton
                    className={classes.addContact}
                    onClick={handleAddContact}
                    disabled={
                      isLoadingAddContact || !user?.email || !user?.name
                    }
                  >
                    {isLoadingAddContact ? (
                      <Loader />
                    ) : (
                      <UserPlus color="teal" size={"2vw"} />
                    )}
                  </UnstyledButton>
                </Tooltip>
              </div>
            )} */}
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
            {String(user?.id) === String(router.query.id) && (
              <div className={classes.guestBookButtonContainer}>
                <Tooltip label="Booth Visitors">
                  <UnstyledButton
                    className={classes.guestBookButton}
                    onClick={() => setIsOpenGuestBook(true)}
                  >
                    <Notebook color="teal" size={"2vw"} />
                  </UnstyledButton>
                </Tooltip>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ height: "100vh", overflow: "auto", paddingBottom: 160 }}>
          <ModalPoster
            opened={openPoster}
            setOpened={setOpenPoster}
            url={selectedPoster}
          />
          <Stack
            sx={(theme) => ({
              borderTop: "6px solid",
              borderColor: theme.colors[theme.primaryColor][5],
            })}
            pt="md"
            spacing={0}
          >
            <Group position="apart" pr="sm">
              <Anchor component={NextLink} href="/app/exhibitor" size="sm">
                <Group align="center" spacing={0} px="sm">
                  <ArrowLeft size={15} style={{ marginRight: 4 }} />
                  <span>Back to Exhibitors</span>
                </Group>
              </Anchor>
              {/* <Button
                onClick={handleAddContact}
                loading={isLoadingAddContact}
                leftIcon={<UserPlus size={16} />}
                pl="sm"
                size="xs"
              >
                Add Contact
              </Button> */}
            </Group>
            <Stack
              mt="md"
              pt="lg"
              align="center"
              spacing={0}
              sx={(theme) => ({ backgroundColor: theme.colors.gray[1] })}
              my={0}
            >
              <Image
                src={
                  exhibitor?.company_logo
                    ? getFileUrl(exhibitor.company_logo, "companies")
                    : "/hef-2022/logoipsum.svg"
                }
                width={200}
                mr={20}
                alt={exhibitor?.company_name}
              />
              <Text mt="xs" weight={600}>
                {exhibitor?.company_name}
              </Text>
              <Group
                sx={{
                  justifyContent: "space-around",
                  backgroundColor: theme.colors.gray[1],
                }}
                mt="md"
              >
                <Group spacing={6}>
                  <Mail size={20} />
                  <Anchor size="sm" href={`mailto:${exhibitor?.email}`}>
                    {exhibitor?.email}
                  </Anchor>
                </Group>
                <Group spacing={6}>
                  <Phone size={20} />
                  <Anchor
                    size="sm"
                    href={getMobileLink(exhibitor?.id, exhibitor?.mobile)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {exhibitor?.mobile}
                  </Anchor>
                </Group>
              </Group>
              {!!exhibitor?.company_website && (
                <Anchor
                  size="sm"
                  href={exhibitor?.company_website}
                  mt="xs"
                  mb="md"
                >
                  {exhibitor?.company_website}
                </Anchor>
              )}
            </Stack>
            {exhibitor?.company_video_url && (
              <ReactPlayer
                loop
                controls
                width={"100%"}
                height={"calc(100vw * 9/16)"}
                url={exhibitor?.company_video_url}
              />
            )}
            <Text px="sm" mt="xl" size="lg" weight={600} mb="sm">
              Poster
            </Text>
            <Box
              sx={{
                overflow: "auto",
                display: "flex",
                scrollSnapType: "x mandatory",
                marginLeft: 12,
                paddingBottom: 10,
              }}
            >
              {exhibitor?.banners
                ?.filter((banner) => [1, 2, 3, 4, 5].includes(banner.order))
                ?.map((poster) => (
                  <Paper
                    key={poster.id}
                    withBorder
                    shadow="xs"
                    radius="md"
                    sx={(theme) => ({
                      width: "70vw",
                      marginRight: theme.spacing.xl,
                      flexShrink: 0,
                      scrollSnapAlign: "start",
                      overflow: "hidden",
                    })}
                    onClick={() => {
                      console.log("hit");
                      setSelectedPoster(getFileUrl(poster.image, "banner"));
                      setOpenPoster(true);
                      handleClickPoster();
                    }}
                  >
                    <Image
                      src={getFileUrl(poster.image, "banner")}
                      alt={poster.display_name}
                    />
                    <Text
                      align="center"
                      className="product"
                      p="md"
                      weight={600}
                    >
                      {poster.display_name}
                    </Text>
                  </Paper>
                ))}
            </Box>
            {allowToHaveCatalogAndNameCard(exhibitor?.id) && (
              <>
                <Text mt={40} px="sm" size="lg" weight={600} mb="sm">
                  Download
                </Text>
                <SimpleGrid cols={2} px="sm">
                  {allowToHaveCatalog(exhibitor?.id) && catalog ? (
                    <UnstyledButton
                      p="xl"
                      sx={(theme) => ({
                        backgroundColor: theme.colors[theme.primaryColor][0],
                        borderRadius: theme.radius.md,
                        "&:hover": {
                          backgroundColor: theme.colors[theme.primaryColor][1],
                        },
                      })}
                      component="a"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        catalog?.image ? getFileUrl(catalog?.image, "banner") : ""
                      }
                    >
                      <Stack align="center" spacing="xs">
                        <ClipboardList
                          size={32}
                          color={theme.colors[theme.primaryColor][9]}
                        />
                        <Text
                          align="center"
                          weight={700}
                          sx={(theme) => ({
                            color: theme.colors[theme.primaryColor][9],
                          })}
                        >
                          Catalog
                        </Text>
                      </Stack>
                    </UnstyledButton>
                  ) : null}
                  {allowToHaveNameCard(exhibitor?.id) && nameCard ? (
                    <UnstyledButton
                      p="xl"
                      sx={(theme) => ({
                        backgroundColor: theme.colors[theme.primaryColor][0],
                        borderRadius: theme.radius.md,
                        "&:hover": {
                          backgroundColor: theme.colors[theme.primaryColor][1],
                        },
                      })}
                      component="a"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        nameCard?.image ? getFileUrl(nameCard?.image, "banner") : ""
                      }
                    >
                      <Stack align="center" spacing="xs">
                        <Id size={32} color={theme.colors[theme.primaryColor][9]} />
                        <Text
                          align="center"
                          weight={700}
                          sx={(theme) => ({
                            color: theme.colors[theme.primaryColor][9],
                          })}
                        >
                          Name Card
                        </Text>
                      </Stack>
                    </UnstyledButton>
                  ) : null}
                </SimpleGrid>
              </>
            )}
          </Stack>
        </div>
      )}
      {false && settings?.is_chat === "1" && exhibitor && (
        <ChatButton exhibitor={exhibitor} />
      )}
      {allowToHaveLiveChat(exhibitor?.id) && exhibitor?.mobile ? (
        <UnstyledButton
          sx={(theme) => ({
            width: 65,
            height: 65,
            backgroundColor: "white",
            position: "fixed",
            right: 35,
            bottom: 35,
            borderRadius: 1000,
            overflow: "hidden",
            [theme.fn.smallerThan("sm")]: {
              bottom: 80,
              right: 20,
            },
            boxShadow: theme.shadows.xl,
          })}
          component="a"
          aria-label="whatsapp button"
          href={getMobileLink(exhibitor?.id, exhibitor?.mobile)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image src="/hef-2022/whatsapp.png" alt="" />
        </UnstyledButton>
      ) : null}
    </SocketProvider>
  );
};

export default ExhibitorBooth;

type ModalPosterProps = {
  url: string;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalPoster = ({ opened, setOpened, url }: ModalPosterProps) => {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      size="100vw"
      sx={{ margin: 0 }}
    >
      <Image src={url} alt="Image" />
    </Modal>
  );
};
