import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ProductForm from "../Modals/ProductForm";
import ImagesManager from "../Modals/ImagesManager";
import UserForm from "../Modals/UsersForm";
import OrderPreview from "../Modals/OrderPreview";
import { mainListItems } from "./listItems";
import { Outlet } from "react-router-dom";
import styledd from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { loginFailed, toggleAdminInfo } from "../../redux/authSlice";
import useToast from "../../hooks/useToast";
import { toggleUserForm } from "../../redux/commonSlice";

const BoxStyled = styledd(Box)`
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px
  }

  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const SignIn = styled(Link)`
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 600;
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
        style={{ color: "#000", textDecoration: "none" }}
        href="https://mui.com/"
      >
        MiinhHuy
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const settings = [
  {
    href: "/",
    text: "Profile",
  },
  {
    href: "/logout",
    text: "Logout",
  },
];

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000",
    },
  },
});

function DashboardContent() {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.auth.login);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [open, setOpen] = React.useState(true);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { notify } = useToast();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = async (event) => {
    if (event.currentTarget.localName === "li") {
      const path = event.currentTarget.attributes.path.value;
      setAnchorElUser(null);
      switch (path) {
        case "/": {
          dispatch(toggleAdminInfo(true));
          dispatch(toggleUserForm(true));
          break;
        }
        case "/logout": {
          dispatch(loginFailed());
          notify("success", "Logged out!");
          break;
        }
        default: {
          return "not match path";
        }
      }
    } else {
      setAnchorElUser(null);
    }
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              ></Typography>
              {/* NOTIFICATIONS */}
              {/* <IconButton color="inherit" sx={{ mr: 2 }}>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              {/* USER CONTROL */}
              {login ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={userInfo.username}
                        src="/static/images/avatar/2.jpg"
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting.text}
                        path={setting.href}
                        onClick={handleCloseUserMenu}
                      >
                        <Typography textAlign="center">
                          {setting.text}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ flexGrow: 0 }}>
                  <SignIn to="/auth/sign-in">Sign In</SignIn>
                </Box>
              )}
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
            </List>
          </Drawer>
          <BoxStyled
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Outlet />
              <Copyright sx={{ pt: 2 }} />
            </Container>
          </BoxStyled>
        </Box>
      </ThemeProvider>
      {/* PRODUCT FORM */}
      <ProductForm />
      {/* USER FORM */}
      <UserForm />
      {/* IMAGES MANAGER MODAL */}
      <ImagesManager />
      {/* ORDER PREVIEW MODAL */}
      <OrderPreview />
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
