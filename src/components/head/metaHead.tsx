import Head from "next/head";

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export const MetaHead: React.FC<MetaProps> = ({
  title = "SMA Islam Diponegoro Surkarta",
  description = "default description",
  keywords = "default keyword",
  author = "SMA Islam Diponegoro Surkarta",
  ogTitle,
  ogDescription,
  ogImage = "/default-image.png",
  ogUrl = "",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta property="og:title" content={ogTitle ?? title} />
      <meta property="og:description" content={ogDescription ?? description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
