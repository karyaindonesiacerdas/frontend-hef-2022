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

const FAQVisitor: NextPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation("faq");

  return (
    <WebLayout>
      <Container size="xl" className={classes.root}>
        <Text className={classes.tag}>FAQ</Text>
        <Text className={classes.title}>Visitor</Text>
        <Container>
          <Accordion
            iconPosition="right"
            classNames={{
              item: classes.item,
              itemOpened: classes.itemOpened,
              control: classes.control,
            }}
          >
            <Accordion.Item label={t(`visitor.faq-1.question`)}>
              <List listStyleType="none" spacing="xs">
                <List.Item>
                  {t(`visitor.faq-1.answer.1`)}{" "}
                  <Anchor component={Link} href="/register/visitor">
                    Register
                  </Anchor>
                </List.Item>
                <List.Item>{t(`visitor.faq-1.answer.2`)}</List.Item>
              </List>
            </Accordion.Item>
            <Accordion.Item label={t(`visitor.faq-2.question`)}>
              {t(`visitor.faq-2.answer`)}
            </Accordion.Item>
            <Accordion.Item label={t(`visitor.faq-3.question`)}>
              <List listStyleType="none" spacing="xs">
                <List.Item>{t(`visitor.faq-3.answer.1`)}</List.Item>
                <List.Item>{t(`visitor.faq-3.answer.2`)}</List.Item>
                <List.Item>{t(`visitor.faq-3.answer.3`)}</List.Item>
              </List>
            </Accordion.Item>
            <Accordion.Item label={t(`visitor.faq-4.question`)}>
              {t(`visitor.faq-4.answer`)}{" "}
            </Accordion.Item>
            <Accordion.Item label={t(`visitor.faq-5.question`)}>
              {t(`visitor.faq-5.answer`)}
            </Accordion.Item>
          </Accordion>
        </Container>
      </Container>
    </WebLayout>
  );
};

export default FAQVisitor;

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "faq"])),
  },
});
