import Chart from "../Chart";
import Deposits from "../Deposits";
import OrdersPreview from "../Orders/OrdersPreview";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import useDocTitle from "../../../hooks/useDocTitle";

const Home = () => {
  useDocTitle("Home Page");
  return (
    <>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <OrdersPreview />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
