import { GetStaticPropsContext, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Accordion,
  Anchor,
  Container,
  createStyles,
  List,
  Text,
} from "@mantine/core";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";

// const faqs = [
//   {
//     id: 1,
//     question: "I’m interested in sponsoring this event, who should I contact?",
//     answer: (
//       <Text>
//         If you’re interested in sponsoring this event and would like to contact
//         the person in charge, please contact our email at
//         hospital.engineering.expo@gmail.com or whatsApp us in +62 858 9377 7283
//         (Adrian). We will get back to you as soon as possible.
//       </Text>
//     ),
//   },
//   {
//     id: 2,
//     question: "What’s the benefit of becoming HEF 2022 sponsors?",
//     answer: (
//       <Text>
//         To see the list of benefits you can get as a sponsor of our event,
//         please view the{" "}
//         <Anchor href="https://hospital-engineering-expo.com/packages">
//           Packages page
//         </Anchor>
//       </Text>
//     ),
//   },
//   {
//     id: 3,
//     question: "How do I register my company as one of the exhibitors?",
//     answer: (
//       <Text>
//         If you want to register as an exhibitor, please go to the{" "}
//         <Anchor href="https://hospital-engineering-expo.com/register/exhibitor">
//           Register as Exhibitor
//         </Anchor>{" "}
//         page
//       </Text>
//     ),
//   },
//   {
//     id: 4,
//     question: "Is there a pricing list for the exhibition stand?",
//     answer: (
//       <Text>
//         If you’re interested in opening an exhibition stand and would like to
//         know the pricing list, you can contact our email at
//         hospital.engineering.expo@gmail.com or whatsApp us in +62 858 9377 7283
//         (Adrian) or visit the contact us page. We will get back to you as soon
//         as possible.
//       </Text>
//     ),
//   },
//   {
//     id: 5,
//     question: "How long does my stand stay live?",
//     answer: (
//       <Text>
//         Exhibition stands remain live for 24-7 the entire year from their
//         launch, however live chats and 1 on 1 meeting sessions are only held for
//         three days on the 21 May, 28 May and 30 Juny 2022.
//       </Text>
//     ),
//   },
//   {
//     id: 6,
//     question: "What’s the benefit of exhibiting at HEF 2022?",
//     answer: (
//       <Text>
//         To see the list of benefits you can get as an exhibitor, please visit{" "}
//         <Anchor href="https://hospital-engineering-expo.com/why-exhibit">
//           Why Exhibit
//         </Anchor>
//       </Text>
//     ),
//   },
// ];

const faqs = [
  {
    id: "faq-1",
    question: "question",
    answer: "answer",
  },
  {
    id: "faq-2",
    question: "question",
    answer: "answer",
  },
  {
    id: "faq-3",
    question: "question",
    answer: "answer",
  },
  {
    id: "faq-4",
    question: "question",
    answer: "answer",
  },
  {
    id: "faq-5",
    question: "question",
    answer: "answer",
  },
  {
    id: "faq-6",
    question: "question",
    answer: "answer",
  },
];

const useStyles = createStyles((theme, _params, getRef) => {
  const control = getRef("control");

  return {
    root: {
      marginTop: theme.spacing.xl * 3,
      marginBottom: theme.spacing.xl * 3,
    },
    tag: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 700,
      color: theme.colors[theme.primaryColor],
      textTransform: "uppercase",
      textAlign: "center",
    },
    title: {
      fontSize: theme.fontSizes.xl * 2,
      marginBottom: theme.spacing.xl * 2,
      fontWeight: 700,
      textAlign: "center",
      [theme.fn.smallerThan("lg")]: {
        fontSize: theme.fontSizes.xl * 1.5,
      },
    },
    container: {
      // alignItems: "center",
      gap: theme.spacing.xl * 3,
    },
    paragraph: {
      lineHeight: 2.2,
    },

    control: {
      ref: control,

      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    item: {
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,

      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[3]
      }`,
    },

    itemOpened: {
      [`& .${control}`]: {
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 6
          ],
      },
    },
  };
});

const FAQExhibitor: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("faq");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>FAQ</Text>
        <Text className={classes.title}>Exhibitor</Text>
        <Container>
          <Accordion
            iconPosition="right"
            classNames={{
              item: classes.item,
              itemOpened: classes.itemOpened,
              control: classes.control,
            }}
          >
            {/* {faqs.map((faq) => (
              <Accordion.Item
                key={faq.id}
                label={t(`exhibitor.${faq.id}.${faq.question}`)}
              >
                {Array.isArray(faq.answer) ? (
                  <List listStyleType="none" spacing="xs">
                    {faq.answer?.map((item, i) => (
                      <List.Item key={i}>
                        {t(`exhibitor.${faq.id}.${item}`)}
                      </List.Item>
                    ))}
                  </List>
                ) : (
                  t(`exhibitor.${faq.id}.${faq.answer}`)
                )}
              </Accordion.Item>
            ))} */}
            <Accordion.Item label={t(`exhibitor.faq-1.question`)}>
              {t(`exhibitor.faq-1.answer`)}
            </Accordion.Item>
            <Accordion.Item label={t(`exhibitor.faq-2.question`)}>
              {t(`exhibitor.faq-2.answer`)}{" "}
              <Anchor
                style={{ display: "block" }}
                component={Link}
                href="/packages"
              >
                Packages
              </Anchor>
            </Accordion.Item>
            <Accordion.Item label={t(`exhibitor.faq-3.question`)}>
              {t(`exhibitor.faq-3.answer`)}{" "}
              <Anchor component={Link} href="/register/exhibitor">
                Register
              </Anchor>
            </Accordion.Item>
            <Accordion.Item label={t(`exhibitor.faq-4.question`)}>
              {t(`exhibitor.faq-4.answer`)}
            </Accordion.Item>
            <Accordion.Item label={t(`exhibitor.faq-5.question`)}>
              {t(`exhibitor.faq-5.answer`)}
            </Accordion.Item>
            <Accordion.Item label={t(`exhibitor.faq-6.question`)}>
              {t(`exhibitor.faq-6.answer`)}{" "}
              <Anchor component={Link} href="/packages">
                Packages
              </Anchor>
            </Accordion.Item>
          </Accordion>
        </Container>
      </Container>
    </WebLayout>
  );
};

export default FAQExhibitor;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faq"])),
  },
});
