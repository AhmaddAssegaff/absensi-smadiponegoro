import { type ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
};

export const SectionContiner = ({ children }: SectionContainerProps) => {
  return (
    <>
      <section className="bg container mx-auto px-4">{children}</section>
    </>
  );
};
