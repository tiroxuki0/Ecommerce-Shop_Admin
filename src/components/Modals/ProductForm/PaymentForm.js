import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ValidatorForm } from "react-material-ui-form-validator";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveStep,
  setProductDetails,
  setCurrentUploaded,
} from "../../../redux/commonSlice";
import { v4 as uuid } from "uuid";
import { storage } from "../../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function PaymentForm() {
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.common.productDetails);
  const activeStep = useSelector((state) => state.common.productStep);
  const [heroImage, setHeroImage] = React.useState();
  const [images, setImages] = React.useState();
  const urls = React.useRef([]);
  const imageNameRef = React.useRef([]);
  /* const paymentDetails = useSelector(
    (state) => state.common.orderDetails.paymentDetails
  ); */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (heroImage.length > 0 && images.length > 0) {
      const idImage = uuid();
      dispatch(
        setProductDetails({
          field: "heroImage",
          value: `/images/products/${heroImage[0].name + " " + idImage}`,
        })
      );
      const imagesSelected = [heroImage[0], ...images];
      let count = 0;
      let complete = false;
      for (let i = 1; i < imagesSelected.length; i++) {
        const imageName = `/images/products/` + imagesSelected[i].name + uuid();
        imageNameRef.current = [...imageNameRef.current, imageName];
        if (i !== 0) {
          dispatch(setProductDetails({ field: "images", value: imageName }));
        }
        const storageRef = ref(storage, imageName.replace("/", ""));

        const uploadTask = uploadBytesResumable(storageRef, imagesSelected[i]);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            if (progress === 100) {
              count = count + 1;
            }
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                console.log({ error, message: "storage/unauthorized" });
                break;
              case "storage/canceled":
                console.log({ error, message: "storage/canceled" });
                break;
              case "storage/unknown":
                console.log({ error, message: "storage/unknown" });
                break;
            }
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              urls.current = [...urls.current, downloadURL];
              if (urls.current.length === imagesSelected.length) {
                complete = true;
              }
              if (complete && count === 4) {
                dispatch(setCurrentUploaded(urls.current));
                dispatch(setActiveStep(activeStep + 1));
                urls.current = [];
                imageNameRef.current = [];
              } else if (!complete && count === 4) {
                console.log(complete);
                for (let i = 0; i < imageNameRef.current.length; i++) {
                  // Create a reference to the file to delete
                  const delRef = ref(
                    storage,
                    imageNameRef.current[i].replace("/", "")
                  );
                  // Delete the file
                  deleteObject(delRef)
                    .then(() => {
                      console.log("Deleted", imageNameRef.current[i]);
                    })
                    .catch((error) => {
                      console.log("Delete failed", error);
                      // Uh-oh, an error occurred!
                    });
                }
                imageNameRef.current = [];
                dispatch(setCurrentUploaded([]));
              }
            });
          }
        );
      }
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    dispatch(setActiveStep(activeStep - 1));
  };

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Images display
      </Typography>
      <ValidatorForm onSubmit={handleSubmit}>
        <Grid container spacing={3} className="upload_form_container">
          <Grid item xs={12} className="upload_heroImage">
            <DropzoneArea
              acceptedFiles={["image/*"]}
              filesLimit={1}
              showPreviews={true}
              showPreviewsInDropzone={false}
              showAlerts={false}
              dropzoneText={
                "Select an hero image by drag and drop or click here"
              }
              onChange={(files) => setHeroImage(files)}
            />
          </Grid>
          <Grid item xs={12} className="upload_images">
            <DropzoneArea
              filesLimit={4}
              showAlerts={false}
              acceptedFiles={["image/*"]}
              dropzoneText={
                "Select more image for product detail by drag and drop or click here"
              }
              onChange={(files) => setImages(files)}
            />
          </Grid>
        </Grid>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end" }}
          className="btns_images"
        >
          <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
            Back
          </Button>
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

/* 
let complete = false;
      for (let i = 0; i < selectedImgs.length; i++) {
        const storageRef = ref(
          storage,
          `images/products/${selectedImgs[i].file.name + " " + uuid()}`
        );

        const uploadTask = uploadBytesResumable(
          storageRef,
          selectedImgs[i].file
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                console.log({ error, message: "storage/unauthorized" });
                break;
              case "storage/canceled":
                console.log({ error, message: "storage/canceled" });
                break;
              case "storage/unknown":
                console.log({ error, message: "storage/unknown" });
                break;
            }
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              urls.current = [...urls.current, downloadURL];
              if (urls.current.length === selectedImgs.length) {
                complete = true;
              }
              if (complete) {
                addDocument("messages", {
                  type: "image",
                  text: urls.current,
                  uid: user.uid,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  roomId: roomSelected.id,
                  seen: [],
                });
                if (message.trim()) {
                  addDocument("messages", {
                    type: "text",
                    text: message,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    roomId: roomSelected.id,
                    seen: [],
                  });
                  setMessage("");
                }
              }
            });
          }
        );
      }
*/
