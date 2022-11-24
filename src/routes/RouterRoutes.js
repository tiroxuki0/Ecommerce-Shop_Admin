import Dashboard from "../components/Dashboard";
import Error from "../Error";
import SignInContainer from "../components/SignInContainer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "../components/Dashboard/Users";
import Products from "../components/Dashboard/Products";
import Home from "../components/Dashboard/Home";
import Reviews from "../components/Dashboard/Reviews";
import Orders from "../components/Dashboard/Orders/Orders";
import Subs from "../components/Dashboard/Subs/Subs";
import RequiredAuth from "../components/RequiredAuth";
import { useSelector } from "react-redux";

const RouterRoutes = () => {
  const pendingProducts = useSelector((state) => state.data.pendingProducts);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequiredAuth>
              {pendingProducts ? (
                <div className="loading_wrapper">
                  <div className="loading"></div>
                </div>
              ) : (
                <Dashboard />
              )}
            </RequiredAuth>
          }
        >
          <Route
            path="/"
            element={
              <RequiredAuth>
                <Home />
              </RequiredAuth>
            }
          />
          <Route
            path="products"
            element={
              <RequiredAuth>
                <Products />
              </RequiredAuth>
            }
          />
          <Route
            path="users"
            element={
              <RequiredAuth>
                <Users />
              </RequiredAuth>
            }
          />
          <Route
            path="orders"
            element={
              <RequiredAuth>
                <Orders />
              </RequiredAuth>
            }
          />
          <Route
            path="subs"
            element={
              <RequiredAuth>
                <Subs />
              </RequiredAuth>
            }
          />
          <Route
            path="reviews"
            element={
              <RequiredAuth>
                <Reviews />
              </RequiredAuth>
            }
          />
        </Route>
        <Route path="/auth/:path" element={<SignInContainer />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default RouterRoutes;
