import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Upload from "components/Upload";
import React from "react";

const PAGES = [
  {
    title: "OutCome",
    page: <Upload url={"/v1/upload-outcome"} zipFileName={`outcome.zip`} />,
  },
  {
    title: "Lesson",
    page: <Upload url={"/v1/upload-lesson"} zipFileName={"lesson.zip"} />,
  },
  {
    title: "Vocabulary",
    page: <Upload url={"/v1/upload-vocab"} zipFileName={"vocab.zip"} />,
  },
  {
    title: "Vocabulary-New",
    page: <Upload url={"/v2/upload-vocab"} zipFileName={"vocabV2.zip"} />,
  },
  {
    title: "OutCome-New",
    page: <Upload url={"/v1/upload-outcome"} zipFileName={"outcomeV2.zip"} />,
  },
  {
    title: "CEFR",
    page: <Upload url={"/v1/upload-cefr"} zipFileName={"cefr.zip"} />,
  },
];

const index = () => {
  return (
    <Container maxWidth={"container.xl"} mt={10}>
      <Heading as={"h3"} size="lg">
        Generate "info.dat" from csv file
      </Heading>
      <Tabs mt={5} colorScheme="green" borderColor="transparent">
        <TabList width={"fit-content"}>
          {PAGES.map((item, index) => (
            <Tab key={`${item.title} -${index}`}>{item.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {PAGES.map((item, index) => (
            <TabPanel key={`${index}`}>{item.page}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default index;
