import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProducts } from "../actions/productActions";

const ProductListScreen = ({ history, match }) => {
  // brought in listUsers from userActions.

  // brought in useDispatch and useSelector
  const dispatch = useDispatch();

  // set userList = useSelector((state)=>state.userList ... check store. this is where our listUsers function is the actual value of this.)

  // our useEffect dispatches listUsers in userActions, which makes the request to our back-end and returns a list of users to our STORE at key "userList"

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  // users is an array of all products.

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listProducts());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  const createProductHandler = () => {
    console.log("");
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      // DELETE PRODUCTS
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> CreateProduct
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>IMAGE</th>
              <th>Name</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>
                  <Image src={`${product.image}`} alt={product.name} fluid />
                </td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <br></br>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;
