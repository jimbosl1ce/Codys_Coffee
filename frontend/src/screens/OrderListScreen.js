import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";

const OrderListScreen = ({ history }) => {
  // brought in listUsers from userActions.

  // brought in useDispatch and useSelector
  const dispatch = useDispatch();

  // set userList = useSelector((state)=>state.userList ... check store. this is where our listUsers function is the actual value of this.)

  // our useEffect dispatches listOrders in userActions, which makes the request to our back-end and returns a list of users to our STORE at key "userList"

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  // users is an array of all orders.

  // retrieving user information to validate isAdmin:
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {successDelete && <Message variant="success">user deleted!</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>Total Price</th>
              <th>Order Created</th>
              <th>Order Paid</th>
              <th>Order Delivered</th>
              <th>ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.totalPrice}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                  <br></br>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
