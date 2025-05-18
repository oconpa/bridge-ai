import { useMutation } from "@tanstack/react-query";
import { uploadData, downloadData } from "aws-amplify/storage";

interface IUploadDataS3Props {
  path: string;
  data: string;
}

export const useUploadDataS3 = () => {
  return useMutation({
    mutationFn: async ({ path, data }: IUploadDataS3Props) => {
      const result = await uploadData({
        path,
        data,
      }).result;

      return result;
    },
  });
};

export const useGetDataS3 = () => {
  return useMutation({
    mutationFn: async (path: string) => {
      const { body } = await downloadData({
        path,
      }).result;

      const text = await body.text();
      return text;
    },
  });
};
