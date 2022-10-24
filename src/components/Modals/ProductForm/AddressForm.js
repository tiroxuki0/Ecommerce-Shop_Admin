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

const brands = ["JBL", "BoAt", "Sony"];
const categories = ["Headphones", "Earbuds", "Earphones", "Neckbands"];
const types = ["In-Ear", "On-Ear", "Over-Ear"];
const tags = ["hero-product", "featured-product"];

export default function AddressForm() {
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.common.productDetails);
  const activeStep = useSelector((state) => state.common.productStep);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setActiveStep(activeStep + 1));
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
              value={productDetails.brand}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "brand",
                    value: e.target.value,
                  })
                );
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
                return <MenuItem value={brand}>{brand}</MenuItem>;
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={productDetails.category}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "category",
                    value: e.target.value,
                  })
                );
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
                return <MenuItem value={category}>{category}</MenuItem>;
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={productDetails.connectivity}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "connectivity",
                    value: e.target.value,
                  })
                );
              }}
              id="connectivity"
              name="connectivity"
              label="Connectivity"
              fullWidth
              select
              variant="standard"
              validators={["required"]}
              errorMessages={["Please select category"]}
            >
              {types.map((type) => {
                return <MenuItem value={type}>{type}</MenuItem>;
              })}
            </SelectValidator>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectValidator
              value={productDetails.tag}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "tag",
                    value: e.target.value,
                  })
                );
              }}
              id="tag"
              name="tag"
              label="Tag"
              fullWidth
              select
              variant="standard"
              validators={["required"]}
              errorMessages={["Please select product's tag"]}
            >
              {tags.map((tag) => {
                return <MenuItem value={tag}>{tag}</MenuItem>;
              })}
            </SelectValidator>
          </Grid>
          {/*  */}
          <Grid item xs={12} sm={4}>
            <TextValidator
              value={productDetails.tagline}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "tagline",
                    value: e.target.value,
                  })
                );
              }}
              id="tagline"
              name="tagline"
              label="Tag line"
              fullWidth
              autoComplete="family-name"
              variant="standard"
              validators={["required"]}
              errorMessages={["Please enter product's tag line"]}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextValidator
              value={productDetails.title}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "title",
                    value: e.target.value,
                  })
                );
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
          <Grid item xs={12} sm={4}>
            <TextValidator
              value={productDetails.info}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "info",
                    value: e.target.value,
                  })
                );
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
          <Grid item xs={12} sm={2}>
            <TextValidator
              value={productDetails.finalPrice}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "finalPrice",
                    value: e.target.value,
                  })
                );
              }}
              id="finalPrice"
              name="finalPrice"
              label="Final Price"
              fullWidth
              variant="standard"
              validators={["required", "isNumber", "minNumber:0"]}
              errorMessages={[
                "Please enter product's final price",
                "Number only!",
                "Final price is not valid!",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextValidator
              value={productDetails.originalPrice}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "originalPrice",
                    value: e.target.value,
                  })
                );
              }}
              id="originalPrice"
              name="originalPrice"
              label="Original Price"
              fullWidth
              variant="standard"
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
              value={productDetails.quantity}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "quantity",
                    value: e.target.value,
                  })
                );
              }}
              id="quantity"
              name="quantity"
              label="Quantity"
              fullWidth
              variant="standard"
              validators={["required", "isNumber", "minNumber:0"]}
              errorMessages={[
                "Please enter product's quantity",
                "Number only!",
                "Quantity is not valid!",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextValidator
              value={productDetails.ratings}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "ratings",
                    value: e.target.value,
                  })
                );
              }}
              id="ratings"
              name="ratings"
              label="Ratings"
              fullWidth
              variant="standard"
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
              value={productDetails.rateCount}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "rateCount",
                    value: e.target.value,
                  })
                );
              }}
              id="rateCount"
              name="rateCount"
              label="Rate Count"
              fullWidth
              variant="standard"
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
              value={productDetails.stock}
              onChange={(e) => {
                dispatch(
                  setProductDetails({
                    field: "stock",
                    value: e.target.value,
                  })
                );
              }}
              id="stock"
              name="stock"
              label="Stock"
              fullWidth
              variant="standard"
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
