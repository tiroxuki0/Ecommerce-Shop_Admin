import * as React from "react";
import Paper from "@mui/material/Paper";
import Title from "../Title";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { sortArray } from "../../../helpers/utils";

const StyledBox = styled(Box)(({ theme }) => ({
  height: 550,
  width: "100%",
  "& .MuiDataGrid-cell--editing": {
    backgroundColor: "rgb(255,215,115, 0.19)",
    color: "#1a3e72",
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  "& .Mui-error": {
    backgroundColor: `rgb(126,10,15, ${
      theme.palette.mode === "dark" ? 0 : 0.1
    })`,
    color: theme.palette.error.main,
  },
}));

const StyledPaper = styled(Paper)`
  .MuiDataGrid-virtualScroller {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #888;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
`;

export default function Orders() {
  const subsData = useSelector((state) => state.data.subs);
  const [subs, setSubs] = React.useState(
    subsData
      ? sortArray(subsData).map((sub) => {
          return {
            id: sub.id,
            createdAt: sub.createdAt.date + " | " + sub.createdAt.time,
            email: sub.email,
          };
        })
      : []
  );
  const [selectionModel, setSelectionModel] = React.useState([]);

  React.useEffect(() => {
    setSubs(
      subsData
        ? sortArray(subsData).map((sub) => {
            return {
              id: sub.id,
              createdAt: sub.createdAt.date + " | " + sub.createdAt.time,
              email: sub.email,
            };
          })
        : []
    );
  }, [subsData]);

  const processRowUpdate = (newRow, oldRow) => {
    console.log("oldRow: ", oldRow);
    console.log("newRow: ", newRow);
    const updatedRow = { ...newRow, isNew: false };
    return updatedRow;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 300,
    },
    { field: "email", headerName: "Email address", width: 300 },
    { field: "createdAt", headerName: "createdAt", editable: true, width: 200 },
  ];

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <Title>Emails</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button onClick={() => {}}>
            <CancelIcon sx={{ color: "#9e9e9e" }} />
          </Button>
          <Button onClick={() => {}}>
            <SaveIcon sx={{ color: "#8bc34a" }} />
          </Button>
          <Button
            onClick={() => {
              console.log(selectionModel[0]);
            }}
          >
            <EditIcon sx={{ color: "#8bc34a" }} />
          </Button>
          <Button onClick={() => {}}>
            <AddIcon sx={{ color: "#8bc34a" }} />
          </Button>
        </div>
      </div>
      <StyledPaper>
        <StyledBox>
          <DataGrid
            rows={subs}
            columns={columns}
            pageSize={10}
            // loading
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(err) => console.log(err)}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            editMode="row"
            experimentalFeatures={{ newEditingApi: true }}
            components={{
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            hideFooterSelectedRowCount
          />
        </StyledBox>
      </StyledPaper>
    </>
  );
}
