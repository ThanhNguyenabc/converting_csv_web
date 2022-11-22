import { formatURL, URL_PREFIX } from "../src/utils/StringUtil";

test("format url", () => {
  expect(
    formatURL(
      "http://ilawiki.ilavietnam.com/tiki-index.php?page=ILA+Test+Descriptions"
    )
  ).toContain(URL_PREFIX);
});
