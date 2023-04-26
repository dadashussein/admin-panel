import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <div>
      <Layout>
        <h1>Orders</h1>
        <table className="basic">
          <thead>
            <tr>
              <th>Date</th>
              <th>Recipient</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      hour12: false,
                    })}
                  </td>
                  <td>
                    {order.name} {order.email} <br />
                    {order.rayon} {order.kuce} {order.tamunvan} <br />
                  </td>
                  <td>
                    {order.line_items.map((line) => (
                      <>
                        {line.price_data?.product_data?.name} x {line.quantity}
                      </>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default OrdersPage;
