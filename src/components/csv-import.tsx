"use client";

import { useState, useTransition } from "react";
import { importAgencyCsv } from "@/actions/imports";
import { csvTemplates, importFields, type ImportKind, maxCsvBytes, parseCsvFile, validateImportRows } from "@/lib/csv-import";

const fieldClass = "mt-1 block w-full rounded-lg border border-line bg-canvas p-2";

export function CsvImport({ organizationId }: { organizationId: string }) {
  const [kind, setKind] = useState<ImportKind>("properties");
  const [file, setFile] = useState<ReturnType<typeof parseCsvFile> | null>(null);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [reading, setReading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fields = importFields[kind];
  const mapped = file?.rows.map((row) => Object.fromEntries(fields.filter((field) => mapping[field] >= 0).map((field) => [field, row[mapping[field]]]))) ?? [];
  const preview = validateImportRows(kind, mapped);
  const issues = preview.filter((row) => row.error);

  async function load(selected?: File) {
    setFile(null);
    setMessage("");
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".csv") || selected.size > maxCsvBytes) {
      setMessage("Choose a CSV file smaller than 128 KB.");
      return;
    }
    setReading(true);
    try {
      const parsed = parseCsvFile(await selected.text());
      setMapping(Object.fromEntries(fields.map((field) => [
        field, parsed.headers.findIndex((header) => header.toLowerCase() === field.toLowerCase()),
      ])));
      setFile(parsed);
    } catch {
      setMessage("Use a valid CSV with a header, matching columns and 1–100 data rows.");
    } finally {
      setReading(false);
    }
  }

  function confirmImport() {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await importAgencyCsv({ organizationId, kind, rows: mapped });
        if ("error" in result && result.error) {
          setMessage(result.error);
        } else {
          setFile(null);
          setMessage(`${result.inserted} ${result.inserted === 1 ? "record" : "records"} imported. ${result.duplicates} duplicates skipped.`);
        }
      } catch {
        setMessage("The import could not finish. Retry to skip records already saved.");
      }
    });
  }

  return (
    <div className="mt-4 space-y-5 text-sm">
      <p className="text-quiet">Import up to 100 properties or contacts at a time. Properties are saved as drafts. Existing records are kept, and duplicates by contact email or property title, location and listing type are skipped.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Record type
          <select className={fieldClass} value={kind} disabled={pending || reading} onChange={(event) => {
            setKind(event.target.value === "contacts" ? "contacts" : "properties");
            setFile(null);
            setMessage("");
          }}>
            <option value="properties">Properties</option><option value="contacts">Contacts</option>
          </select>
        </label>
        <label>CSV file
          <input key={kind} className={fieldClass} type="file" accept=".csv,text/csv" disabled={pending || reading} onChange={(event) => void load(event.target.files?.[0])} />
        </label>
      </div>
      <a className="font-semibold text-brand underline" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvTemplates[kind])}`} download={`${kind}-template.csv`}>Download {kind} template</a>
      {file && (
        <div className="space-y-4 border-t border-line pt-4">
          <h3 className="font-semibold">Map spreadsheet columns</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label key={field}>{field.replace(/([A-Z])/g, " $1")}
                <select className={fieldClass} value={mapping[field] ?? -1} disabled={pending} onChange={(event) => setMapping({ ...mapping, [field]: Number(event.target.value) })}>
                  <option value={-1}>Skip column</option>
                  {file.headers.map((header, index) => <option key={index} value={index}>{header || `Column ${index + 1}`}</option>)}
                </select>
              </label>
            ))}
          </div>
          <h3 className="font-semibold">Preview · {preview.length} rows</h3>
          {issues.length > 0 && (
            <ul className="max-h-52 space-y-1 overflow-auto rounded-lg bg-red-50 p-3 text-red-900" aria-label="Import validation issues">
              {issues.map((issue) => <li key={issue.row}>Row {issue.row} · {issue.error}</li>)}
            </ul>
          )}
          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-tint"><tr>{fields.map((field) => <th key={field} scope="col" className="p-2">{field}</th>)}</tr></thead>
              <tbody>{mapped.slice(0, 5).map((row, index) => <tr key={index} className="border-b border-line">
                {fields.map((field) => <td key={field} className="max-w-56 break-words p-2">{row[field] || "—"}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
          <button type="button" className="brand-button-primary min-h-11 rounded-lg px-4 font-semibold disabled:opacity-60" disabled={pending || issues.length > 0} onClick={confirmImport}>
            {pending ? "Importing…" : `Confirm import of ${preview.length} ${preview.length === 1 ? "row" : "rows"}`}
          </button>
        </div>
      )}
      {message && <p role="status" className="rounded-lg bg-tint p-3">{message}</p>}
    </div>
  );
}
