import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Close";
import useScrollDisable from "../../../hooks/useScrollDisable";
import OrderItem from "./OrderItem";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { toggleOrderPreview } from "../../../redux/commonSlice";

const marks = [
  {
    value: 0,
    label: "Ordered",
  },
  {
    value: 50,
    label: "Shipped",
  },
  {
    value: 100,
    label: "Delivered",
  },
];

const Cart = () => {
  const dispatch = useDispatch();
  const orderSelected = useSelector((state) => state.common.orderSelected);
  const isOrderPreview = useSelector((state) => state.common.isOrderPreview);
  const ordersData = useSelector((state) => state.data.orders);
  const [selectedOrder, setSelectedOrder] = React.useState(0);
  const formRef = React.useRef();
  const backdropRef = React.useRef();
  const modalRef = React.useRef();

  const handleClickOutSide = async (e) => {
    if (e.target === backdropRef.current || e.target === modalRef.current) {
      dispatch(toggleOrderPreview(false));
    }
  };

  const closeOnClick = async (e) => {
    dispatch(toggleOrderPreview(false));
  };

  useScrollDisable(isOrderPreview);

  const handlePagination = (event, page) => {
    console.log(page);
    setSelectedOrder(page - 1);
  };

  const RenderOrders = () => {
    const orderFound = ordersData.find((order) => order.id === orderSelected);

    return (
      <>
        {orderSelected ? (
          <section id="orders" className="section_orders">
            <div className="container">
              <>
                <div className="order_header">
                  <div className="id_order">
                    <h4>Order No.</h4>
                    <p>#{orderSelected}</p>
                  </div>
                  <div className="date">
                    <h4>Date</h4>
                    <p>
                      {orderFound.createdAt.date +
                        " " +
                        orderFound.createdAt.time}
                    </p>
                  </div>
                </div>
                <div className="wrapper cart_wrapper">
                  <div className="cart_left_col">
                    {orderFound.cart.cartItems.map((item) => (
                      <OrderItem key={item.id} {...item} />
                    ))}
                  </div>

                  {/* <CheckOut /> */}

                  <div className="cart_right_col">
                    <div className="order_summary">
                      {/* PRICE */}
                      <div className="order_summary_details order_price_details">
                        <div className="price">
                          <span>Original Price</span>
                          <b>{orderFound.cart.originalPrice.text}</b>
                        </div>
                        <div className="discount">
                          <span>Discount</span>
                          <b>- {orderFound.cart.discount.text}</b>
                        </div>
                        <div className="delivery">
                          <span>Delivery</span>
                          <b>{orderFound.cart.delivery}</b>
                        </div>
                        <div className="separator"></div>
                        <div className="total_price">
                          <b>
                            <small>Total Price</small>
                          </b>
                          <b>{orderFound.cart.totalAmount.text}</b>
                        </div>
                      </div>
                      {/*  */}
                      <div className="separator"></div>
                      {/* ADDRESS */}
                      <div className="order_summary_details order_address_details">
                        <div className="order_name">
                          <div className="firstName">
                            <span>First name</span>
                            <b>{orderFound.shippingAddress.firstName}</b>
                          </div>
                          <div className="lastName">
                            <span>Last name</span>
                            <b>{orderFound.shippingAddress.lastName}</b>
                          </div>
                        </div>
                        <div className="address1">
                          <span>Address 1</span>
                          <b>{orderFound.shippingAddress.address1}</b>
                        </div>
                        <div className="address2">
                          <span>Address 2</span>
                          <b>{orderFound.shippingAddress.address2}</b>
                        </div>
                        <div className="city">
                          <span>City</span>
                          <b>{orderFound.shippingAddress.city}</b>
                        </div>
                        <div className="province">
                          <span>State/Province</span>
                          <b>{orderFound.shippingAddress.province}</b>
                        </div>
                        <div className="country">
                          <span>Country</span>
                          <b>{orderFound.shippingAddress.country}</b>
                        </div>
                      </div>

                      <h3 className="order_tracking">Tracking Order</h3>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ width: "85%" }}>
                          <Slider
                            aria-label="Custom marks"
                            defaultValue={
                              orderFound.tracking === "ordered"
                                ? 0
                                : orderFound.tracking === "shipped"
                                ? 50
                                : 100
                            }
                            step={50}
                            min={0}
                            max={100}
                            valueLabelDisplay="auto"
                            marks={marks}
                            disabled
                          />
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </section>
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <>
      {isOrderPreview && (
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
                maxWidth: "90vw",
                width: "100%",
              }}
              className="checkout_form preview_form"
              ref={formRef}
            >
              <Button className="button_close_preview" onClick={closeOnClick}>
                <CancelIcon sx={{ color: "#9e9e9e" }} />
              </Button>
              <RenderOrders />
              {/* {ordersData[uid] && Object.keys(ordersData[uid]).length !== 1 && (
              <Stack spacing={2} className="order_pagination">
                <Pagination
            count={Object.keys(ordersData[uid]).length}
            shape="rounded"
            onChange={handlePagination}
          />
              </Stack>
            )} */}
            </Paper>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
