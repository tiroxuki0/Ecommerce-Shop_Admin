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
import { updateSub } from "../../../firebase/service";
import useDocTitle from "../../../hooks/useDocTitle";
import useToast from "../../../hooks/useToast";

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
  useDocTitle("Subcribers Management");
  const subsData = useSelector((state) => state.data.subs);
  const [subs, setSubs] = React.useState(
    subsData
      ? sortArray(subsData).map((sub) => {
          return {
            id: sub.id,
            createdAt: sub.createdAt.date + " | " + sub.createdAt.time,
            email: sub.email,
            contact: sub.contact && sub.contact === true ? true : false,
          };
        })
      : []
  );
  const [selectionModel, setSelectionModel] = React.useState([]);
  const { notify } = useToast();

  React.useEffect(() => {
    setSubs(
      subsData
        ? sortArray(subsData).map((sub) => {
            return {
              id: sub.id,
              createdAt: sub.createdAt.date + " | " + sub.createdAt.time,
              email: sub.email,
              contact: sub.contact && sub.contact === true ? true : false,
            };
          })
        : []
    );
  }, [subsData]);

  const processRowUpdate = (newRow, oldRow) => {
    const subFound = subsData.find((sub) => sub.id === newRow.id);
    const { id, ...other } = subFound;
    console.log(subFound);
    updateSub(id, { ...other, contact: newRow.contact });
    notify("success", "Updated!");
    const updatedRow = { ...newRow, isNew: false };
    return updatedRow;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 250,
    },
    { field: "email", headerName: "Email address", width: 300 },
    { field: "createdAt", headerName: "Sub at", width: 200 },
    {
      field: "contact",
      headerName: "Contact*",
      type: "boolean",
      editable: true,
      width: 100,
    },
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
        <Title>Subcribers</Title>
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
