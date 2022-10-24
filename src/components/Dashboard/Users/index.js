import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Title from "../Title";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { randomId } from "@mui/x-data-grid-generator";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { setUsers } from "../../../redux/dataSlice";

/* const initialRows = [
  {
    id: 1,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Snow",
    email: "Jon",
    admin: false,
    password: 35,
  },
  {
    id: 2,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Lannister",
    email: "Cersei",
    admin: false,
    password: 42,
  },
  {
    id: 3,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Lannister",
    email: "Jaime",
    admin: false,
    password: 45,
  },
  {
    id: 4,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Stark",
    email: "Arya",
    admin: false,
    password: 16,
  },
  {
    id: 5,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Targaryen",
    email: "Daenerys",
    admin: false,
    password: 45,
  },
  {
    id: 6,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Melisandre",
    email: "HEHEHEH",
    admin: false,
    password: 150,
  },
  {
    id: 7,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Clifford",
    email: "Ferrara",
    admin: false,
    password: 44,
  },
  {
    id: 8,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Frances",
    email: "Rossini",
    admin: false,
    password: 36,
  },
  {
    id: 9,
    photoURL:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    username: "Roxie",
    email: "Harvey",
    admin: false,
    password: 65,
  },
]; */

/* STYLES */
const StyledBox = styled(Box)(({ theme }) => ({
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
/* END STYLES */

export default function DataTable() {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.data.users);
  const [isEdit, setIsEdit] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);

  /* PROCESS ROW UPDATE */
  const processRowUpdate = (newRow, oldRow) => {
    console.log("oldRow: ", oldRow);
    console.log("newRow: ", newRow);
    const updatedRow = { ...newRow, isNew: false };
    return updatedRow;
  };
  /* END PROCESS ROW UPDATE */

  const deleteUser = (id) => {
    /* const usersArray = Object.keys(usersData).map((item) => {
      return { ...usersData[item], id: item };
    });
    setTimeout(() => {
      dispatch(setUsers(users));
    }); */
  };

  const columns = React.useMemo(
    () => [
      {
        field: "delete",
        headerName: "Delete",
        width: 70,
        sortable: false,
        disableClickEventBubbling: true,
        renderCell: (params) => {
          return (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => {
                  deleteUser(params.id);
                }}
              >
                <DeleteIcon sx={{ color: "#9e9e9e" }} />
              </Button>
            </div>
          );
        },
      },
      { field: "id", headerName: "UID", width: 150 },
      {
        field: "photoURL",
        headerName: "Photo URL",
        width: 100,
        align: "center",
        renderCell: (params) => {
          return (
            <Avatar
              alt={params.row.username}
              src={
                params.value.includes("http")
                  ? params.value
                  : `data:image/svg+xml;base64,${params.value}`
              }
            />
          );
        },
      },
      {
        field: "username",
        headerName: "Username",
        editable: true,
        width: 200,
      },
      { field: "email", headerName: "Email", editable: true, width: 200 },
      {
        field: "password",
        headerName: "Password",
        editable: true,
        width: 150,
      },
      {
        field: "providerId",
        headerName: "Provider",
        editable: true,
        width: 150,
      },
      {
        field: "admin",
        headerName: "Admin",
        type: "boolean",
        width: 100,
        editable: true,
      },
    ],
    [deleteUser]
  );

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
        <Title>Users Management</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isEdit ? (
            <>
              <Button
                onClick={() => {
                  setSelectionModel([]);
                  setIsEdit(false);
                }}
              >
                <CancelIcon sx={{ color: "#9e9e9e" }} />
              </Button>
              <Button
                onClick={() => {
                  setSelectionModel([]);
                  setIsEdit(false);
                }}
              >
                <SaveIcon sx={{ color: "#8bc34a" }} />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                if (selectionModel.length > 0) {
                  setIsEdit(true);
                }
              }}
            >
              <EditIcon sx={{ color: "#8bc34a" }} />
            </Button>
          )}
          <Button onClick={() => {}}>
            <AddIcon sx={{ color: "#8bc34a" }} />
          </Button>
        </div>
      </div>
      <StyledPaper>
        <StyledBox>
          <DataGrid
            rows={usersData}
            columns={columns}
            pageSize={10}
            autoHeight={true}
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(err) => console.log(err)}
            editMode="row"
            experimentalFeatures={{ newEditingApi: true }}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            hideFooterSelectedRowCount={true}
          />
        </StyledBox>
      </StyledPaper>
    </>
  );
}
