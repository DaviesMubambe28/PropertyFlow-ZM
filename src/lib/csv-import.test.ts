import { describe, expect, it } from "vitest";
import { parseCsvFile, validateImportRows } from "./csv-import";

describe("agency spreadsheet imports", () => {
  it("reads quoted fields and normalizes contact emails", () => {
    const result = parseCsvFile('name,email,phone,category,notes\r\n"Buyer, One",BUYER@EXAMPLE.TEST,+260973000000,buyer,"First line\nSecond line"');
    const rows = result.rows.map((row) => Object.fromEntries(result.headers.map((header, index) => [header, row[index]])));
    expect(validateImportRows("contacts", rows)).toMatchObject([
      { row: 2, data: { name: "Buyer, One", email: "buyer@example.test", notes: "First line\nSecond line" } },
    ]);
  });

  it("rejects missing prices, uneven columns and extra records", () => {
    const invalid = validateImportRows("properties", [{ title: "Test house", type: "House", location: "Lusaka", listingType: "sale", price: "" }]);
    expect(invalid[0].error).toMatch(/price/);
    expect(() => parseCsvFile("one,two\na")).toThrow();
    expect(() => parseCsvFile("title\n" + "Example\n".repeat(101))).toThrow(/100 records/);
  });
});
