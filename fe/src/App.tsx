import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import ApiClient from "api/ApiClient";
import { Result } from "models/Result.model";
import React, { ChangeEvent, useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const App = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isShowLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>();
  const messageRef = useRef<{ message: string }>({
    message: "",
  });
  const onBtnClick = () => {
    if (csvFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", "csv_file");
      formData.append("file", csvFile);
      ApiClient.post<Result>("/upload_file", formData)
        .then((res) => {
          const { message = "" } = res.data;
          messageRef.current = { message };
          onOpen();
          setLoading(false);
        })
        .catch((error) => setLoading(false));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  return (
    <Container maxWidth={"container.xl"}>
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
          <AlertDialogBody>{messageRef.current.message}</AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
      <Flex direction={"column"} padding="10">
        <Heading as={"h3"} size="lg">
          Generate outcome from csv file
        </Heading>
        <Input
          type={"file"}
          accept=".csv"
          onChange={handleInputChange}
          marginY="6"
        />
        <Button
          colorScheme={"green"}
          onClick={onBtnClick}
          isLoading={isShowLoading}
          w="200px"
        >
          Convert data 🚀
        </Button>
      </Flex>
    </Container>
  );
};

export default App;
