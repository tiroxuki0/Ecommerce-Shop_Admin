import * as React from "react";
import Paper from "@mui/material/Paper";
import Title from "../Title";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { sortArray } from "../../../helpers/utils";
import {
  setOrderSelected,
  toggleOrderPreview,
} from "../../../redux/commonSlice";
import { updateOrder } from "../../../firebase/service";
import useDocTitle from "../../../hooks/useDocTitle";
import useToast from "../../../hooks/useToast";

const StyledBox = styled(Box)(({ theme }) => ({
  height: 550,
  width: "100%",
  "& .MuiDataGrid-cell--editing": {
    backgroundColor: "rgb(255,215,115, 0.19)",
    color: "#1a3e72",
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  "& .Mui-error": {
    backgroundColor: `rgb(126,10,15, ${
      theme.palette.mode === "dark" ? 0 : 0.1
    })`,
    color: theme.palette.error.main,
  },
}));

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
  useDocTitle("Orders Management");
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.data.orders);
  const { notify } = useToast();
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
            shipped:
              order.tracking === "ordered"
                ? false
                : order.tracking === "shipped"
                ? true
                : false,
          };
        })
      : []
  );
  const [selectionModel, setSelectionModel] = React.useState([]);

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

  const processRowUpdate = (newRow, oldRow) => {
    if (selectionModel[0]) {
      const orderFound = ordersData.find(
        (order) => order.id === selectionModel[0]
      );
      const { id, uid, ...other } = orderFound;
      updateOrder(uid, id, {
        ...other,
        tracking: newRow.shipped ? "shipped" : "ordered",
      });
      notify("success", "Updated tracking order!");
    }
    const updatedRow = { ...newRow, isNew: false };
    return updatedRow;
  };

  const columns = [
    {
      field: "id",
      headerName: "No.",
      width: 80,
      renderCell: (params) => {
        return <p>#{params.id}</p>;
      },
    },
    { field: "date", headerName: "Date", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "address", headerName: "Ship To", width: 250 },
    {
      field: "payment",
      headerName: "Payment Method",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Sale Amount",
      width: 100,
    },
    {
      field: "shipped",
      headerName: "Shipped*",
      type: "boolean",
      width: 100,
      editable: true,
    },
  ];

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <Title>Recent Orders</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Button onClick={() => {}}>
            <CancelIcon sx={{ color: "#9e9e9e" }} />
          </Button>
          <Button onClick={() => {}}>
            <SaveIcon sx={{ color: "#8bc34a" }} />
          </Button> */}
          <Button
            onClick={() => {
              dispatch(setOrderSelected(selectionModel[0]));
              dispatch(toggleOrderPreview(true));
            }}
          >
            <EditIcon sx={{ color: "#8bc34a" }} />
          </Button>
        </div>
      </div>
      <StyledPaper>
        <StyledBox>
          <DataGrid
            rows={orders}
            columns={columns}
            pageSize={10}
            // loading
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(err) => console.log(err)}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            editMode="row"
            experimentalFeatures={{ newEditingApi: true }}
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
        </StyledBox>
      </StyledPaper>
    </>
  );
}
