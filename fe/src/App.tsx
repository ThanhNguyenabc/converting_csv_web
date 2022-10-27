import React from "react";
import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import LessonPage from "pages/LessonPage";
import OutComePage from "pages/OutComePage";

const PAGES = [
  { title: "Create OutCome", page: <OutComePage /> },
  { title: "Create Lesson", page: <LessonPage /> },
];

const App = () => {
  return (
    <Container maxWidth={"container.xl"} mt={10}>
      <Heading as={"h3"} size="lg">
        Generate "info.dat" from csv file
      </Heading>
      <Tabs mt={5} colorScheme="green" borderColor="transparent" >
        <TabList width={'fit-content'}>
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

export default App;
