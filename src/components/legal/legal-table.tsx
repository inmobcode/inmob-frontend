/**
 * A ruled table for the legal pages: what / why / how long. On wide screens it
 * reads as columns under a header line; on small ones each row stacks, with the
 * column name above every value. No boxes, just hairlines.
 */
export function LegalTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  const grid = columns.length === 3 ? "md:grid-cols-[1.1fr_2fr_0.9fr]" : "md:grid-cols-[1fr_2fr]";
  return (
    <div role="table" className="not-prose border-t border-line text-[0.95rem] leading-snug">
      <div role="row" className={`hidden gap-6 border-b border-line py-2.5 text-sm text-quiet md:grid ${grid}`}>
        {columns.map((column) => (
          <span key={column} role="columnheader">
            {column}
          </span>
        ))}
      </div>
      {rows.map((row, index) => (
        <div key={index} role="row" className={`grid gap-1.5 border-b border-line py-4 md:gap-6 ${grid}`}>
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} role="cell" className={cellIndex === 0 ? "font-medium text-ink" : "text-ink/85"}>
              <span className="mb-0.5 block text-xs text-quiet md:hidden">{columns[cellIndex]}</span>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
