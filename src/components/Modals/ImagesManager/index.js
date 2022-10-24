import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CancelIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useScrollDisable from "../../../hooks/useScrollDisable";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";

const brands = ["JBL", "BoAt", "Sony", "Other"];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className="Tabpanel"
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const imagesData = useSelector((state) => state.data.images);
  const [value, setValue] = React.useState(0);
  const [isImagesManager, setIsImagesManager] = React.useState(true);
  const formRef = React.useRef();
  const backdropRef = React.useRef();
  const modalRef = React.useRef();

  let imagesOther = imagesData;

  const imagesGroupByName = brands.map((brandName) => {
    const result = imagesOther.reduce((array, img) => {
      if (img.toLowerCase().includes(brandName.toLowerCase())) {
        array = [...array, img];
        imagesOther = imagesOther.filter((src) => src !== img);
      }
      return array;
    }, []);
    return { brandName, array: result.length > 0 ? result : imagesOther };
  });

  const handleClickOutSide = async (e) => {
    if (e.target === backdropRef.current || e.target === modalRef.current) {
      setIsImagesManager(false);
    }
  };

  const closeOnClick = async (e) => {
    setIsImagesManager(false);
  };

  useScrollDisable(isImagesManager);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  return (
    <>
      {isImagesManager && (
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
                  setIsImagesManager(false);
                }}
              >
                <CancelIcon sx={{ color: "#9e9e9e" }} />
              </Button>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  height: "100%",
                }}
              >
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: "divider" }}
                >
                  {brands.map((item, index) => {
                    return <Tab label={item} {...a11yProps(index)} />;
                  })}
                </Tabs>
                {brands.map((brand, index) => {
                  const result = imagesGroupByName.find(
                    (item) => item.brandName === brand
                  );
                  return (
                    <TabPanel value={value} index={index}>
                      {result.array.map((i, index) => {
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
                          >
                            <LazyLoadImage
                              alt={i}
                              effect="blur"
                              className="imgManager_item"
                              src={i}
                            />
                          </Box>
                        );
                      })}
                    </TabPanel>
                  );
                })}
              </Box>
            </Paper>
          </div>
        </div>
      )}
    </>
  );
}
