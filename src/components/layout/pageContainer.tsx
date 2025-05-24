import { type ReactNode } from "react";
import { MetaHead } from "@/components/head/metaHead";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const pageContainerVariants = cva(
  "flex min-h-screen w-full items-center justify-center px-4 py-8 md:px-8 lg:px-16",
  {
    variants: {
      variantBg: {
        primary: "pageContainerBG-primary",
        secondary: "pageContainerBG-secondary",
      },
    },
    defaultVariants: {
      variantBg: "primary",
    },
  },
);

interface PageContainerProps
  extends VariantProps<typeof pageContainerVariants> {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogImage?: string;
  ogUrl?: string;
}

export const PageContainer = ({
  children,
  title,
  description,
  keywords,
  author,
  ogImage,
  ogUrl,
  variantBg,
}: PageContainerProps) => {
  return (
    <>
      <MetaHead
        title={title}
        description={description}
        keywords={keywords}
        author={author}
        ogImage={ogImage}
        ogUrl={ogUrl}
      />
      <main className={cn(pageContainerVariants({ variantBg }))}>
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </>
  );
};
