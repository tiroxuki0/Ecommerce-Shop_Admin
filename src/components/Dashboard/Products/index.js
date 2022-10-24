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
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  toggleEditProduct,
  toggleProductForm,
} from "../../../redux/commonSlice";
import { useDispatch, useSelector } from "react-redux";

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
  const productsData = useSelector((state) => state.data.products);
  const imagesData = useSelector((state) => state.data.images);
  const isEditProd = useSelector((state) => state.common.isEditProd);
  const [rows, setRows] = React.useState(productsData);
  const [selectionModel, setSelectionModel] = React.useState([]);

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
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    []
  );

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
              <Button onClick={deleteProduct(params.id)}>
                <DeleteIcon sx={{ color: "#9e9e9e" }} />
              </Button>
            </div>
          );
        },
      },
      { field: "id", headerName: "ID", width: 100 },
      {
        field: "heroImage",
        headerName: "Hero Image",
        sortable: false,
        width: 100,
        renderCell: (params) => {
          /*  */
          const path = params.value ? params.value : params.row.images[0];
          if (path.includes("/")) {
            const imagePath = path
              .slice(1)
              .split("/")
              .reduce((result, cur) => result + "%2F" + cur, "")
              .replace("%2F", "");

            const imageFinal = imagesData.find((img) =>
              img.toLowerCase().includes(imagePath.toLowerCase())
            );
            /*  */
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
                <LazyLoadImage
                  alt={path.replace("/")}
                  effect="blur"
                  src={imageFinal}
                />
              </Box>
            );
          }
        },
      },
      {
        field: "images",
        headerName: "Images detail",
        sortable: false,
        width: 200,
        renderCell: (params) => {
          return params.value.map((image, index) => {
            /*  */
            if (image.includes("/")) {
              const imagePath = image
                .slice(1)
                .split("/")
                .reduce((result, cur) => result + "%2F" + cur, "")
                .replace("%2F", "");

              const imageFinal = imagesData.find((img) =>
                img.toLowerCase().includes(imagePath.toLowerCase())
              );
              /*  */
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
                  <LazyLoadImage
                    alt={image.replace("/")}
                    effect="blur"
                    className="product_image"
                    src={imageFinal}
                  />
                </Box>
              );
            }
          });
        },
      },
      {
        field: "brand",
        headerName: "Brand",
        sortable: false,
        editable: true,
        width: 60,
      },
      {
        field: "title",
        headerName: "Title",
        sortable: false,
        editable: true,
        width: 200,
      },
      {
        field: "info",
        headerName: "Info",
        sortable: false,
        editable: true,
        width: 200,
      },
      {
        field: "category",
        headerName: "Category",
        sortable: false,
        editable: true,
        width: 100,
      },
      {
        field: "type",
        headerName: "Type",
        sortable: false,
        editable: true,
        width: 100,
      },
      {
        field: "connectivity",
        headerName: "Connectivity",
        editable: true,
        sortable: false,
        width: 100,
      },
      {
        field: "finalPrice",
        headerName: "Final Price",
        editable: true,
        width: 100,
      },
      {
        field: "originalPrice",
        headerName: "Original Price",
        editable: true,
        width: 100,
      },
      { field: "quantity", headerName: "Quantity", editable: true, width: 100 },
      { field: "ratings", headerName: "Ratings", editable: true, width: 100 },
      {
        field: "rateCount",
        headerName: "Rate Count",
        editable: true,
        width: 150,
      },
      {
        field: "tag",
        headerName: "Tag",
        editable: true,
        width: 100,
      },
      {
        field: "tagline",
        headerName: "Tag Line",
        sortable: false,
        editable: true,
        width: 200,
      },
      {
        field: "stock",
        headerName: "Stock",
        width: 100,
        editable: true,
      },
    ],
    [deleteProduct]
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
        <Title>Products Management</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isEditProd ? (
            <>
              <Button
                onClick={() => {
                  setSelectionModel([]);
                  dispatch(toggleProductForm(false));
                  dispatch(toggleEditProduct(false));
                }}
              >
                <CancelIcon sx={{ color: "#9e9e9e" }} />
              </Button>
              <Button
                onClick={() => {
                  setSelectionModel([]);
                  dispatch(toggleProductForm(false));
                  dispatch(toggleEditProduct(false));
                }}
              >
                <SaveIcon sx={{ color: "#8bc34a" }} />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                if (selectionModel.length > 0) {
                  dispatch(toggleProductForm(true));
                  dispatch(toggleEditProduct(true));
                }
              }}
            >
              <EditIcon sx={{ color: "#8bc34a" }} />
            </Button>
          )}
          <Button
            onClick={() => {
              dispatch(toggleProductForm(true));
              dispatch(toggleEditProduct(false));
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
        </StyledBox>
      </StyledPaper>
    </>
  );
}
