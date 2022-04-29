export type IBlog = {
  _id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
  image: {
    src: string;
    filename: string;
  };
};
