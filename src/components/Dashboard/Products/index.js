import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import Title from "../Title";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {
  toggleProductForm,
  setProductSelected,
} from "../../../redux/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct } from "../../../firebase/service";
import useDocTitle from "../../../hooks/useDocTitle";
import useToast from "../../../hooks/useToast";

/* STYLES */
const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  position: "relative",
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
  useDocTitle("Products Management");
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.data.products);
  const addLoading = useSelector((state) => state.common.addLoading);
  const productSelected = useSelector((state) => state.common.productSelected);
  const [rows, setRows] = React.useState(productsData);
  const [deleteSelected, setDeleteSelected] = React.useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const { notify } = useToast();

  React.useEffect(() => {
    setRows(productsData);
  }, [productsData]);

  /* PROCESS ROW UPDATE */
  const processRowUpdate = (newRow, oldRow) => {
    console.log("oldRow: ", oldRow);
    console.log("newRow: ", newRow);
    const updatedRow = { ...newRow, isNew: false };
    return updatedRow;
  };
  /* END PROCESS ROW UPDATE */

  const deleteProduct = React.useCallback(
    (id) => () => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      const prodDel = productsData.find((prod) => prod.id === id);
      removeProduct(prodDel.idDB);
      setDeleteSelected("");
      notify("success", "Product deleted!");
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
              <Button onClick={deleteProduct(params.id)}>
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
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "heroImageBase64",
      headerName: "Hero Image",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        /*  */
        const path = params.value ? params.value : params.row.imagesBase64[0];
        return (
          <Box
            className="product_heroImage"
            sx={{
              boxShadow: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#101010" : "#fff",
              color: (theme) =>
                theme.palette.mode === "dark" ? "grey.300" : "grey.800",
              textAlign: "center",
            }}
          >
            <img src={path} />
          </Box>
        );
      },
    },
    {
      field: "imagesBase64",
      headerName: "Images detail",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return params.value.map((image, index) => {
          return (
            <Box
              key={index}
              className="product_image"
              sx={{
                boxShadow: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#101010" : "#fff",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "grey.300" : "grey.800",
                textAlign: "center",
              }}
            >
              <img src={image} />
            </Box>
          );
        });
      },
    },
    {
      field: "brand",
      headerName: "Brand",
      sortable: false,

      width: 60,
    },
    {
      field: "title",
      headerName: "Title",
      sortable: false,

      width: 200,
    },
    {
      field: "info",
      headerName: "Info",
      sortable: false,

      width: 200,
    },
    {
      field: "category",
      headerName: "Category",
      sortable: false,

      width: 100,
    },
    {
      field: "type",
      headerName: "Type",
      sortable: false,

      width: 100,
    },
    {
      field: "connectivity",
      headerName: "Connectivity",
      sortable: false,
      width: 100,
    },
    {
      field: "finalPrice",
      headerName: "Final Price",
      width: 100,
    },
    {
      field: "originalPrice",
      headerName: "Original Price",
      width: 100,
    },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "ratings", headerName: "Ratings", width: 100 },
    {
      field: "rateCount",
      headerName: "Rate Count",

      width: 150,
    },
    {
      field: "tag",
      headerName: "Tag",

      width: 100,
    },
    {
      field: "tagline",
      headerName: "Tag Line",
      sortable: false,

      width: 200,
    },
    {
      field: "stock",
      headerName: "Stock",
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
        <Title>Products Management</Title>
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
                  <Button onClick={deleteProduct(selectionModel[0])}>
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
          <Button
            onClick={() => {
              if (selectionModel.length > 0) {
                const findProduct = productsData.find(
                  (prod) => prod.id === selectionModel[0]
                );
                dispatch(setProductSelected(findProduct));
                dispatch(toggleProductForm(true));
              }
            }}
          >
            <EditIcon sx={{ color: "#8bc34a" }} />
          </Button>
          <Button
            onClick={() => {
              if (productSelected) {
                dispatch(setProductSelected(null));
              }
              dispatch(toggleProductForm(true));
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
            pageSize={5}
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
            density="comfortable"
          />
          {addLoading && (
            <div className="product_loading">
              <div className="balls">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </StyledBox>
      </StyledPaper>
    </>
  );
}
/* <div className="product_loading">
          <div className="balls">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div> */
