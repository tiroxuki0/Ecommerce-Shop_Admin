import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import Title from "../Title";

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
  const imagesData = useSelector((state) => state.data.images);
  const productsData = useSelector((state) => state.data.products);
  const reviewsData = useSelector((state) => state.data.reviews);
  const [reviews, setReviews] = React.useState(
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

  const columns = [
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
      headerName: "Rating",
      editable: true,
      width: 150,
      renderCell: (params) => {
        return <Rating name="read-only" value={params.value} readOnly />;
      },
    },
    { field: "comment", headerName: "Comment", editable: true, width: 250 },
    {
      field: "createdAt",
      headerName: "Created on",
      editable: true,
      width: 150,
    },
    {
      field: "product",
      headerName: "Product",
      width: 300,
      editable: true,
      renderCell: (params) => {
        const product = productsData.find((prod) => prod.id === params.value);
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
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img style={{ width: "50px", height: "50px" }} src={imageFinal} />
            <p>{product.info}</p>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Title>Reviews</Title>
      <StyledPaper>
        <StyledBox>
          <DataGrid
            rows={reviews}
            columns={columns}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </StyledBox>
      </StyledPaper>
    </>
  );
}
