import { MessagesPage } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import ky from "ky";
import { useMemo } from "react";

export const useChatMessages = (chatId: string) => {
  const { data, fetchNextPage, status, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["message-list", chatId],
      queryFn: ({ pageParam }) =>
        ky
          .get(`/v1/chat/${chatId}/message`, {
            searchParams: pageParam ? { cursor: pageParam } : undefined,
          })
          .json<MessagesPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const messages = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.messages)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ) ?? [],
    [data],
  );

  const pageParam = useMemo(() => {
    return data?.pageParams.at(0);
  }, [data]);

  return {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    pageParam,
  };
};
