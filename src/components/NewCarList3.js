import React from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
 
const columns = [
  { key: 'id', name: 'ID', filterable: true, resizeable: true },
  { key: 'title', name: 'Title', filterable: true, resizeable: true }
];
 
const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' }
];
 
export default function showGrid() {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
    />
  );
}