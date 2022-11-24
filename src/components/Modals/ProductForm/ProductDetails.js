import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import { setActiveStep, setProductDetails } from "../../../redux/commonSlice";
import { useDispatch, useSelector } from "react-redux";

const brands = ["JBL", "boAt", "Sony"];
const categories = ["Headphones", "Earbuds", "Earphones", "Neckbands"];
const types = ["In-Ear", "On-Ear", "Over-Ear"];
const tags = ["hero-product", "featured-product"];
const connectivities = ["Wireless", "Wired", "Bluetooth & Wired"];

export default function ProductDetails() {
  const dispatch = useDispatch();
  const productSelected = useSelector((state) => state.common.productSelected);
  const productDetails = useSelector((state) => state.common.productDetails);
  const activeStep = useSelector((state) => state.common.productStep);
  const [prodDetails, setProdDetails] = React.useState(
    productSelected
      ? { ...productSelected, heroImage: { path: null, src: null }, images: [] }
      : productDetails
      ? productDetails
      : {
          id: null,
          heroImage: null,
          images: [],
          brand: null,
          category: null,
          connectivity: null,
          finalPrice: null,
          info: null,
          originalPrice: null,
          path: "/product-details/",
          quantity: null,
          rateCount: null,
          ratings: null,
          stock: null,
          tag: null,
          tagline: null,
          title: null,
          type: null,
        }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setProductDetails(prodDetails));
    dispatch(setActiveStep(activeStep + 1));
  };

  const onChangeProductDetails = ({ field, value }) => {
    /* (field, value) */
    switch (field) {
      case "id":
        setProdDetails((prev) => {
          return { ...prev, id: value };
        });
        break;
      case "heroImage":
        setProdDetails((prev) => {
          return { ...prev, heroImage: value };
        });
        break;
      case "images":
        setProdDetails((prev) => {
          return { ...prev, images: value };
        });
        break;
      case "brand":
        setProdDetails((prev) => {
          return { ...prev, brand: value };
        });
        break;
      case "category":
        setProdDetails((prev) => {
          return { ...prev, category: value };
        });
        break;
      case "connectivity":
        setProdDetails((prev) => {
          return { ...prev, connectivity: value };
        });
        break;
      case "finalPrice":
        setProdDetails((prev) => {
          return { ...prev, finalPrice: value };
        });
        break;
      case "originalPrice":
        setProdDetails((prev) => {
          return { ...prev, originalPrice: value };
        });
        break;
      case "path":
        setProdDetails((prev) => {
          return { ...prev, path: value };
        });
        break;
      case "quantity":
        setProdDetails((prev) => {
          return { ...prev, quantity: value };
        });
        break;
      case "rateCount":
        setProdDetails((prev) => {
          return { ...prev, rateCount: value };
        });
        break;
      case "ratings":
        setProdDetails((prev) => {
          return { ...prev, ratings: value };
        });
        break;
      case "stock":
        setProdDetails((prev) => {
          return { ...prev, stock: value };
        });
        break;
      case "tag":
        setProdDetails((prev) => {
          return { ...prev, tag: value };
        });
        break;
      case "tagline":
        setProdDetails((prev) => {
          return { ...prev, tagline: value };
        });
        break;
      case "title":
        setProdDetails((prev) => {
          return { ...prev, title: value };
        });
        break;
      case "type":
        setProdDetails((prev) => {
          return { ...prev, type: value };
        });
        break;
      case "info":
        setProdDetails((prev) => {
          return { ...prev, info: value };
        });
        break;
      default:
        console.log("error");
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Product details
      </Typography>
      <ValidatorForm onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={
                prodDetails.brand
                /* ? prodDetails.brand
                  : productSelected
                  ? productSelected.brand
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "brand",
                  value: e.target.value,
                });
              }}
              id="brand"
              name="brand"
              label="Brand"
              fullWidth
              select
              variant="standard"
              validators={["required"]}
              errorMessages={["Please select product's brand"]}
            >
              {brands.map((brand) => {
                return (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                );
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={
                prodDetails.category
                /* ? prodDetails.category
                  : productSelected
                  ? productSelected.category
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "category",
                  value: e.target.value,
                });
              }}
              id="category"
              name="category"
              label="Category"
              fullWidth
              select
              variant="standard"
              validators={["required"]}
              errorMessages={["Please select category"]}
            >
              {categories.map((category) => {
                return (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                );
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={
                prodDetails.type
                /* ? prodDetails.type
                  : productSelected
                  ? productSelected.type.split(" ")[0] +
                    "-" +
                    productSelected.type.split(" ")[1]
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "type",
                  value: e.target.value,
                });
              }}
              id="type"
              name="type"
              label="Type"
              fullWidth
              select
              variant="standard"
              validators={["required"]}
              errorMessages={["Please select type"]}
            >
              {types.map((type) => {
                return (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                );
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={
                prodDetails.connectivity
                /*  ? prodDetails.connectivity
                  : productSelected
                  ? productSelected.connectivity
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "connectivity",
                  value: e.target.value,
                });
              }}
              id="connectivity"
              name="connectivity"
              label="Connectivity"
              fullWidth
              select
              variant="standard"
              validators={["required"]}
              errorMessages={["Please select connectivity"]}
            >
              {connectivities.map((type) => {
                return (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                );
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={
                prodDetails.tag
                /* ? prodDetails.tag
                  : productSelected
                  ? productSelected.tag
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "tag",
                  value: e.target.value,
                });
              }}
              id="tag"
              name="tag"
              label="Tag"
              fullWidth
              select
              variant="standard"
            >
              {tags.map((tag) => {
                return (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                );
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextValidator
              value={
                prodDetails.tagline
                /* ? prodDetails.tagline
                  : productSelected
                  ? productSelected.tagline
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "tagline",
                  value: e.target.value,
                });
              }}
              id="tagline"
              name="tagline"
              label="Tag line"
              fullWidth
              autoComplete="family-name"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextValidator
              value={
                prodDetails.title
                /* ? prodDetails.title
                  : productSelected
                  ? productSelected.title
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "title",
                  value: e.target.value,
                });
              }}
              id="title"
              name="title"
              label="Title"
              fullWidth
              autoComplete="family-name"
              variant="standard"
              validators={["required"]}
              errorMessages={["Please enter product's title"]}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextValidator
              value={
                prodDetails.info
                /* ? prodDetails.info
                  : productSelected
                  ? productSelected.info
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "info",
                  value: e.target.value,
                });
              }}
              id="info"
              name="info"
              label="Info"
              fullWidth
              autoComplete="info"
              variant="standard"
              validators={["required"]}
              errorMessages={["Please enter product's info"]}
            />
          </Grid>
          {/*  */}
          <Grid item xs={12} sm={3}>
            <TextValidator
              value={
                prodDetails.finalPrice
                /* ? prodDetails.finalPrice
                  : productSelected
                  ? productSelected.finalPrice
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "finalPrice",
                  value: e.target.value,
                });
              }}
              id="finalPrice"
              name="finalPrice"
              label="Final Price"
              fullWidth
              autoComplete="family-name"
              variant="standard"
              validators={["required", "isNumber", "minNumber:0"]}
              errorMessages={[
                "Please enter product's final price",
                "Number only!",
                "Final price is not valid!",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextValidator
              value={
                prodDetails.originalPrice
                /* ? prodDetails.originalPrice
                  : productSelected
                  ? productSelected.originalPrice
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "originalPrice",
                  value: e.target.value,
                });
              }}
              id="originalPrice"
              name="originalPrice"
              label="Original Price"
              fullWidth
              variant="standard"
              autoComplete="family-name"
              validators={["required", "isNumber", "minNumber:0"]}
              errorMessages={[
                "Please enter product's original price",
                "Number only!",
                "Original price is not valid!",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextValidator
              value={
                prodDetails.ratings
                /* ? prodDetails.ratings
                  : productSelected
                  ? productSelected.ratings
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "ratings",
                  value: e.target.value,
                });
              }}
              id="ratings"
              name="ratings"
              label="Ratings"
              fullWidth
              variant="standard"
              autoComplete="family-name"
              validators={["required", "isNumber", "minNumber:0"]}
              errorMessages={[
                "Please enter produt's ratings",
                "Number only!",
                "Ratings is not valid!",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextValidator
              value={
                prodDetails.rateCount
                /* ? prodDetails.rateCount
                  : productSelected
                  ? productSelected.rateCount
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "rateCount",
                  value: e.target.value,
                });
              }}
              id="rateCount"
              name="rateCount"
              label="Rate Count"
              fullWidth
              variant="standard"
              autoComplete="family-name"
              validators={[
                "required",
                "isNumber",
                "minNumber:1",
                "maxNumber:5",
              ]}
              errorMessages={[
                "Please enter product's rate count",
                "Number only!",
                "Rate count is bigger than 0!",
                "Rate count is less than 5!",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextValidator
              value={
                prodDetails.stock
                /* ? prodDetails.stock
                  : productSelected
                  ? productSelected.stock
                  : "" */
              }
              onChange={(e) => {
                onChangeProductDetails({
                  field: "stock",
                  value: e.target.value,
                });
              }}
              id="stock"
              name="stock"
              label="Stock"
              fullWidth
              variant="standard"
              autoComplete="family-name"
              validators={["required", "isNumber", "minNumber:0"]}
              errorMessages={[
                "Please enter product's stock",
                "Number only!",
                "Product's stock is not valid!",
              ]}
            />
          </Grid>
        </Grid>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end" }}
          className="btns_images"
        >
          <Button
            variant="contained"
            onClick={() => {}}
            sx={{ mt: 3, ml: 1 }}
            className="btn_checkout"
            type="submit"
          >
            Next
          </Button>
        </Box>
      </ValidatorForm>
    </React.Fragment>
  );
}
/* export const sortMenu = [
    "Latest",
    "Featured",
    "Top Rated",
    "Price(Lowest First)",
    "Price(Highest First)"
];

export const filterMenu = [
    {
        id: 1,
        title: "Brands",
        menu: [
            "JBL",
            "BoAt",
            "Sony"
        ],
    },
    {
        id: 2,
        title: "Category",
        menu: [
            "Headphones",
            "Earbuds",
            "Earphones",
            "Neckbands"
        ],
    },
    {
        id: 3,
        title: "Type",
        menu: [
            "In-Ear",
            "On-Ear",
            "Over-Ear",
        ],
    },
    {
        id: 4,
        title: "Price",
        menu: [
            "500 & Below",
            "501 - 1,000",
            "1,001 - 1,500",
            "1,501 - 3,000",
            "3,001 - 5,000",
            "5,001 & Above"
        ],
    },
]; */
