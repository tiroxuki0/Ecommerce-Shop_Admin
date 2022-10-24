import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import useToast from "../../hooks/useToast";
import useScrollDisable from "../../../hooks/useScrollDisable";
// import { ref, get, child } from "firebase/database";
// import { db } from "../../firebase/config";
import {
  toggleProductForm,
  toggleAddProduct,
  toggleEditProduct,
  setActiveStep,
  clearProductDetails,
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
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
}

export default function ProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { notify } = useToast();
  const isAddProd = useSelector((state) => state.common.isAddProd);
  const isEditProd = useSelector((state) => state.common.isEditProd);
  const isProductForm = useSelector((state) => state.common.isProductForm);
  // const idOrder = useSelector((state) => state.common.orderDetails.id);
  const activeStep = useSelector((state) => state.common.productStep);
  const formRef = React.useRef();
  const backdropRef = React.useRef();
  const modalRef = React.useRef();

  const createOrder = async () => {
    // const dbRef = await ref(db);
    // get(child(dbRef, `ordersData/${uid}/${idOrder}`))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       dispatch(toggleCheckOut(false));
    //       dispatch(setActiveStep(0));
    //       dispatch(clearAll());
    //       dispatch(clearOrderDetails());
    //       checkCartUser(uid, []);
    //       notify("success", `Ordered successfully!`);
    //       navigate("/orders");
    //     } else {
    //       console.log("No orderId available");
    //     }
    //   })
    //   .catch((error) => {
    //     notify("error", `Something went wrong!`);
    //     return error;
    //   });
  };

  const handleClickOutSide = async (e) => {
    if (e.target === backdropRef.current || e.target === modalRef.current) {
      createOrder();
      dispatch(toggleProductForm(false));
      dispatch(toggleEditProduct(false));
    }
  };

  const closeOnClick = async (e) => {
    createOrder();
    dispatch(toggleProductForm(false));
    dispatch(toggleEditProduct(false));
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
                {isEditProd ? "Edit Product" : "Add New Product"}
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
                    <Typography variant="h5" gutterBottom>
                      Thank you for your order.
                    </Typography>
                    <Typography variant="subtitle1">
                      Your order number is #{23213123}. We have emailed your
                      order confirmation, and will send you an update when your
                      order has shipped.
                    </Typography>
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
