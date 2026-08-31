import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useReducer } from 'react';
import { useEffect } from 'react';
import axios from "axios"
import { useState } from 'react';
import { Modal } from "react-bootstrap";
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';

const reducerOrders = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loadingOrders: true };
    case 'FETCH_SUCCESS':
      return { ...state, loadingOrders: false, orders: [...state.orders, ...action.payload], hasMore: action.payload.length > 0 };
    case 'FETCH_FAIL':
      return { ...state, loadingOrders: false, error: action.payload };
    default:
      return state;
  }
};

const reducerRestaurant = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loadingRes: true }
    case 'FETCH_SUCCESS':
      return { ...state, loadingRes: false, restaurantMenu: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loadingRes: false, errorRes: action.payload }
    default:
      return state;
  }
}
export default function OrdersScreen() {

  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("username");
      if (user === null) {
        navigate("/admin/signin")
      }
    }
    checkAuth();
  }, [navigate]);

  const [{ loadingOrders, errorOrders, orders, hasMore }, dispatchOrders] = useReducer(reducerOrders, {
    loading: false,
    error: '',
    orders: [],
    hasMore: true
  });

  const [{ loadingRes, errorRes, restaurantMenu }, dispatchRestaurant] = useReducer(reducerRestaurant, {
    loading: true,
    error: '',
    restaurantMenu: []
  });

  const [page, setPage] = useState(1);

  const fetchOrders = async (pageNum) => {
    dispatchOrders({ type: 'FETCH_REQUEST' });
    try {
      const response = await axios.get(`https://zesty-backend.onrender.com/order/get-all-orders/${pageNum}`);
      dispatchOrders({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatchOrders({ type: 'FETCH_FAIL', payload: error.response?.data?.message || error.message });
    }
  };

  const fetchRestaurantData = async (restaurantId) => {
    dispatchRestaurant({ type: 'FETCH_REQUEST' });
    try {
      const restaurant = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
      dispatchRestaurant({ type: 'FETCH_SUCCESS', payload: restaurant.data.menu });
    } catch (error) {
      dispatchRestaurant({ type: 'FETCH_FAIL', payload: error.message })
    }
  }

  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  let totalbase = 0;

  const handleShowDetails = (order) => {
    fetchRestaurantData(order.restaurantId);
    setSelectedOrder(order);
    setShow(true);
  }

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight && !loadingOrders && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingOrders, hasMore])

  return (
    <div className="app">
      <Sidebar id={3} />
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Header />
        <div style={{ padding: "20px" }}>
          <h2>Orders</h2>
          {errorOrders && <MessageBox>{errorOrders}</MessageBox>}
            <table className='mt-5 table'>
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Date</th>
                  <th>Restaurant Name</th>
                  <th>OrderStatus</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <th>{order.restaurantName}</th>
                    <td>
                      {order.orderStatus === "Delivered" ?
                        <span className='text-success bg-success bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>{order.orderStatus}
                        </span>
                        :
                        <span className='text-danger bg-danger bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>{order.orderStatus}</span>
                      }
                    </td>
                    <td><button className='btn btn-outline-dark' onClick={() => handleShowDetails(order)}>Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          {loadingOrders && <Loading />}

        </div>
      </div>

      {selectedOrder && (
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Restaurant Name: <strong>{selectedOrder.restaurantName}</strong></p>
            <h5>Items : </h5>
            <table className='table'>
              <tbody>
                {
                  loadingRes ? <Loading /> : errorRes ? <MessageBox>{errorRes}</MessageBox> :
                    <>
                      {selectedOrder.order && (
                        selectedOrder.order.map((item) => (
                          <tr>
                            <td>{item.quantity} x {
                              restaurantMenu.map((menuItem) =>
                                item.itemId === menuItem._id &&
                                <span>{menuItem.name}</span>
                              )}
                            </td>
                            <td className='text-end'>
                              {
                                restaurantMenu.map((menuItem) => {
                                  if (item.itemId === menuItem._id) {
                                    totalbase += parseFloat(menuItem.price * item.quantity);
                                    return <span>{parseFloat(menuItem.price * item.quantity).toFixed(2)}</span>
                                  }
                                  return "";
                                })}
                            </td>
                          </tr>
                        ))
                      )}
                      <tr>
                        <td>Taxes</td>
                        <td className='text-end'>
                          {(selectedOrder.totalAmountUser - totalbase).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Amount</th>
                        <th className="text-end">
                          {/* ₹ {parseInt((selectedOrder.totalAmountRestaurant * 100) / 130)} */}
                          {selectedOrder.totalAmountUser}
                        </th>
                      </tr>
                    </>
                }
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
      )
      }
    </div >
  )
}
