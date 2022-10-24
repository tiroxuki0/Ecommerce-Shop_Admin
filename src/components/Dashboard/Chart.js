import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import { useSelector } from "react-redux";
import { groupByKey, sortArray } from "../../helpers/utils";

export default function Chart() {
  const ordersData = useSelector((state) => state.data.orders);
  const [orders, setOrders] = React.useState(() => {
    if (ordersData) {
      const ordersArray = sortArray(ordersData)
        .map((order) => {
          return {
            time: order.createdAt.date.split("-")[2],
            amount: order.cart.totalAmount.number,
          };
        })
        .flat()
        .sort((a, b) => {
          return b.time - a.time;
        });
      const ordersGroupBy = groupByKey(ordersArray, "time");
      const array = Object.keys(ordersGroupBy).map((key) => ordersGroupBy[key]);
      const result = array.map((order) => {
        const total = order.reduce((total, item) => {
          total = total + item.amount;
          return total;
        }, 0);
        return { time: order[0].time, amount: total };
      });
      return result;
    } else {
      return [];
    }
  });

  React.useEffect(() => {
    setOrders(() => {
      if (ordersData) {
        const ordersArray = sortArray(ordersData)
          .map((order) => {
            return {
              time: order.createdAt.date.split("-")[2],
              amount: order.cart.totalAmount.number,
            };
          })
          .flat()
          .sort((a, b) => {
            return b.time - a.time;
          });
        const ordersGroupBy = groupByKey(ordersArray, "time");
        const array = Object.keys(ordersGroupBy).map(
          (key) => ordersGroupBy[key]
        );
        const result = array.map((order) => {
          const total = order.reduce((total, item) => {
            total = total + item.amount;
            return total;
          }, 0);
          return { time: order[0].time, amount: total };
        });
        return result;
      } else {
        return [];
      }
    });
  }, [ordersData]);

  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>This Month</Title>
      <ResponsiveContainer>
        <LineChart
          data={orders}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
