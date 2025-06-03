import { type ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
};

export const SectionContiner = ({ children }: SectionContainerProps) => {
  return (
    <section className="mx-auto w-full max-w-screen-md px-4 sm:px-6 lg:px-8">
      {children}
    </section>
  );
};
