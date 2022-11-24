import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import useScrollDisable from "../../../hooks/useScrollDisable";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleImagesManager,
  setProductHeroImage,
  setProductImages,
} from "../../../redux/commonSlice";

const brands = ["JBL", "BoAt", "Sony", "Other"];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="box_wrapper" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [selected, setSelected] = React.useState({
    heroImage: { path: null, src: null },
    images: [],
  });
  const imagesSelected = React.useRef({
    heroImage: { path: null, src: null },
    images: [],
  });
  const isImagesManager = useSelector((state) => state.common.isImagesManager);
  const imagesData = useSelector((state) => state.data.images);
  const [value, setValue] = React.useState(0);
  const formRef = React.useRef();
  const backdropRef = React.useRef();
  const modalRef = React.useRef();

  let imagesOther = imagesData;

  const imagesGroupByName = brands.map((brandName) => {
    const result = imagesOther.reduce((array, img) => {
      if (img.toLowerCase().includes(brandName.toLowerCase())) {
        const path =
          "/" + img.split("/o/")[1].split("?alt")[0].replaceAll("%2F", "/");
        array = [...array, { path, src: img }];
        imagesOther = imagesOther.filter((src) => src !== img);
      }
      return array;
    }, []);
    return {
      brandName,
      array:
        result.length > 0
          ? result
          : imagesOther.map((item) => {
              const path =
                "/" +
                item.split("/o/")[1].split("?alt")[0].replaceAll("%2F", "/");
              return { path, src: item };
            }),
    };
  });

  const handleClickOutSide = async (e) => {
    if (e.target === backdropRef.current || e.target === modalRef.current) {
      dispatch(toggleImagesManager(false));
    }
  };

  const handleSelected = (path, src) => {
    if (isImagesManager.from === "heroImage") {
      if (imagesSelected.current.heroImage.path === path) {
        imagesSelected.current = {
          ...imagesSelected.current,
          heroImage: { path: null, src: null },
        };
        setSelected({
          ...imagesSelected.current,
          heroImage: { path: null, src: null },
        });
      } else {
        imagesSelected.current = {
          ...imagesSelected.current,
          heroImage: { path, src },
        };
        setSelected({
          ...imagesSelected.current,
          heroImage: { path, src },
        });
      }
    } else {
      if (imagesSelected.current.images.length < 4) {
        const found = imagesSelected.current.images.find(
          (img) => img.path === path
        );
        if (found) {
          imagesSelected.current = {
            ...imagesSelected.current,
            images: imagesSelected.current.images.filter(
              (img) => img.path !== path
            ),
          };
          setSelected({
            ...imagesSelected.current,
            images: imagesSelected.current.images.filter(
              (img) => img.path !== path
            ),
          });
        } else {
          imagesSelected.current = {
            ...imagesSelected.current,
            images: [...imagesSelected.current.images, { path, src }],
          };
          setSelected({
            ...imagesSelected.current,
            images: [...imagesSelected.current.images, { path, src }],
          });
        }
      } else {
        const found = imagesSelected.current.images.find(
          (img) => img.path === path
        );
        if (found) {
          imagesSelected.current = {
            ...imagesSelected.current,
            images: imagesSelected.current.images.filter(
              (img) => img.path !== path
            ),
          };
          setSelected({
            ...imagesSelected.current,
            images: imagesSelected.current.images.filter(
              (img) => img.path !== path
            ),
          });
        }
      }
    }
  };

  useScrollDisable(isImagesManager);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleSubmit = () => {
    dispatch(setProductHeroImage(imagesSelected.current.heroImage));
    dispatch(setProductImages(imagesSelected.current.images));
    dispatch(toggleImagesManager(false));
    /* setSelected({
      heroImage: { path: null, src: null },
      images: [],
    }); */
    /* imagesSelected.current = {
      heroImage: { path: null, src: null },
      images: [],
    }; */
  };

  return (
    <>
      {isImagesManager.status && (
        <div
          className="backdrop"
          onClick={handleClickOutSide}
          ref={backdropRef}
        >
          <div className="modal_centered" ref={modalRef} style={{ margin: 0 }}>
            <Paper
              variant="outlined"
              sx={{
                my: { xs: 3, md: 6 },
                p: { xs: 2, md: 3 },
                maxWidth: "98vw",
                width: "100%",
                height: "90vh",
              }}
              className="images_manager"
              ref={formRef}
            >
              <Button
                className="button_close"
                onClick={() => {
                  dispatch(toggleImagesManager(false));
                }}
              >
                <CancelIcon sx={{ color: "#9e9e9e" }} />
              </Button>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  height: "100%",
                }}
              >
                <AppBar position="static">
                  <Tabs
                    variant="scrollable"
                    value={value}
                    scrollButtons="auto"
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                  >
                    {brands.map((item, index) => {
                      return (
                        <Tab key={index} label={item} {...a11yProps(index)} />
                      );
                    })}
                  </Tabs>
                </AppBar>
                <SwipeableViews
                  className="tab_panel"
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  {brands.map((brand, index) => {
                    const result = imagesGroupByName.find(
                      (item) => item.brandName === brand
                    );
                    return (
                      <TabPanel
                        key={index}
                        value={value}
                        index={index}
                        dir={theme.direction}
                      >
                        {result.array.map((img, index) => {
                          let found = false;
                          if (selected.images.length > 0) {
                            found = selected.images.find(
                              (i) => i.path === img.path
                            );
                          }
                          return (
                            <Box
                              key={index}
                              className={`${
                                isImagesManager
                                  ? isImagesManager.from === "heroImage"
                                    ? selected.heroImage.path === img.path
                                      ? "heroSelected"
                                      : ""
                                    : found
                                    ? "imgSelected"
                                    : ""
                                  : ""
                              }`}
                              sx={{
                                cursor: "pointer",
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
                              onClick={() => handleSelected(img.path, img.src)}
                            >
                              <LazyLoadImage
                                alt={img.path}
                                effect="blur"
                                className="imgManager_item"
                                src={img.src}
                              />
                            </Box>
                          );
                        })}
                      </TabPanel>
                    );
                  })}
                </SwipeableViews>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                  className="manager_controls"
                >
                  <Button
                    onClick={() => dispatch(toggleImagesManager(false))}
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                  >
                    OK
                  </Button>
                </Box>
              </Box>
            </Paper>
          </div>
        </div>
      )}
    </>
  );
}
