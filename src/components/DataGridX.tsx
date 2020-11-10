import * as React from "react";
import { DataGrid, RowData, GridApi } from "@material-ui/data-grid";
import {
  useDemoData,
  randomInt,
  randomUserName,
} from "@material-ui/x-grid-data-generator";
import { interval } from "rxjs";

export default function ControlledSelectionGrid() {
  const apiRef = React.useRef<GridApi | null>(null);
  
  //const apiRef2 = useApiRef();
  //console.log("apiRef2 ", apiRef2.current);
  //const apiRef = React.useRef(null);
  //const apiRef = useApiRef();
  console.log("apiRef.current: ", apiRef.current);

  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 10,
    maxColumns: 6,
  });

  React.useEffect(() => {
    //const rowModels = apiRef.current.getRowModels();
    const rowModels = apiRef.current?.getRowModels();
    if (rowModels) {
      apiRef.current?.setRowModels(
        rowModels.map((r) => {
          r.selected = r.data.quantity > 20000;
          return r;
        })
      );
      
    }
  }, [data]);

  React.useEffect(() => {
    //const rowsMeta = apiRef.current?.getAllRowIds();
    //const theId = rowsMeta[randomInt(1, 4)];
    const subscription = interval(1000).subscribe(() => {
      const rowModels = apiRef.current?.getRowModels();
      const tName = randomUserName();
      const tQuantity = randomInt(200, 40000);
      console.log(tName);
      apiRef.current?.updateRowData([
        {
          id: apiRef.current?.getAllRowIds()[randomInt(0, 9)],
          traderName: tName,
          quantity: tQuantity,
        },
        {
          id: randomInt(1, 2),
        },
      ]);
      if (rowModels) {
        apiRef.current?.setRowModels(
          rowModels.map((r) => {
            r.selected = r.data.quantity > 20000;
            return r;
          })
        );
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [apiRef]);

  // TODO: https://github.com/mui-org/material-ui-x/issues/246
  const [, setSelection] = React.useState<RowData[]>([]);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        checkboxSelection
        onSelectionChange={(newSelection) => {
          setSelection(newSelection.rows);
        }}
        components={{
          noRowsOverlay: (params) => {
            if (!apiRef.current) {
              apiRef.current = params.api.current;
            }
            return <div>No rows</div>;
          },
        }}
        {...data}
      />
    </div>
  );
}
