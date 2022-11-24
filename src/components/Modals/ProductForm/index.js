import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ProductDetails from "./ProductDetails";
import ImagesDetails from "./ImagesDetails";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import useToast from "../../hooks/useToast";
import useScrollDisable from "../../../hooks/useScrollDisable";
// import { ref, get, child } from "firebase/database";
// import { db } from "../../firebase/config";
import {
  toggleProductForm,
  clearProductDetails,
  setProductSelected,
  setActiveStep,
} from "../../../redux/commonSlice";
// import { clearAll } from "../../redux/cartSlice";
// import { checkCartUser } from "../../firebase/service";

const steps = [
  "Product details",
  "Images display",
  "Review your product details",
];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <ProductDetails />;
    case 1:
      return <ImagesDetails />;
    case 2:
      return <ImagesDetails />;
    default:
      throw new Error("Unknown step");
  }
}

export default function ProductForm() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { notify } = useToast();
  // const isAddProd = useSelector((state) => state.common.isAddProd);
  const productSelected = useSelector((state) => state.common.productSelected);
  const isProductForm = useSelector((state) => state.common.isProductForm);
  const activeStep = useSelector((state) => state.common.productStep);
  const formRef = React.useRef();
  const backdropRef = React.useRef();
  const modalRef = React.useRef();

  const handleClickOutSide = async (e) => {
    if (e.target === backdropRef.current || e.target === modalRef.current) {
      if (productSelected) {
        dispatch(toggleProductForm(false));
        dispatch(clearProductDetails());
        dispatch(setProductSelected(null));
        dispatch(setActiveStep(0));
      } else {
        dispatch(toggleProductForm(false));
        dispatch(clearProductDetails());
        dispatch(setActiveStep(0));
      }
    }
  };

  const closeOnClick = async (e) => {
    if (productSelected) {
      dispatch(toggleProductForm(false));
      dispatch(clearProductDetails());
      dispatch(setProductSelected(null));
      dispatch(setActiveStep(0));
    } else {
      dispatch(toggleProductForm(false));
      dispatch(clearProductDetails());
      dispatch(setActiveStep(0));
    }
  };

  useScrollDisable(isProductForm);

  return (
    <>
      {isProductForm && (
        <div
          className="backdrop"
          onClick={handleClickOutSide}
          ref={backdropRef}
        >
          <div className="modal_centered" ref={modalRef}>
            <Paper
              variant="outlined"
              sx={{
                my: { xs: 3, md: 6 },
                p: { xs: 2, md: 3 },
                maxWidth: "700px",
                width: "100%",
              }}
              className="checkout_form"
              ref={formRef}
            >
              <Typography component="h1" variant="h4" align="center">
                {productSelected ? "Edit Product" : "Add New Product"}
              </Typography>
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <React.Fragment>
                {activeStep === steps.length ? (
                  <React.Fragment>
                    <>
                      {productSelected ? (
                        <>
                          <Typography variant="h5" gutterBottom>
                            Product edited!
                          </Typography>
                          <Typography variant="subtitle1">
                            Enjoy your store.
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h5" gutterBottom>
                            Create new product successfully!
                          </Typography>
                          <Typography variant="subtitle1">
                            Enjoy your store.
                          </Typography>
                        </>
                      )}
                    </>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        onClick={closeOnClick}
                        sx={{ mt: 3, ml: 1 }}
                      >
                        Close
                      </Button>
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {getStepContent(activeStep ? activeStep : 0)}
                  </React.Fragment>
                )}
              </React.Fragment>
            </Paper>
          </div>
        </div>
      )}
    </>
  );
}
