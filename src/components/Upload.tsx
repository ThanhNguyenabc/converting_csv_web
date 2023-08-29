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
import { AxiosError } from "axios";
import HttpClient from "utils/HttpClient";
import React, { ChangeEvent, useState } from "react";
import { DEFAULT_ERROR, SAVING_SUCCESSFULL } from "utils/MessageUtil";

interface UploadSate {
  file?: File;
  isLoading: boolean;
  message?: string;
}

type UploadParams = {
  url: string;
  zipFileName: string;
};

const Upload = ({ url, zipFileName }: UploadParams) => {
  const [data, setData] = useState<UploadSate>({
    isLoading: false,
    message: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>();

  const onBtnClick = () => {
    if (data.file) {
      const formData = new FormData();
      formData.append("title", "csv_file");
      formData.append("file", data.file);

      setData((prev) => ({ ...prev, isLoading: true }));

      HttpClient.post(url, formData, {
        responseType: "blob",
      })
        .then((res) => {
          let message = res.status === 200 ? SAVING_SUCCESSFULL : DEFAULT_ERROR;
          setData((prev) => ({ ...prev, isLoading: false, message }));
          message && onOpen();

          if (res.status == 200) {
            message = SAVING_SUCCESSFULL;
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([res.data]));
            link.download = zipFileName;
            link.click();
            link.remove();
          }
        })
        .catch((error) => {
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
        loadingText="Processing"
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
