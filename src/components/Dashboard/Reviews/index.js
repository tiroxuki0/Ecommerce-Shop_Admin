import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import CancelIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import Title from "../Title";
import { updateReview } from "../../../firebase/service";
import useToast from "../../../hooks/useToast";
import { removeReview } from "../../../firebase/service";
import useDocTitle from "../../../hooks/useDocTitle";

/* STYLED START */
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
/* STYLED END */

export default function QuickFilteringGrid() {
  useDocTitle("Reviews Management");
  const imagesData = useSelector((state) => state.data.images);
  const productsData = useSelector((state) => state.data.products);
  const reviewsData = useSelector((state) => state.data.reviews);
  const [rows, setRows] = React.useState(
    reviewsData.map((review) => {
      return {
        id: review.id,
        name: review.name,
        rating: review.rateCount,
        comment: review.review,
        createdAt: review.createdAt.text,
        product: review.productId,
        photoURL: review.photoURL,
      };
    })
  );
  const [deleteSelected, setDeleteSelected] = React.useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const { notify } = useToast();

  const deleteReview = React.useCallback(
    (id) => async () => {
      notify("success", "Review deleted!");
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      const reviewDel = await reviewsData.find((review) => review.id === id);
      await removeReview(reviewDel.idDB);
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
      align: "center",
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
              <Button onClick={deleteReview(params.id)}>
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
    {
      field: "id",
      headerName: "ID",
      width: 150,
      renderCell: (params) => {
        return <p>{params.id}</p>;
      },
    },
    {
      field: "name",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Avatar
              alt={params.row.name}
              src={
                params.row.photoURL.includes("http")
                  ? params.row.photoURL
                  : `data:image/svg+xml;base64,${params.row.photoURL}`
              }
            />
            <p>{params.value}</p>
          </div>
        );
      },
    },
    {
      field: "rating",
      headerName: "Rating*",
      editable: true,
      width: 150,
      renderCell: (params) => {
        return (
          <Rating name="read-only" value={Number(params.value)} readOnly />
        );
      },
    },
    { field: "comment", headerName: "Comment*", editable: true, width: 250 },
    {
      field: "createdAt",
      headerName: "Created on",
      width: 150,
    },
    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => {
        const product = productsData.find((prod) => prod.id === params.value);
        if (product) {
          const image = product.images[0];
          let imageFinal = image;
          if (image.includes("/")) {
            const imagePath = image
              .slice(1)
              .split("/")
              .reduce((result, cur) => result + "%2F" + cur, "")
              .replace("%2F", "");

            imageFinal = imagesData.find((img) =>
              img.toLowerCase().includes(imagePath.toLowerCase())
            );
            return (
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <img
                  style={{ width: "50px", height: "50px" }}
                  src={imageFinal}
                />
                <p>{product.info}</p>
              </div>
            );
          }
        } else {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img style={{ width: "50px", height: "50px" }} src={""} />
              <p>{"Product deleted"}</p>
            </div>
          );
        }
      },
    },
  ];

  const processRowUpdate = (newRow, oldRow) => {
    const reviewFound = reviewsData.find((review) => review.id === newRow.id);
    const { idDB, ...other } = reviewFound;
    updateReview(idDB, {
      ...other,
      rateCount: Number(newRow.rating),
      review: newRow.comment,
    });
    notify("success", "Updated!");
    const updatedRow = { ...newRow, isNew: false };
    return updatedRow;
  };

  return (
    <>
      <Title>Reviews</Title>
      <StyledPaper>
        <StyledBox>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(err) => console.log(err)}
            experimentalFeatures={{ newEditingApi: true }}
            components={{ Toolbar: GridToolbar }}
            editMode="row"
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
