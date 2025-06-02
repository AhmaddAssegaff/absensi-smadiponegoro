import { useRouter } from "next/router";

interface QueryParams {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: string;
  [key: string]: string | undefined;
}

export const useSetQueryParams = () => {
  const router = useRouter();

  const setQueryParams = (params: Partial<QueryParams>) => {
    const currentParams = router.query;
    const newParams = { ...currentParams, ...params };

    Object.keys(newParams).forEach((key) => {
      const val = newParams[key];
      if (val === undefined || val === null || val === "") {
        delete newParams[key];
      }
    });

    void router.replace(
      {
        pathname: router.pathname,
        query: newParams,
      },
      undefined,
      { shallow: true },
    );
  };

  return { setQueryParams };
};
