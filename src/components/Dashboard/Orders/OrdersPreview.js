import * as React from "react";
import Title from "../Title";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { sortArray } from "../../../helpers/utils";

const columns = [
  {
    field: "id",
    headerName: "No.",
    width: 100,
    renderCell: (params) => {
      return <p>#{params.id}</p>;
    },
  },
  { field: "date", headerName: "Date", width: 150 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "address", headerName: "Ship To", width: 230 },
  {
    field: "payment",
    headerName: "Payment Method",
    width: 150,
  },
  {
    field: "amount",
    headerName: "Sale Amount",
    width: 100,
    renderCell: (params) => {
      return <p>${params.value}</p>;
    },
  },
  {
    field: "shipped",
    headerName: "Shipped",
    type: "boolean",
    width: 100,
  },
];

const StyledPaper = styled(Paper)`
  .MuiDataGrid-virtualScroller {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
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
  }
`;

export default function Orders() {
  const ordersData = useSelector((state) => state.data.orders);
  const [orders, setOrders] = React.useState(
    ordersData
      ? sortArray(ordersData).map((order) => {
          return {
            id: order.id,
            date: order.createdAt.date + " | " + order.createdAt.time,
            name:
              order.shippingAddress.lastName +
              " " +
              order.shippingAddress.firstName,
            address: order.shippingAddress.address1
              ? order.shippingAddress.address1
              : order.shippingAddress.address2,
            payment: "VISA " + order.paymentDetails.cardNumber,
            amount: order.cart.totalAmount.text,
            shipped: order.tracking === "ordered" ? false : true,
          };
        })
      : []
  );

  React.useEffect(() => {
    setOrders(
      ordersData
        ? sortArray(ordersData).map((order) => {
            return {
              id: order.id,
              date: order.createdAt.date + " | " + order.createdAt.time,
              name:
                order.shippingAddress.lastName +
                " " +
                order.shippingAddress.firstName,
              address: order.shippingAddress.address1
                ? order.shippingAddress.address1
                : order.shippingAddress.address2,
              payment: "VISA " + order.paymentDetails.cardNumber,
              amount: order.cart.totalAmount.text,
              shipped: order.tracking === "ordered" ? false : true,
            };
          })
        : []
    );
  }, [ordersData]);

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <StyledPaper>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={5}
          autoHeight={true}
          // loading
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          onProcessRowUpdateError={(err) => console.log(err)}
          editMode="row"
          experimentalFeatures={{ newEditingApi: true }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          hideFooterSelectedRowCount
        />
      </StyledPaper>
      <Link
        color="primary"
        to="/orders"
        style={{
          display: "block",
          marginTop: 15,
          textAlign: "left",
          textDecoration: "none",
          fontWeight: 700,
          color: "black",
        }}
      >
        See more orders
      </Link>
    </React.Fragment>
  );
}
