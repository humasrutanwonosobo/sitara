import ExcelJS from "exceljs";

export interface SheetMerge {
  s: { r: number; c: number };
  e: { r: number; c: number };
}

export interface SheetColWidth {
  wch?: number;
}

export interface SheetRowHeight {
  hpt?: number;
}

export interface WorkbookProps {
  Title?: string;
  Subject?: string;
  Author?: string;
  Company?: string;
  CreatedDate?: Date;
}

export interface ExportSheetOptions {
  aoa: (string | number)[][];
  merges?: SheetMerge[];
  cols?: SheetColWidth[];
  rows?: SheetRowHeight[];
  sheetName: string;
}

export interface ExportWorkbookOptions {
  sheets: ExportSheetOptions[];
  props?: WorkbookProps;
  filename: string;
}

async function buildSheet(
  workbook: ExcelJS.Workbook,
  opts: ExportSheetOptions,
): Promise<void> {
  const sheet = workbook.addWorksheet(opts.sheetName);

  for (let r = 0; r < opts.aoa.length; r++) {
    const row = opts.aoa[r]!;
    const excelRow = sheet.getRow(r + 1);
    for (let c = 0; c < row.length; c++) {
      excelRow.getCell(c + 1).value = row[c] as string | number;
    }
  }

  if (opts.merges) {
    for (const merge of opts.merges) {
      sheet.mergeCells(
        merge.s.r + 1,
        merge.s.c + 1,
        merge.e.r + 1,
        merge.e.c + 1,
      );
    }
  }

  if (opts.cols) {
    opts.cols.forEach((col, i) => {
      if (col.wch) sheet.getColumn(i + 1).width = col.wch;
    });
  }

  if (opts.rows) {
    opts.rows.forEach((row, i) => {
      if (row.hpt) sheet.getRow(i + 1).height = row.hpt;
    });
  }
}

export async function exportWorkbook(opts: ExportWorkbookOptions): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  if (opts.props) {
    if (opts.props.Title) workbook.creator = opts.props.Author ?? "SITARA";
    workbook.created = opts.props.CreatedDate ?? new Date();
    if (opts.props.Title) workbook.title = opts.props.Title;
    if (opts.props.Subject) workbook.subject = opts.props.Subject;
    if (opts.props.Company) workbook.company = opts.props.Company;
  }

  for (const sheetOpts of opts.sheets) {
    await buildSheet(workbook, sheetOpts);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = opts.filename;
  a.click();
  URL.revokeObjectURL(url);
}
