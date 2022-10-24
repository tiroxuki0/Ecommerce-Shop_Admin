import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f2eee9",
    },
  },
});

export default function SignInContainer() {
  const pending = useSelector((state) => state.auth.pending);
  let { path } = useParams();
  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {pending && (
            <div className="wrapper_loading">
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {path === "sign-in" ? <SignIn /> : <SignUp />}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
