import "./App.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import RouterRoutes from "./routes/RouterRoutes";
import { onValue, ref } from "firebase/database";
import { storageListAll, db } from "./firebase/config";
import { useDispatch } from "react-redux";
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
  setAdmins,
} from "./redux/dataSlice";
import { setAddLoading } from "./redux/commonSlice";
import { urlToBase64 } from "./helpers/utils";

function App() {
  const dispatch = useDispatch();

  const getImageProducts = async () => {
    dispatch(getImagesStart());
    try {
      const productsImage = await storageListAll("images/products/");
      dispatch(setImages(productsImage));
      dispatch(getImagesEnd());
      return productsImage;
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
      onValue(productsDataRef, async (snapshot) => {
        const imagesData = await getImageProducts();
        const data = snapshot.val();
        const array = Object.keys(data).map((key) => {
          return { ...data[key], idDB: key };
        });
        const arrayBase64 = array.map(async (prod) => {
          /* IF HEROMIAGE */
          if (prod.heroImage) {
            const imagePath = prod.heroImage
              .slice(1)
              .split("/")
              .reduce((result, cur) => result + "%2F" + cur, "")
              .replace("%2F", "")
              .split(" ")
              .reduce((result, cur) => result + "%20" + cur, "")
              .replace("%20", "");

            const heroURL = await imagesData.find((img) =>
              img.toLowerCase().includes(imagePath.toLowerCase())
            );

            const heroBase64 = await urlToBase64(heroURL);

            const imgsBase64 = prod.images.map(async (img) => {
              const imagePath = img
                .slice(1)
                .split("/")
                .reduce((result, cur) => result + "%2F" + cur, "")
                .replace("%2F", "")
                .split(" ")
                .reduce((result, cur) => result + "%20" + cur, "")
                .replace("%20", "");

              const imageURL = await imagesData.find((img) =>
                img.toLowerCase().includes(imagePath.toLowerCase())
              );

              const imgBase64 = urlToBase64(imageURL);
              return imgBase64;
            });

            const imgsURL = prod.images.map(async (img) => {
              const imagePath = img
                .slice(1)
                .split("/")
                .reduce((result, cur) => result + "%2F" + cur, "")
                .replace("%2F", "")
                .split(" ")
                .reduce((result, cur) => result + "%20" + cur, "")
                .replace("%20", "");

              const imageURL = await imagesData.find((img) =>
                img.toLowerCase().includes(imagePath.toLowerCase())
              );

              return imageURL;
            });

            return Promise.all(imgsBase64)
              .then((res) => {
                return Promise.all(imgsURL)
                  .then((urls) => {
                    return {
                      ...prod,
                      heroImageURL: heroURL,
                      heroImageBase64: heroBase64,
                      imagesURL: urls,
                      imagesBase64: res,
                    };
                  })
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          } else {
            const imgsBase64 = prod.images.map(async (img) => {
              const imagePath = img
                .slice(1)
                .split("/")
                .reduce((result, cur) => result + "%2F" + cur, "")
                .replace("%2F", "")
                .split(" ")
                .reduce((result, cur) => result + "%20" + cur, "")
                .replace("%20", "");

              const imageURL = await imagesData.find((img) =>
                img.toLowerCase().includes(imagePath.toLowerCase())
              );

              const imgBase64 = urlToBase64(imageURL);
              return imgBase64;
            });

            const imgsURL = prod.images.map(async (img) => {
              const imagePath = img
                .slice(1)
                .split("/")
                .reduce((result, cur) => result + "%2F" + cur, "")
                .replace("%2F", "")
                .split(" ")
                .reduce((result, cur) => result + "%20" + cur, "")
                .replace("%20", "");

              const imageURL = await imagesData.find((img) =>
                img.toLowerCase().includes(imagePath.toLowerCase())
              );

              return imageURL;
            });

            return Promise.all(imgsBase64)
              .then((res) => {
                return Promise.all(imgsURL)
                  .then((urls) => {
                    return {
                      ...prod,
                      imagesURL: urls,
                      imagesBase64: res,
                    };
                  })
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          }
        });
        Promise.all(arrayBase64).then((res) => {
          dispatch(setProducts(res.filter((e) => e !== undefined)));
          dispatch(getProductsEnd());
          dispatch(setAddLoading(false));
        });
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
      const reviews = data
        ? Object.keys(data).map((key) => {
            return { ...data[key], idDB: key };
          })
        : [];
      const reviewsSorted = reviews.sort((a, b) => {
        return b.createdAt.second - a.createdAt.second;
      });
      dispatch(setReviews(data ? reviewsSorted : []));
    });
  };

  const getSubsData = () => {
    const subsDataRef = ref(db, "subscribersData");
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

  const getAdminsData = () => {
    const adminsDataRef = ref(db, "admins");
    onValue(adminsDataRef, (snapshot) => {
      const data = snapshot.val();
      const admins = data
        ? Object.keys(data).map((key) => {
            const { email, ...other } = data[key];
            return { email, id: key };
          })
        : [];
      dispatch(setAdmins(data ? admins : []));
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
    getAdminsData();
  }, []);

  return (
    <div className="App">
      <RouterRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;
