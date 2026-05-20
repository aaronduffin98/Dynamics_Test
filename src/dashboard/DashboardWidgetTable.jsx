import { useMemo, useState } from "react";
import { Input } from "@fluentui/react-components";
import { SearchRegular } from "@fluentui/react-icons";

export default function DashboardWidgetTable({
  columns,
  rows,
  onRowClick,
  linkColumn,
}) {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      Object.values(row.cells).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, filter]);

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  };

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="dashboard-widget-table">
      <div className="dashboard-widget-table__search">
        <Input
          className="dynamics-keyword-search"
          placeholder="Filter by keyword"
          value={filter}
          onChange={(_, d) => setFilter(d.value)}
          contentBefore={<SearchRegular className="dynamics-keyword-search__icon" aria-hidden />}
          aria-label="Filter by keyword"
          size="small"
        />
      </div>
      <div className="dashboard-widget-table__scroll">
        <table className="dashboard-widget-table__grid">
          <thead>
            <tr>
              <th className="dashboard-widget-table__check-col">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th key={col.id}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="dashboard-widget-table__empty">
                  No data available
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={row.id}
                  className={onRowClick ? "dashboard-widget-table__row--clickable" : ""}
                  onClick={() => onRowClick?.(row.id)}
                >
                  <td className="dashboard-widget-table__check-col" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.id}`}
                      checked={selected.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  {columns.map((col) => {
                    const value = row.cells[col.id];
                    const isLink = col.id === linkColumn && onRowClick;
                    return (
                      <td key={col.id}>
                        {isLink ? (
                          <button
                            type="button"
                            className="dashboard-widget-table__link"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowClick(row.id);
                            }}
                          >
                            {value}
                          </button>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
