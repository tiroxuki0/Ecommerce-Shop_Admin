import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Typography from "@mui/material/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { createUser } from "../../../redux/authActions";
import useToast from "../../../hooks/useToast";
import { ref, get, child } from "firebase/database";
import { db } from "../../../firebase/config";
import {
  loginSuccess,
  loginStart,
  loginFailed,
} from "../../../redux/authSlice";

const LinkStyled = styled(Link)`
  color: #f2eee9;
  text-decoration: none;
`;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <a
        style={{ color: "white", textDecoration: "none" }}
        href="https://mui.com/"
      >
        MiinhHuy
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { notify } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loginStart());
    const dbRef = ref(db);
    get(child(dbRef, "admins"))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.keys(snapshot.val()).map(
            (item) => snapshot.val()[item]
          );
          const user = data.find((u) => u.email === email);

          if (user) {
            notify("error", "Email is already exists!");
            dispatch(loginFailed());
            return;
          }
          const result = await createUser(
            { username, password, email, admin: false },
            dispatch,
            navigate
          );
          if (result.code === 1) {
            notify("success", "Sign up successfully!");
            dispatch(loginSuccess({ username, password, email, admin: false }));
          } else {
            notify("error", "Sign up failed!");
          }
        } else {
          dispatch(loginFailed());
          console.log("No data available!");
        }
      })
      .catch((error) => {
        dispatch(loginFailed());
        console.error(error);
      });
  };

  if (!ValidatorForm.hasValidationRule("minLengthEmail")) {
    ValidatorForm.addValidationRule("minLengthEmail", async (value) => {
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
    <Box
      sx={{
        my: 8,
        mx: 4,
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <PersonAddAltIcon />
      </Avatar>
      <Typography
        component="h1"
        variant="h5"
        sx={{ mt: 1, mb: 3, textTransform: "uppercase" }}
      >
        Sign up
      </Typography>
      <ValidatorForm onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextValidator
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              validators={["required", "minStringLength:10"]}
              errorMessages={[
                "Type your username!",
                "Username is must at least 10 letters!",
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <TextValidator
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              name="email"
              id="email"
              fullWidth
              autoComplete="email"
              validators={["required", "isEmail", "minLengthEmail"]}
              errorMessages={[
                "Type your email!",
                "Email is not valid",
                "Email is must at least 10 letters!",
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <TextValidator
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              name="password"
              id="password"
              type="password"
              fullWidth
              autoComplete="password"
              validators={["required", "minStringLength:10"]}
              errorMessages={[
                "Type your password!",
                "Password is must at least 10 letters!",
              ]}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <LinkStyled to="/auth/sign-in" variant="body2">
              Already have an account? Sign in
            </LinkStyled>
          </Grid>
        </Grid>
      </ValidatorForm>
      <Copyright sx={{ mt: 5 }} />
    </Box>
  );
}
