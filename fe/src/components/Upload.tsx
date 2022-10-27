import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import ApiClient from "api/ApiClient";
import { AxiosError } from "axios";
import { Result } from "models/Result.model";
import React, { ChangeEvent, useState } from "react";

interface UploadSate {
  file?: File;
  isLoading: boolean;
  message?: string;
}

type UploadParams = {
  url: string;
};

const Upload = ({ url }: UploadParams) => {
  const [data, setData] = useState<UploadSate>({
    isLoading: false,
    message: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>();

  const onBtnClick = () => {
    if (data.file) {
      console.log("true");
      const formData = new FormData();
      formData.append("title", "csv_file");
      formData.append("file", data.file);
      ApiClient.post<Result>(url, formData)
        .then((res) => {
          const { message = "" } = res.data;
          setData((prev) => ({ ...prev, isLoading: false, message }));
          message && onOpen();
        })
        .catch((error) => {
          console.log(error);
          let message = "";
          if (error instanceof AxiosError) {
            message = error.response?.data?.["message"];
          }
          setData((prev) => ({ ...prev, isLoading: false, message }));
          message && onOpen();
        });
    }
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData((prev) => ({ ...prev, file: file }));
    }
  };

  return (
    <Box>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Alert</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{data.message}</AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>

      <Input type={"file"} accept=".csv" onChange={onChangeInput} marginY="6" />
      <Button
        colorScheme={"green"}
        onClick={onBtnClick}
        isLoading={data.isLoading}
        w="200px"
      >
        Send file 🚀
      </Button>
    </Box>
  );
};

export default Upload;
