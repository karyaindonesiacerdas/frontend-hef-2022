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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_API}/blogs/published`
  );
  const blogs: IBlog[] = await res.json();

  const res2 = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/sponsors`);
  const sponsors: ISponsor = await res2.json();

  return {
    props: {
      blogs,
      sponsors,
      ...(await serverSideTranslations(locale, ["common", "home", "seo"])),
    },
  };
};

export default Home;
