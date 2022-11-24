import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useDispatch, useSelector } from "react-redux";
import { convertToBase64 } from "../../../helpers/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";
import {
  setActiveStep,
  toggleImagesManager,
  setAddLoading,
} from "../../../redux/commonSlice";
import { v4 as uuid } from "uuid";
import { storage } from "../../../firebase/config";
import { addDocument, updateProduct } from "../../../firebase/service";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useToast from "../../../hooks/useToast";

const HeroWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  padding: 0 12px 12px 12px;
`;

const ImagesWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  padding: 0 12px 12px 12px;
`;

const Preview = styled.div`
  width: 100%;
  height: 115px;
  padding: 15px 15px 0px 15px;
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(5px);
  .container {
    height: 100%;
    width: auto;
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .pictureContainer {
    height: 100%;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: contain;
    position: relative;
  }
  .picture {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    border-radius: 4px;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    padding: 0;
  }
`;

export default function ImagesDetails() {
  const {
    id,
    heroImage,
    images,
    brand,
    category,
    connectivity,
    finalPrice,
    info,
    originalPrice,
    quantity,
    rateCount,
    ratings,
    stock,
    tag,
    tagline,
    title,
    type,
  } = useSelector((state) => state.common.productDetails);
  const dispatch = useDispatch();
  const productSelected = useSelector((state) => state.common.productSelected);
  const activeStep = useSelector((state) => state.common.productStep);
  const [loading, setLoading] = React.useState(false);
  const [isReview, setIsReview] = React.useState(false);
  const [selectedImgs, setSelectedImgs] = React.useState([]);
  const [imgs, setImgs] = React.useState([]);
  const imgsRef = React.useRef([]);
  const [selectedHero, setSelectedHero] = React.useState(null);
  const [hero, setHero] = React.useState(null);
  const heroRef = React.useRef();

  const { notify } = useToast();

  const handleNextReview = async (e) => {
    e.preventDefault();
    let imagesSelected = [];

    const heroImageCheck = heroImage
      ? heroImage.path
      : selectedHero
      ? selectedHero
      : productSelected
      ? productSelected.heroImage
      : null;
    if (heroImageCheck) {
      imagesSelected = [...imagesSelected, ...heroImageCheck];
    }

    const imagesCheck =
      images.length > 0
        ? images.map((img) => img.path)
        : selectedImgs
        ? [...selectedImgs]
        : productSelected
        ? productSelected.images
        : [];
    if (imagesCheck.length > 0) {
      imagesSelected = [...imagesSelected, ...imagesCheck];
    }

    if (imagesSelected.length > 0) {
      setIsReview(true);
      dispatch(setActiveStep(activeStep + 1));
    } else {
      notify("info", "Please select images for details");
    }
  };

  const handleCreateHeroBase64 = async (e) => {
    if (typeof heroImage === "object" && heroImage.path !== null) {
      notify("info", "Please clear select in image manager");
      return;
    } else {
      const files = e.target.files;
      if ([...files].length > 0) {
        const newFiles = { id: uuid(), name: files[0].name, file: files[0] };
        heroRef.current = newFiles;
        setSelectedHero(newFiles);
        const base64 = await convertToBase64(newFiles.file);
        setHero({ id: newFiles.id, name: newFiles.name, src: base64 });
        e.target.value = "";
      } else {
        notify("info", "Please select a image!");
      }
    }
  };

  const deleteHero = () => {
    setSelectedHero([]);
    setHero(null);
    heroRef.current = null;
  };

  const handleCreateBase64 = async (e) => {
    if (images.length > 0 && typeof images[0] === "object") {
      notify("info", "Please clear select in image manager");
      return;
    } else {
      const files = e.target.files;
      if ([...imgsRef.current, ...files].length < 5) {
        const newFiles = [...files].map((file) => {
          return { id: uuid(), name: file.name, file };
        });
        let imgsBase64 = [];
        imgsRef.current = [...imgsRef.current, ...newFiles];
        setSelectedImgs(imgsRef.current);
        for (let i = 0; i < newFiles.length; i++) {
          const base64 = await convertToBase64(newFiles[i].file);
          imgsBase64 = [
            ...imgsBase64,
            { id: newFiles[i].id, name: newFiles[i].name, src: base64 },
          ];
        }
        setImgs((prev) => [...prev, ...imgsBase64]);
        e.target.value = "";
      } else {
        notify("info", "You can only select 4 images at a time");
      }
    }
  };

  const deleteImage = (img) => {
    imgsRef.current = imgsRef.current.filter((e) => e.id !== img.id);
    setSelectedImgs(imgsRef.current);
    setImgs((prev) => prev.filter((e) => e.id !== img.id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    dispatch(setAddLoading(true));
    const productEdited = {
      id: id ? id : productSelected ? productSelected.id : null,
      brand: brand ? brand : productSelected.brand,
      category: category ? category : productSelected.category,
      connectivity: connectivity ? connectivity : productSelected.connectivity,
      finalPrice: Number(finalPrice ? finalPrice : productSelected.finalPrice),
      info: info ? info : productSelected.info,
      originalPrice: Number(
        originalPrice ? originalPrice : productSelected.originalPrice
      ),
      quantity: Number(quantity ? quantity : productSelected.quantity),
      rateCount: Number(rateCount ? rateCount : productSelected.rateCount),
      ratings: Number(ratings ? ratings : productSelected.ratings),
      stock: Number(stock ? stock : productSelected.stock),
      tag: tag ? tag : productSelected.tag ? productSelected.tag : "",
      tagline: tagline
        ? tagline
        : productSelected.tagline
        ? productSelected.tagline
        : "",
      title: title ? title : productSelected.title,
      type: type ? type : productSelected.type,
    };

    let imagesSelected = [];
    if (heroRef.current) {
      imagesSelected = [...imagesSelected, heroRef.current];
    }

    if (imgsRef.current.length > 0) {
      imagesSelected = [...imagesSelected, ...imgsRef.current];
    }

    if (imagesSelected.length > 0) {
      let imageHero = "";
      let imagesOther = [];
      const uploads = imagesSelected.map((item, index) => {
        const imageName = `/images/products/` + uuid() + item.file.name;
        if (index === 0) {
          imageHero = imageName;
        } else {
          imagesOther = [...imagesOther, imageName];
        }

        const storageRef = ref(storage, imageName.replace("/", ""));

        const uploadTask = uploadBytesResumable(storageRef, item.file, {
          contentType: `${item.file.type}`,
        });

        return uploadTask;
      });

      Promise.all(uploads).then(function (values) {
        const urls = [];
        values.forEach((upload) => {
          const url = getDownloadURL(upload.task.snapshot.ref);
          urls.push(url);
        });
        Promise.all(urls).then(function (values) {
          updateProduct(productSelected.idDB, {
            ...productEdited,
            heroImage: imageHero,
            images: imagesOther,
          });
        });
      });
    } else {
      updateProduct(productSelected.idDB, {
        ...productEdited,
        heroImage: heroImage
          ? heroImage.path
          : productSelected
          ? productSelected.heroImage
          : null,
        images:
          images.length > 0
            ? images.map((img) => img.path)
            : productSelected
            ? productSelected.images
            : [],
      });
    }
    dispatch(setActiveStep(activeStep + 1));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(setAddLoading(true));
    const productEdited = {
      id: id ? id : productSelected ? productSelected.id : uuid(),
      brand: brand ? brand : productSelected ? productSelected.brand : "",
      category: category
        ? category
        : productSelected
        ? productSelected.category
        : "",
      connectivity: connectivity
        ? connectivity
        : productSelected
        ? productSelected.connectivity
        : "",
      finalPrice: Number(
        finalPrice
          ? finalPrice
          : productSelected
          ? productSelected.finalPrice
          : ""
      ),
      info: info ? info : productSelected ? productSelected.info : "",
      originalPrice: Number(
        originalPrice
          ? originalPrice
          : productSelected
          ? productSelected.originalPrice
          : ""
      ),
      quantity: 1,
      rateCount: Number(
        rateCount ? rateCount : productSelected ? productSelected.rateCount : ""
      ),
      ratings: Number(
        ratings ? ratings : productSelected ? productSelected.ratings : ""
      ),
      stock: Number(
        stock ? stock : productSelected ? productSelected.stock : ""
      ),
      tag: tag ? tag : productSelected ? productSelected.tag : "",
      tagline: tagline
        ? tagline
        : productSelected
        ? productSelected.tagline
        : "",
      title: title ? title : productSelected ? productSelected.title : "",
      type: type ? type : productSelected ? productSelected.type : "",
      path: "/product-details/",
    };

    let imagesSelected = [];
    if (heroRef.current) {
      imagesSelected = [...imagesSelected, heroRef.current];
    }

    if (imgsRef.current.length > 0) {
      imagesSelected = [...imagesSelected, ...imgsRef.current];
    }

    if (imagesSelected.length > 0) {
      let imageHero = "";
      let imagesOther = [];
      const uploads = imagesSelected.map((item, index) => {
        const imageName = `/images/products/` + uuid() + item.file.name;
        if (index === 0) {
          imageHero = imageName;
        } else {
          imagesOther = [...imagesOther, imageName];
        }

        const storageRef = ref(storage, imageName.replace("/", ""));

        const uploadTask = uploadBytesResumable(storageRef, item.file, {
          contentType: `${item.file.type}`,
        });

        return uploadTask;
      });

      Promise.all(uploads).then(function (values) {
        const urls = [];
        values.forEach((upload) => {
          const url = getDownloadURL(upload.task.snapshot.ref);
          urls.push(url);
        });
        Promise.all(urls).then(function (values) {
          addDocument("productsData", {
            ...productEdited,
            heroImage:
              imageHero !== "" ? imageHero : heroImage ? heroImage.path : "",
            images:
              imagesOther.length > 0
                ? imagesOther
                : images.length > 0
                ? images.map((img) => img.path)
                : [],
          });
        });
      });
    } else {
      addDocument("productsData", {
        ...productEdited,
        heroImage: heroImage ? heroImage.path : "",
        images: images.length > 0 ? images.map((img) => img.path) : [],
      });
    }
    dispatch(setActiveStep(activeStep + 1));
  };

  const handleBack = (e) => {
    e.preventDefault();
    setIsReview(!isReview);
    dispatch(setActiveStep(activeStep - 1));
  };

  return (
    <>
      {!isReview ? (
        <React.Fragment>
          <Typography variant="h5" gutterBottom>
            Images display
          </Typography>
          <ValidatorForm onSubmit={() => {}}>
            <Grid
              sx={{ mt: 0 }}
              container
              spacing={3}
              className="upload_form_container"
            >
              <Typography
                variant="h7"
                align="left"
                sx={{ ml: "25px" }}
                gutterBottom
              >
                Hero image:
              </Typography>
              {/* HERO SELECT */}
              <HeroWrapper>
                <div
                  style={{
                    display: "flex",
                    flexDecoration: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{ minWidth: 20 }}
                    aria-label="upload picture"
                    component="label"
                  >
                    <AttachFileIcon
                      sx={{
                        color: "#797c8c",
                        width: 25,
                        height: 25,
                        transform: "rotate(45deg)",
                      }}
                    />
                    <input
                      hidden
                      accept="image/*, png, jpg, jpeg"
                      type="file"
                      onChange={handleCreateHeroBase64}
                    />
                  </Button>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                    className="btn_manager"
                  >
                    <Button
                      onClick={() =>
                        dispatch(
                          toggleImagesManager({
                            status: true,
                            from: "heroImage",
                          })
                        )
                      }
                      sx={{
                        mt: 3,
                        ml: 1,
                        p: "10px !important",
                        color: "white !important",
                      }}
                    >
                      Manager
                    </Button>
                  </Box>
                </div>
                {/*  */}
                {hero ? (
                  <Preview>
                    <div className="container">
                      <div className="pictureContainer">
                        <CancelIcon
                          className="close"
                          sx={{
                            color: "#797c8c",
                            width: 25,
                            height: 25,
                            cursor: "pointer",
                          }}
                          onClick={() => deleteHero()}
                        />
                        <img className="picture" src={hero.src} alt="logo" />
                      </div>
                    </div>
                  </Preview>
                ) : (
                  <>
                    {heroImage ? (
                      <>
                        {heroImage.src ? (
                          <Preview>
                            <div className="container">
                              <div className="pictureContainer">
                                {/* <CancelIcon
                                      className="close"
                                      sx={{
                                        color: "#797c8c",
                                        width: 25,
                                        height: 25,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => deleteHero()}
                                    /> */}
                                <img
                                  className="picture"
                                  src={heroImage.src}
                                  alt="logo"
                                />
                              </div>
                            </div>
                          </Preview>
                        ) : (
                          <>
                            {productSelected &&
                            productSelected.heroImageBase64 ? (
                              <Preview>
                                <div className="container">
                                  <div className="pictureContainer">
                                    <img
                                      className="picture"
                                      src={productSelected.heroImageBase64}
                                      alt="logo"
                                    />
                                  </div>
                                </div>
                              </Preview>
                            ) : (
                              <>
                                {productSelected ? (
                                  <Preview>
                                    <div className="container">
                                      <div className="pictureContainer">
                                        <img
                                          className="picture"
                                          src={productSelected.imagesBase64[0]}
                                          alt="logo"
                                        />
                                      </div>
                                    </div>
                                  </Preview>
                                ) : (
                                  ""
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {productSelected && productSelected.heroImageBase64 ? (
                          <Preview>
                            <div className="container">
                              <div className="pictureContainer">
                                <img
                                  className="picture"
                                  src={productSelected.heroImageBase64}
                                  alt="logo"
                                />
                              </div>
                            </div>
                          </Preview>
                        ) : (
                          <>
                            {productSelected ? (
                              <Preview>
                                <div className="container">
                                  <div className="pictureContainer">
                                    <img
                                      className="picture"
                                      src={productSelected.imagesBase64[0]}
                                      alt="logo"
                                    />
                                  </div>
                                </div>
                              </Preview>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
                {/*  */}
              </HeroWrapper>
              <Typography
                variant="h7"
                align="left"
                sx={{ ml: "25px" }}
                gutterBottom
              >
                Images other:
              </Typography>
              {/* IMAGES SELECT */}
              <ImagesWrapper>
                <div
                  style={{
                    display: "flex",
                    flexDecoration: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{ minWidth: 20 }}
                    aria-label="upload picture"
                    component="label"
                  >
                    <AttachFileIcon
                      sx={{
                        color: "#797c8c",
                        width: 25,
                        height: 25,
                        transform: "rotate(45deg)",
                      }}
                    />
                    <input
                      hidden
                      accept="image/*, png, jpg, jpeg"
                      type="file"
                      multiple
                      onChange={handleCreateBase64}
                    />
                  </Button>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                    className="btn_manager"
                  >
                    <Button
                      onClick={() =>
                        dispatch(
                          toggleImagesManager({
                            status: true,
                            from: "images",
                          })
                        )
                      }
                      sx={{
                        mt: 3,
                        ml: 1,
                        p: "10px !important",
                        color: "white !important",
                      }}
                    >
                      Manager
                    </Button>
                  </Box>
                </div>
                {/*  */}
                {imgs.length > 0 ? (
                  <Preview>
                    <div className="container">
                      {imgs.map((img, index) => {
                        return (
                          <div key={index} className="pictureContainer">
                            <CancelIcon
                              className="close"
                              sx={{
                                color: "#797c8c",
                                width: 25,
                                height: 25,
                                cursor: "pointer",
                              }}
                              onClick={() => deleteImage(img)}
                            />
                            <img className="picture" src={img.src} alt="logo" />
                          </div>
                        );
                      })}
                    </div>
                  </Preview>
                ) : (
                  <>
                    {images.length > 0 ? (
                      <>
                        {images[0].src ? (
                          <Preview>
                            <div className="container">
                              <div className="pictureContainer">
                                {images.map((img, index) => {
                                  return (
                                    <img
                                      key={index}
                                      className="picture"
                                      src={img.src}
                                      alt="logo"
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </Preview>
                        ) : (
                          <>
                            {productSelected &&
                            productSelected.imagesBase64.length > 0 ? (
                              <Preview>
                                <div className="container">
                                  <div className="pictureContainer">
                                    {productSelected.imagesBase64.map(
                                      (img, index) => {
                                        return (
                                          <img
                                            key={index}
                                            className="picture"
                                            src={img}
                                            alt="logo"
                                          />
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </Preview>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {productSelected &&
                        productSelected.imagesBase64.length > 0 ? (
                          <Preview>
                            <div className="container">
                              <div className="pictureContainer">
                                {productSelected.imagesBase64.map(
                                  (img, index) => {
                                    return (
                                      <img
                                        key={index}
                                        className="picture"
                                        src={img}
                                        alt="logo"
                                      />
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </Preview>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
                {/*  */}
              </ImagesWrapper>
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
                onClick={handleNextReview}
                sx={{ mt: 3, ml: 1 }}
                className="btn_checkout"
              >
                Next
              </Button>
            </Box>
          </ValidatorForm>
        </React.Fragment>
      ) : (
        /* ---------------------------------------------------------------- */
        /* ---------------------------------------------------------------- */
        /* ---------------------------------------------------------------- */
        /* ---------------------------------------------------------------- */
        /* ---------------------------------------------------------------- */
        /* ---------------------------------------------------------------- */
        /* ---------------------------------------------------------------- */
        <React.Fragment>
          <Grid container spacing={2}>
            {/* IMAGES DISPLAY */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Images
              </Typography>
              <Typography
                gutterBottom
                sx={{ display: "block", textAlign: "left" }}
              >
                {"Hero image: "}
              </Typography>
              <Box
                sx={{
                  boxShadow: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#101010" : "#fff",
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "grey.300" : "grey.800",
                  textAlign: "center",
                }}
                className="review_heroImage"
              >
                <LazyLoadImage
                  effect="blur"
                  src={
                    hero
                      ? hero.src
                      : typeof heroImage === "object" && heroImage.src !== null
                      ? heroImage.src
                      : productSelected && productSelected.heroImageBase64
                      ? productSelected.heroImageBase64
                      : productSelected &&
                        productSelected.imagesBase64.length > 0
                      ? productSelected.imagesBase64[0]
                      : ""
                  }
                />
              </Box>
              <Typography
                gutterBottom
                sx={{ display: "block", textAlign: "left", mt: 2 }}
              >
                {"Images other: "}
              </Typography>
              <div className="review_images">
                {/*  */}
                {imgs.length > 0 ? (
                  <>
                    {imgs.map((img, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            boxShadow: 3,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#101010"
                                : "#fff",
                            color: (theme) =>
                              theme.palette.mode === "dark"
                                ? "grey.300"
                                : "grey.800",
                            textAlign: "center",
                          }}
                          className="review_image"
                        >
                          <LazyLoadImage effect="blur" src={img.src} />
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {images.length > 0 ? (
                      <>
                        {images[0].src ? (
                          <>
                            {images.map((img, index) => {
                              return (
                                <Box
                                  key={index}
                                  sx={{
                                    boxShadow: 3,
                                    bgcolor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "#101010"
                                        : "#fff",
                                    color: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "grey.300"
                                        : "grey.800",
                                    textAlign: "center",
                                  }}
                                  className="review_image"
                                >
                                  <LazyLoadImage effect="blur" src={img.src} />
                                </Box>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {productSelected &&
                            productSelected.imagesBase64.length > 0 ? (
                              <>
                                {productSelected.imagesBase64.map(
                                  (img, index) => {
                                    return (
                                      <Box
                                        key={index}
                                        sx={{
                                          boxShadow: 3,
                                          bgcolor: (theme) =>
                                            theme.palette.mode === "dark"
                                              ? "#101010"
                                              : "#fff",
                                          color: (theme) =>
                                            theme.palette.mode === "dark"
                                              ? "grey.300"
                                              : "grey.800",
                                          textAlign: "center",
                                        }}
                                        className="review_image"
                                      >
                                        <LazyLoadImage
                                          effect="blur"
                                          src={img}
                                        />
                                      </Box>
                                    );
                                  }
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {productSelected &&
                        productSelected.imagesBase64.length > 0 ? (
                          <>
                            {productSelected.imagesBase64.map((img, index) => {
                              return (
                                <Box
                                  key={index}
                                  sx={{
                                    boxShadow: 3,
                                    bgcolor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "#101010"
                                        : "#fff",
                                    color: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "grey.300"
                                        : "grey.800",
                                    textAlign: "center",
                                  }}
                                  className="review_image"
                                >
                                  <LazyLoadImage effect="blur" src={img} />
                                </Box>
                              );
                            })}
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
                {/*  */}
              </div>
            </Grid>
            {/* DETAILS DISPLAY */}
            <Grid item container direction="column" xs={12} sm={6}>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Product details
              </Typography>
              <Grid container>
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      ID
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom className="productId_review">
                      {id ? id : productSelected ? productSelected.id : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Brand
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {brand
                        ? brand
                        : productSelected
                        ? productSelected.brand
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Category
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {category
                        ? category
                        : productSelected
                        ? productSelected.category
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Connectivity
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {connectivity
                        ? connectivity
                        : productSelected
                        ? productSelected.connectivity
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Final Price
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {finalPrice
                        ? finalPrice
                        : productSelected
                        ? productSelected.finalPrice
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Info
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {info
                        ? info
                        : productSelected
                        ? productSelected.info
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Original Price
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {originalPrice
                        ? originalPrice
                        : productSelected
                        ? productSelected.originalPrice
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Quantity
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {quantity
                        ? quantity
                        : productSelected
                        ? productSelected.quantity
                        : 0}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Rate Count
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {rateCount
                        ? rateCount
                        : productSelected
                        ? productSelected.rateCount
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Ratings
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {ratings
                        ? ratings
                        : productSelected
                        ? productSelected.ratings
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Stock
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {stock
                        ? stock
                        : productSelected
                        ? productSelected.stock
                        : 0}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Tag
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {tag ? tag : productSelected ? productSelected.tag : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Tag Line
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {tagline
                        ? tagline
                        : productSelected
                        ? productSelected.tagline
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Title
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {title
                        ? title
                        : productSelected
                        ? productSelected.title
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
                {/*  */}
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom sx={{ textAlign: "left" }}>
                      Type
                    </Typography>
                  </Grid>
                  <Grid item sx={{ textAlign: "left" }} xs={6}>
                    <Typography gutterBottom>
                      {type
                        ? type
                        : productSelected
                        ? productSelected.type
                        : ""}
                    </Typography>
                  </Grid>
                </React.Fragment>
                {/*  */}
              </Grid>
            </Grid>
            {/* BUTTONS */}
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
              className="btns_images"
            >
              <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                Back
              </Button>
              <>
                {productSelected ? (
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ mt: 3, ml: 1 }}
                    className="btn_checkout"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    className="btn_checkout"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
                )}
              </>
            </Box>
          </Grid>
        </React.Fragment>
      )}
    </>
  );
}
