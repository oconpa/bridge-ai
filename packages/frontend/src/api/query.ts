import { useQuery } from "@tanstack/react-query";
import { list } from "aws-amplify/storage";

export const useListS3 = (path: string) => {
  return useQuery({
    queryKey: [`listSpecs-${path}`],
    queryFn: async () => {
      const result = await list({ path });

      return result;
    },
  });
};
