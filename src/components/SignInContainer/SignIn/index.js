import * as React from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ref, get, child } from "firebase/database";
import { db } from "../../../firebase/config";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailed,
} from "../../../redux/authSlice";
import useToast from "../../../hooks/useToast";

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
        MiinhHuy{" "}
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { notify } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dbRef = ref(db);
    dispatch(loginStart());
    get(child(dbRef, "admins"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.keys(snapshot.val()).map((item) => {
            return { ...snapshot.val()[item], id: item };
          });
          const user = data.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );
          if (!user) {
            notify("error", "Email is not valid!");
            dispatch(loginFailed());
            return;
          }
          if (user.password !== password) {
            notify("error", "Wrong password!");
            dispatch(loginFailed());
            return;
          }
          navigate("/");
          dispatch(loginSuccess(user));
          notify("success", "Welcome back!");
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

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <ExitToAppIcon />
      </Avatar>
      <Typography
        component="h1"
        variant="h5"
        sx={{ mt: 1, mb: 3, textTransform: "uppercase" }}
      >
        Sign in
      </Typography>
      <ValidatorForm onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextValidator
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validators={["required", "isEmail"]}
          errorMessages={["Type your email!", "Email is not valid!"]}
        />
        <TextValidator
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          validators={["required"]}
          errorMessages={["Type your password!"]}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs={12}>
            <LinkStyled to="/auth/sign-up" variant="body2">
              Forgot password?
            </LinkStyled>
          </Grid>
          <Grid item xs={12}>
            <LinkStyled to="/auth/sign-up" variant="body2">
              {"Don't have an account? Sign Up"}
            </LinkStyled>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </ValidatorForm>
    </Box>
  );
}
