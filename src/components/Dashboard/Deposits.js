import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { useSelector } from "react-redux";
import { displayMoney, sortArray } from "../../helpers/utils";

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  const ordersData = useSelector((state) => state.data.orders);
  const [deposits, setDeposits] = React.useState(
    ordersData.length > 0
      ? ordersData.reduce((total, order) => {
          total = total + order.cart.totalAmount.number;
          return total;
        }, 0)
      : 0
  );
  const [date, setDate] = React.useState(
    ordersData.length > 0 ? sortArray(ordersData)[0].createdAt.date : ""
  );

  React.useEffect(() => {
    setDeposits(
      ordersData.length > 0
        ? ordersData.reduce((total, order) => {
            total = total + order.cart.totalAmount.number;
            return total;
          }, 0)
        : 0
    );
    setDate(
      ordersData.length > 0 ? sortArray(ordersData)[0].createdAt.date : ""
    );
  }, [ordersData]);

  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        {displayMoney(deposits)}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {date}
      </Typography>
      <div>
        <Link
          color="primary"
          href="#"
          onClick={preventDefault}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}
