import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: "/app/main-hall",
      permanent: true,
    },
  };
};

export default getStaticProps;
