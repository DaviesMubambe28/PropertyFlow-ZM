import { parse } from "csv-parse/browser/esm/sync";
import { z } from "zod";
import { contactInputSchema, propertyInputSchema } from "@/lib/validation/operations";

export const importKinds = z.enum(["properties", "contacts"]);
export type ImportKind = z.infer<typeof importKinds>;
export const maxImportRows = 100;
export const maxCsvBytes = 128_000;

export const importFields = {
  properties: ["title", "type", "listingType", "price", "location", "province", "description"],
  contacts: ["name", "email", "phone", "category", "leadSource", "notes"],
};

export const csvTemplates = {
  properties: "title,type,listingType,price,location,province,description\nKabulonga House,House,sale,950000,Lusaka,Lusaka,Three-bedroom house\n",
  contacts: "name,email,phone,category,leadSource,notes\nSample Buyer,buyer@example.test,+260970123456,buyer,Referral,Looking in Lusaka\n",
};

const propertyRow = propertyInputSchema.pick({
  title: true, type: true, listingType: true, price: true, location: true, province: true, description: true,
}).extend({
  price: z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Enter a price with up to two decimal places").transform(Number).refine((price) => propertyInputSchema.shape.price.safeParse(price).success, "Price is too large"),
  description: z.string().trim().max(5000).default(""),
});
const contactRow = contactInputSchema.pick({
  name: true, email: true, phone: true, category: true, leadSource: true, notes: true,
}).extend({ leadSource: z.string().trim().max(80).default(""), notes: z.string().trim().max(5000).default("") });

export function parseCsvFile(contents: string) {
  const [headers, ...rows] = parse(contents, {
    bom: true, skip_empty_lines: true, trim: true,
    max_record_size: 16_000, to: maxImportRows + 2,
  }) as string[][];
  if (!headers || !rows.length) throw new Error("Include a header and at least one data row.");
  if (headers.length > 32) throw new Error("Use 32 columns or fewer.");
  if (rows.length > maxImportRows) throw new Error(`Import up to ${maxImportRows} records at a time.`);
  return { headers, rows };
}

export function validateImportRows(kind: ImportKind, rows: unknown[]) {
  const schema = kind === "properties" ? propertyRow : contactRow;
  return rows.map((row, index) => {
    const parsed = schema.safeParse(row);
    return parsed.success
      ? { row: index + 2, data: parsed.data }
      : { row: index + 2, error: parsed.error.issues.map(({ path, message }) => `${path.join(".")}: ${message}`).join("; ") };
  });
}
