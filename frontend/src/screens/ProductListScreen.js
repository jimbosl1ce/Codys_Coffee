import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import Paginate from "../components/Paginate";

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  // brought in listUsers from userActions.

  // brought in useDispatch and useSelector
  const dispatch = useDispatch();

  // set userList = useSelector((state)=>state.userList ... check store. this is where our listUsers function is the actual value of this.)

  // our useEffect dispatches listUsers in userActions, which makes the request to our back-end and returns a list of users to our STORE at key "userList"

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  // users is an array of all products.

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
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
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorDelete}</Message>}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
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
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
