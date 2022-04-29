import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  Blog,
  ContactUs,
  CountDown,
  Event,
  HeroImage,
  OrganizedBy,
  Sponsor,
  Topic,
} from "components/home";
import { IBlog, ISponsor } from "types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Home: NextPage = ({
  blogs,
  sponsors,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <WebLayout>
      <HeroImage />
      <CountDown />
      <Event />
      <Topic />
      <Blog blogs={blogs} />
      <Sponsor sponsors={sponsors} />
      <OrganizedBy />
      <ContactUs />
    </WebLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  let blogs: IBlog[];
  let sponsors: ISponsor[];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_API}/blogs/published`
    );
    blogs = await res.json();
  } catch (error) {
    blogs = [];
  }
  try {
    const res2 = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/sponsors`);
    sponsors = await res2.json();
  } catch (error) {
    sponsors = [];
  }

  return {
    props: {
      blogs,
      sponsors,
      ...(await serverSideTranslations(locale, ["common", "home", "seo"])),
    },
  };
};

export default Home;
