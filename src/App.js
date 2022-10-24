import "./App.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import RouterRoutes from "./routes/RouterRoutes";
import { onValue, ref, get, child } from "firebase/database";
import { storageListAll, db } from "./firebase/config";
import { useDispatch, useSelector } from "react-redux";
import {
  getImagesStart,
  getImagesEnd,
  setImages,
  getProductsStart,
  getProductsEnd,
  setProducts,
  setOrders,
  setReviews,
  setUsers,
  setSubs,
} from "./redux/dataSlice";

function App() {
  const dispatch = useDispatch();
  const pendingImages = useSelector((state) => state.data.pendingImages);
  const pendingProducts = useSelector((state) => state.data.pendingProducts);

  const getImageProducts = async () => {
    dispatch(getImagesStart());
    try {
      const productsImage = await storageListAll("images/products/");
      dispatch(setImages(productsImage));
      dispatch(getImagesEnd());
    } catch (err) {
      console.log(err);
      dispatch(getImagesEnd());
    }
  };

  const getProductsData = async () => {
    dispatch(getProductsStart());
    try {
      /*  */
      const productsDataRef = ref(db, "productsData");
      onValue(productsDataRef, (snapshot) => {
        const data = snapshot.val();
        const array = Object.keys(data).map((key) => data[key]);
        dispatch(setProducts(array.filter((e) => e !== undefined)));
        dispatch(getProductsEnd());
        getImageProducts();
      });
      /*  */
    } catch (err) {
      console.log(err);
      dispatch(getProductsEnd());
    }
  };

  const getReviewsData = () => {
    const reviewsDataRef = ref(db, "reviewsData");
    onValue(reviewsDataRef, (snapshot) => {
      const data = snapshot.val();
      const reviews = data ? Object.keys(data).map((key) => data[key]) : [];
      const reviewsSorted = reviews.sort((a, b) => {
        return b.createdAt.second - a.createdAt.second;
      });
      dispatch(setReviews(data ? reviewsSorted : []));
    });
  };

  const getSubsData = () => {
    const subsDataRef = ref(db, "subcribersData");
    onValue(subsDataRef, (snapshot) => {
      const data = snapshot.val();
      const subs = data
        ? Object.keys(data).map((key) => {
            return { ...data[key], id: key };
          })
        : [];
      dispatch(setSubs(subs));
    });
  };

  const getUsersData = () => {
    const usersDataRef = ref(db, "usersData");
    onValue(usersDataRef, (snapshot) => {
      const data = snapshot.val();
      const users = Object.keys(data).map((item) => {
        const { uid, ...other } = data[item];
        return { ...other, idDB: item, id: uid };
      });
      dispatch(setUsers(data ? users : []));
    });
  };

  const getOrdersData = () => {
    const ordersDataRef = ref(db, "ordersData");
    onValue(ordersDataRef, (snapshot) => {
      const data = snapshot.val();
      const array = Object.keys(data).map((userId) => {
        const arrayChild = Object.keys(data[userId]).map((orderId) => {
          return { ...data[userId][orderId], uid: userId, id: orderId };
        });
        return arrayChild;
      });
      dispatch(setOrders(data ? [].concat.apply([], array) : []));
    });
  };

  React.useEffect(() => {
    getProductsData();
    getReviewsData();
    getOrdersData();
    getUsersData();
    getSubsData();
  }, []);

  return (
    <div className="App">
      {pendingProducts && pendingImages ? (
        "Loading"
      ) : (
        <>
          <RouterRoutes />
          <ToastContainer />
        </>
      )}
    </div>
  );
}

export default App;
