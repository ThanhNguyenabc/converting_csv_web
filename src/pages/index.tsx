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
import { LESSON_ZIP, OUTCOME_ZIP, VOCAB_ZIP } from "utils/StringUtil";

const PAGES = [
  {
    title: "Create OutCome",
    page: <Upload url={"/api/upload-outcome"} zipFileName={OUTCOME_ZIP} />,
  },
  {
    title: "Create Lesson",
    page: <Upload url={"/api/upload-lesson"} zipFileName={LESSON_ZIP} />,
  },
  {
    title: "Vocabulary",
    page: <Upload url={"/api/upload-vocab"} zipFileName={VOCAB_ZIP} />,
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
