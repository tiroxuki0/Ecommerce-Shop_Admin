import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { toggleAdminInfo } from "../../../redux/authSlice";
import { setUserSelected, toggleUserForm } from "../../../redux/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import useScrollDisable from "../../../hooks/useScrollDisable";
import { convertToBase64 } from "../../../helpers/utils";
import styled from "styled-components";
import { ref, get, child } from "firebase/database";
import {
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "../../../firebase/config";
import {
  updateUser,
  addDocument,
  updateAdmin,
} from "../../../firebase/service";
import useToast from "../../../hooks/useToast";

const HeroWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  margin-bottom: 15px;
`;

const Preview = styled.div`
  height: 115px;
  padding: 15px 15px 0px 0px;
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

export default function UsersForm() {
  const dispatch = useDispatch();
  const formRef = React.useRef();
  const backdropRef = React.useRef();
  const modalRef = React.useRef();
  const adminsData = useSelector((state) => state.data.admins);
  const usersData = useSelector((state) => state.data.users);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isAdminInfo = useSelector((state) => state.auth.isAdminInfo);
  const isUserForm = useSelector((state) => state.common.isUserForm);
  const userSelected = useSelector((state) => state.common.userSelected);
  const [adminDetails, setAdminDetails] = React.useState({
    username: null,
    email: null,
    password: null,
  });
  const [userDetails, setUserDetails] = React.useState({
    uid: null,
    username: null,
    email: null,
    password: null,
    providerId: "normal",
    photoURL: null,
    admin: false,
    idDB: null,
  });
  const [hero, setHero] = React.useState(null);
  const { notify } = useToast();
  const userSelectedRef = React.useRef(null);

  /*  */
  React.useEffect(() => {
    userSelectedRef.current = userSelected;
  }, [userSelected]);
  /*  */

  const handleClickOutSide = async (e) => {
    if (e.target === backdropRef.current || e.target === modalRef.current) {
      if (userSelected) {
        dispatch(toggleUserForm(false));
        dispatch(setUserSelected(null));
      } else {
        dispatch(toggleUserForm(false));
      }
      if (isAdminInfo) {
        dispatch(toggleAdminInfo(false));
      }
    }
  };

  const closeOnClick = async (e) => {
    if (userSelected) {
      dispatch(toggleUserForm(false));
      dispatch(setUserSelected(null));
    } else {
      dispatch(toggleUserForm(false));
    }
    if (isAdminInfo) {
      dispatch(toggleAdminInfo(false));
    }
  };

  useScrollDisable(isUserForm);

  /* USER ACTIONS*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminInfo) {
      if (!userSelected) {
        dispatch(toggleUserForm(false));
        notify("success", "Created new user!");
        addDocument("usersData", { ...userDetails, uid: uuid() });
        setHero(null);
        setUserDetails({
          uid: null,
          username: null,
          email: null,
          password: null,
          providerId: "normal",
          photoURL: null,
          admin: false,
          idDB: null,
        });
      } else {
        notify("success", "User updated!");
        updateUser(userSelected.idDB, {
          uid: userDetails.uid
            ? userDetails.uid
            : userSelected
            ? userSelected.id
            : null,
          username: userDetails.username
            ? userDetails.username
            : userSelected
            ? userSelected.username
            : null,
          email: userDetails.email
            ? userDetails.email
            : userSelected
            ? userSelected.email
            : null,
          password: userDetails.password
            ? userDetails.password
            : userSelected
            ? userSelected.password
            : null,
          providerId: "normal",
          photoURL: userDetails.photoURL
            ? userDetails.photoURL
            : userSelected
            ? userSelected.photoURL
            : null,
          admin: false,
          idDB: userDetails.idDB
            ? userDetails.idDB
            : userSelected
            ? userSelected.idDB
            : null,
        });
        dispatch(toggleUserForm(false));
        dispatch(setUserSelected(null));
        setHero(null);
        setUserDetails({
          uid: null,
          username: null,
          email: null,
          password: null,
          providerId: "normal",
          photoURL: null,
          admin: false,
          idDB: null,
        });
        /* if (
      userDetails.password !== userSelected.password &&
      userDetails.email !== userSelected.email
    ) {
      await updateEmail(auth.currentUser, userDetails.email)
        .then(async () => {
          console.log("Email updated");
        })
        .catch((error) => {
          console.log(error);
        });
      await signInWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      )
        .then((userCredential) => {
          console.log("Re-SignIn");
          const user = userCredential.user;
        })
        .catch((error) => {
          return { code: 0, message: "Signin failed!", error };
        });
      await updatePassword(auth.currentUser, userDetails.password)
        .then(() => {
          console.log("Password updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (userDetails.password !== userSelected.password) {
      updatePassword(auth.currentUser, userDetails.password)
        .then(() => {
          console.log("Password updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (userDetails.email !== userSelected.email) {
      updateEmail(auth.currentUser, userDetails.email)
        .then(async () => {
          console.log("Email updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } */
      }
    } else {
      notify("success", "Account updated!");
      dispatch(toggleUserForm(false));
      dispatch(toggleAdminInfo(false));
      const { id, username, email, password, admin } = userInfo;
      updateAdmin(id, {
        username: adminDetails.username ? adminDetails.username : username,
        email: adminDetails.email ? adminDetails.email : email,
        password: adminDetails.password ? adminDetails.password : password,
        admin,
      });
    }
  };

  const onChangeUserDetails = ({ field, value }) => {
    /* (field, value) */
    switch (field) {
      case "uid":
        setUserDetails((prev) => {
          return { ...prev, uid: value };
        });
        break;
      case "username":
        setUserDetails((prev) => {
          return { ...prev, username: value };
        });
        break;
      case "email":
        setUserDetails((prev) => {
          return { ...prev, email: value };
        });
        break;
      case "password":
        setUserDetails((prev) => {
          return { ...prev, password: value };
        });
        break;
      case "providerId":
        setUserDetails((prev) => {
          return { ...prev, providerId: value };
        });
        break;
      case "photoURL":
        setUserDetails((prev) => {
          return { ...prev, photoURL: value };
        });
        break;
      case "admin":
        setUserDetails((prev) => {
          return { ...prev, admin: value };
        });
        break;
      default:
        console.log("error");
    }
  };

  /* AVATAR  */
  const handleCreateAvatarBase64 = async (e) => {
    const files = e.target.files;
    if ([...files].length > 0) {
      const base64 = await convertToBase64(files[0]);
      setHero(base64);
      setUserDetails((prev) => {
        return { ...prev, photoURL: base64 };
      });
      e.target.value = "";
    }
  };

  const deleteHero = () => {
    setHero(null);
    setUserDetails((prev) => {
      return { ...prev, photoURL: null };
    });
  };

  /* CUSTOM RULES */
  if (!ValidatorForm.hasValidationRule("isEmailExists")) {
    ValidatorForm.addValidationRule("isEmailExists", (value) => {
      const userFound = usersData.find((user) => user.email === value);
      if (userFound && userFound.id !== userSelectedRef.current.id) {
        return false;
      }
      return true;
    });
  }
  /* END USER ACTIONS */

  /* ADMIN ACTIONS */

  const onChangeAdminDetails = ({ field, value }) => {
    /* (field, value) */
    switch (field) {
      case "username":
        setAdminDetails((prev) => {
          return { ...prev, username: value };
        });
        break;
      case "email":
        setAdminDetails((prev) => {
          return { ...prev, email: value };
        });
        break;
      case "password":
        setAdminDetails((prev) => {
          return { ...prev, password: value };
        });
        break;
      default:
        console.log("error");
    }
  };

  if (!ValidatorForm.hasValidationRule("isAdminEmailExists")) {
    ValidatorForm.addValidationRule("isAdminEmailExists", async (value) => {
      const emailFound = adminsData.find((admin) => admin.email === value);
      if (emailFound && emailFound.id !== userInfo.id) {
        return false;
      }
      return true;
    });
  }

  if (!ValidatorForm.hasValidationRule("minLengthEmail")) {
    ValidatorForm.addValidationRule("minLengthEmail", async (value) => {
      console.log(value);
      if (value.includes("@")) {
        if (value.split("@")[0].length > 10) {
          return true;
        }
      } else {
        if (value.length > 10) {
          return true;
        }
      }
      return false;
    });
  }

  return (
    <>
      {isUserForm && (
        <>
          {isAdminInfo ? (
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
                    maxWidth: "500px",
                    width: "100%",
                  }}
                  className="checkout_form"
                  ref={formRef}
                >
                  <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                      {"Account info"}
                    </Typography>
                    <ValidatorForm onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                          <TextValidator
                            value={
                              adminDetails.username
                                ? adminDetails.username
                                : userInfo.username
                            }
                            onChange={(e) => {
                              onChangeAdminDetails({
                                field: "username",
                                value: e.target.value,
                              });
                            }}
                            id="username"
                            name="username"
                            label="Username"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            validators={["required", "minStringLength:10"]}
                            errorMessages={[
                              "Please enter your username",
                              "Username is must at least 10 letters!",
                            ]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextValidator
                            value={
                              adminDetails.email
                                ? adminDetails.email
                                : userInfo.email
                            }
                            onChange={(e) => {
                              onChangeAdminDetails({
                                field: "email",
                                value: e.target.value,
                              });
                            }}
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            validators={[
                              "required",
                              "isEmail",
                              "minLengthEmail",
                              "isAdminEmailExists",
                            ]}
                            errorMessages={[
                              "Please enter your email",
                              "Email is not valid!",
                              "Email is must at least 10 letters!",
                              "Email is already exists!",
                            ]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextValidator
                            value={
                              adminDetails.password
                                ? adminDetails.password
                                : userInfo.password
                            }
                            onChange={(e) => {
                              onChangeAdminDetails({
                                field: "password",
                                value: e.target.value,
                              });
                            }}
                            id="password"
                            name="password"
                            label="Password"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            validators={["required", "minStringLength:10"]}
                            errorMessages={[
                              "Please enter your password",
                              "Password is must at least 10 letters!",
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
                          onClick={closeOnClick}
                          sx={{ mt: 3, ml: 1 }}
                        >
                          Close
                        </Button>
                        {userSelected ? (
                          <>
                            {userSelected.providerId === "normal" && (
                              <Button
                                variant="contained"
                                onClick={() => {}}
                                sx={{ mt: 3, ml: 1 }}
                                className="btn_checkout"
                                type="submit"
                              >
                                Save
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => {}}
                            sx={{ mt: 3, ml: 1 }}
                            className="btn_checkout"
                            type="submit"
                          >
                            Save
                          </Button>
                        )}
                      </Box>
                    </ValidatorForm>
                  </React.Fragment>
                </Paper>
              </div>
            </div>
          ) : (
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
                    maxWidth: "500px",
                    width: "100%",
                  }}
                  className="checkout_form"
                  ref={formRef}
                >
                  <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                      {userSelected ? "Edit user" : "Create new user"}
                    </Typography>
                    <Typography
                      variant="p"
                      gutterBottom
                      sx={{ display: "flex", textAlign: "left", mb: 0 }}
                    >
                      {userSelected.providerId === "normal"
                        ? "Select avatar"
                        : `Sign in by ${userSelected.providerId.split(".")[0]}`}
                    </Typography>
                    <HeroWrapper>
                      <div
                        style={{
                          display: "flex",
                          flexDecoration: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {userSelected.providerId === "normal" && (
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
                              onChange={handleCreateAvatarBase64}
                            />
                          </Button>
                        )}
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
                              <img className="picture" src={hero} alt="logo" />
                            </div>
                          </div>
                        </Preview>
                      ) : (
                        <>
                          {userSelected ? (
                            <Preview>
                              <div className="container">
                                <div className="pictureContainer">
                                  <img
                                    className="picture"
                                    src={
                                      userSelected &&
                                      userSelected.photoURL.includes(
                                        "data:image"
                                      )
                                        ? userSelected.photoURL
                                        : userSelected &&
                                          userSelected.photoURL.includes("http")
                                        ? userSelected.photoURL
                                        : `data:image/svg+xml;base64,${userSelected.photoURL}`
                                    }
                                    alt="logo"
                                  />
                                </div>
                              </div>
                            </Preview>
                          ) : (
                            <Preview>
                              <div className="container">
                                <div className="pictureContainer"></div>
                              </div>
                            </Preview>
                          )}
                        </>
                      )}
                      {/*  */}
                    </HeroWrapper>
                    <ValidatorForm onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                          <TextValidator
                            disabled={
                              userSelected.providerId !== "normal"
                                ? true
                                : false
                            }
                            value={
                              userDetails.username
                                ? userDetails.username
                                : userSelected
                                ? userSelected.username
                                : ""
                            }
                            onChange={(e) => {
                              onChangeUserDetails({
                                field: "username",
                                value: e.target.value,
                              });
                            }}
                            id="username"
                            name="username"
                            label="Username"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            validators={["required", "minStringLength:10"]}
                            errorMessages={[
                              "Please enter your username",
                              "Username is must at least 10 letters!",
                            ]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextValidator
                            disabled={
                              userSelected.providerId !== "normal"
                                ? true
                                : false
                            }
                            value={
                              userDetails.email
                                ? userDetails.email
                                : userSelected
                                ? userSelected.email
                                : ""
                            }
                            onChange={(e) => {
                              onChangeUserDetails({
                                field: "email",
                                value: e.target.value,
                              });
                            }}
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            validators={[
                              "required",
                              "minStringLength:10",
                              "isEmail",
                              "isEmailExists",
                            ]}
                            errorMessages={[
                              "Please enter your email",
                              "Email is must at least 10 letters!",
                              "Email is not valid!",
                              "Email is already exists!",
                            ]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextValidator
                            disabled={
                              userSelected.providerId !== "normal"
                                ? true
                                : false
                            }
                            value={
                              userDetails.password
                                ? userDetails.password
                                : userSelected
                                ? userSelected.password
                                : ""
                            }
                            onChange={(e) => {
                              onChangeUserDetails({
                                field: "password",
                                value: e.target.value,
                              });
                            }}
                            id="password"
                            name="password"
                            label="Password"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            validators={["required", "minStringLength:10"]}
                            errorMessages={[
                              "Please enter your password",
                              "Password is must at least 10 letters!",
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
                          onClick={closeOnClick}
                          sx={{ mt: 3, ml: 1 }}
                        >
                          Close
                        </Button>
                        {userSelected ? (
                          <>
                            {userSelected.providerId === "normal" && (
                              <Button
                                variant="contained"
                                onClick={() => {}}
                                sx={{ mt: 3, ml: 1 }}
                                className="btn_checkout"
                                type="submit"
                              >
                                Save
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => {}}
                            sx={{ mt: 3, ml: 1 }}
                            className="btn_checkout"
                            type="submit"
                          >
                            Create
                          </Button>
                        )}
                      </Box>
                    </ValidatorForm>
                  </React.Fragment>
                </Paper>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
