import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: "/admin/dashboard",
      permanent: true,
    },
  };
};

export default getStaticProps;
