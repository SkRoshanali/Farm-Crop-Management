import React from 'react';
import { MdSearch, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import './DataTable.css';

export default function DataTable({
  columns, rows, totalRows,
  search, onSearch,
  sortKey, sortDir, onSort,
  page, totalPages, onPageChange,
  loading, emptyMessage = 'No data found',
  actions
}) {
  return (
    <div className="dt-wrapper">
      <div className="dt-toolbar">
        <div className="dt-search">
          <MdSearch size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <span className="dt-count">{totalRows} record{totalRows !== 1 ? 's' : ''}</span>
      </div>

      <div className="dt-scroll">
        <table className="dt">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && onSort(col.key)}
                  className={col.sortable !== false ? 'dt-th--sortable' : ''}
                >
                  <span>{col.label}</span>
                  {sortKey === col.key && (
                    sortDir === 'asc' ? <MdArrowUpward size={14}/> : <MdArrowDownward size={14}/>
                  )}
                </th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="dt-loading">
                <div className="dt-spinner" />
              </td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="dt-empty">
                {emptyMessage}
              </td></tr>
            ) : rows.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row) : (row[col.key] ?? '—')}</td>
                ))}
                {actions && <td className="dt-actions">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="dt-pagination">
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹ Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={p === page ? 'dt-page--active' : ''}
              onClick={() => onPageChange(p)}
            >{p}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next ›</button>
        </div>
      )}
    </div>
  );
}
