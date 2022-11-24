import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Title from "../Title";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { randomId } from "@mui/x-data-grid-generator";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { setUsers } from "../../../redux/dataSlice";
import { setUserSelected, toggleUserForm } from "../../../redux/commonSlice";
import { updateUser, removeUser } from "../../../firebase/service";
import useToast from "../../../hooks/useToast";
import useDocTitle from "../../../hooks/useDocTitle";

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
  useDocTitle("Users Management");
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.data.users);
  const [rows, setRows] = React.useState(usersData);
  const [deleteSelected, setDeleteSelected] = React.useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const { notify } = useToast();

  React.useEffect(() => {
    setRows(usersData);
  }, [usersData]);

  /* PROCESS ROW UPDATE */
  const processRowUpdate = (newRow, oldRow) => {
    console.log("oldRow: ", oldRow);
    console.log("newRow: ", newRow);
    if (newRow) {
      const { id, ...other } = newRow;
      notify("success", "Updated!");
      updateUser(newRow.idDB, { ...other, uid: newRow.id });
    }
    const updatedRow = { ...newRow, isNew: false };
    return updatedRow;
  };
  /* END PROCESS ROW UPDATE */

  const deleteUser = React.useCallback(
    (id) => async () => {
      notify("success", "User deleted!");
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      const userDel = await usersData.find((user) => user.id === id);
      await removeUser(userDel.idDB);
      setDeleteSelected("");
    },
    []
  );

  const columns = [
    {
      field: "delete",
      headerName: "Delete",
      width: 125,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        if (deleteSelected === params.id) {
          return (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button onClick={deleteUser(params.id)}>
                <CheckIcon sx={{ color: "#9e9e9e" }} />
              </Button>
              <Button onClick={() => setDeleteSelected("")}>
                <CancelIcon sx={{ color: "#9e9e9e" }} />
              </Button>
            </div>
          );
        } else {
          return (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button onClick={() => setDeleteSelected(params.id)}>
                <DeleteIcon sx={{ color: "#9e9e9e" }} />
              </Button>
            </div>
          );
        }
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
                : params.value.includes("data:image")
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
      width: 200,
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "password",
      headerName: "Password",
      width: 150,
    },
    {
      field: "providerId",
      headerName: "Provider",
      width: 150,
    },
    {
      field: "admin",
      headerName: "Admin*",
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
        <Title>Users Management</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectionModel.length > 0 && (
            <>
              {deleteSelected ? (
                <>
                  <Button onClick={deleteUser(deleteSelected)}>
                    <CheckIcon sx={{ color: "#9e9e9e" }} />
                  </Button>
                  <Button onClick={() => setDeleteSelected("")}>
                    <CancelIcon sx={{ color: "#9e9e9e" }} />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setDeleteSelected(selectionModel[0])}>
                  <DeleteIcon sx={{ color: "#9e9e9e" }} />
                </Button>
              )}
            </>
          )}
          <Button onClick={() => {}}>
            <EditIcon
              onClick={() => {
                if (selectionModel.length > 0) {
                  const findUser = usersData.find(
                    (prod) => prod.id === selectionModel[0]
                  );
                  dispatch(setUserSelected(findUser));
                  dispatch(toggleUserForm(true));
                }
              }}
              sx={{ color: "#8bc34a" }}
            />
          </Button>
          <Button
            onClick={() => {
              dispatch(toggleUserForm(true));
            }}
          >
            <AddIcon sx={{ color: "#8bc34a" }} />
          </Button>
        </div>
      </div>
      <StyledPaper>
        <StyledBox>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight={true}
            pageSize={10}
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
