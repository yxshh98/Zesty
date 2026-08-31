import React, { useEffect, useReducer, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { Card, Col, Container, Row } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from "socket.io-client"
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, orders: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

const reducer1 = (state, action) => {
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

const socket = io("https://zesty-backend.onrender.com");

export default function ActiveOrderScreen() {
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        orders: []
    });

    const [{ loadingRes, errorRes, restaurantMenu }, dispatchRes] = useReducer(reducer1, {
        loading: true,
        error: '',
        restaurantMenu: []
    });

    const restaurantId = localStorage.getItem("restaurantId");

    const fetchOrderData = async () => {
        dispatch({ type: 'FETCH_REQUEST' });
        try {
            const order = await axios.get(`https://zesty-backend.onrender.com/order/get-active-order-for-restaurant/${restaurantId}`);
            dispatch({ type: 'FETCH_SUCCESS', payload: order.data })
        } catch (error) {
            dispatch({ type: 'FETCH_FAIL', payload: error.message })
        }
    }

    const fetchRestaurantData = async () => {
        dispatchRes({ type: 'FETCH_REQUEST' });
        try {
            const restaurant = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
            dispatchRes({ type: 'FETCH_SUCCESS', payload: restaurant.data.menu });
        } catch (error) {
            dispatchRes({ type: 'FETCH_FAIL', payload: error.message })
        }
    }

    const updateOrderStatus = async (orderStatus, id) => {
        try {
            const totalAmountRestaurant = ((caculateTotalAmount(orders.find(order => order._id === id))) * 100) / 130;
            const res = await axios.post("https://zesty-backend.onrender.com/order/update-order-status", { id, orderStatus, totalAmountRestaurant });
            if (res.status === 200) {
                fetchOrderData();
            } else if (res.status === 405) {
                toast.dark("update failed");
            } else {
                toast.dark("err in updating");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const caculateTotalAmount = (order) => {
        return order.order
            .map((item) => {
                const menuItem = restaurantMenu.find(menu => menu._id === item.itemId);
                return menuItem ? item.quantity * menuItem.price : 0;
            })
            .reduce((sum, itemTotal) => sum + itemTotal, 0)
            .toFixed(2);
    }

    useEffect(() => {
        fetchOrderData();
        fetchRestaurantData();
    }, [restaurantId]);

    useEffect(() => {
        if (restaurantId) {
            socket.emit("restaurant_join", restaurantId);

            socket.on("new_order", (order) => {
                fetchOrderData();
            });
        }

        return () => socket.off("new_order");
    }, [restaurantId])

    return (
        <div className='app'>
            <Sidebar id={2} />
            <div style={{ width: "100%", padding: "0", margin: "0" }}>
                <Header />

                <div style={{ padding: "20px" }}>
                    <h1>Active Orders</h1>

                    {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> :
                        <Container className='mt-4'>
                            <Row>
                                {orders.length === 0 ? <MessageBox>No Active orders</MessageBox> : orders.slice(0).reverse().map((order) => (

                                    <Col md={6}>
                                        <Card className='p-3 mt-3'>
                                            <Card.Header>
                                                <Row>
                                                    <Col md={9}>
                                                        ID: &nbsp;&nbsp;&nbsp;<strong>{order._id}</strong>
                                                    </Col>
                                                    <Col>
                                                        <strong>{new Date(order.createdAt).toLocaleTimeString()}</strong>
                                                    </Col>
                                                </Row>
                                            </Card.Header>
                                            <Card.Body>
                                                <table className='table'>
                                                    <tbody>
                                                        {loadingRes ? <Loading /> : errorRes ? <MessageBox>{errorRes}</MessageBox> :
                                                            <>
                                                                {order.order.map((item) => (
                                                                    <tr>
                                                                        <td>{item.quantity} x {
                                                                            restaurantMenu.map((menuItem) =>
                                                                                item.itemId === menuItem._id &&
                                                                                <span>{menuItem.name}</span>
                                                                            )}
                                                                        </td>
                                                                        <td className='text-end'>
                                                                            {
                                                                                restaurantMenu.map((menuItem) =>
                                                                                    item.itemId === menuItem._id &&
                                                                                    <span className='me-3'>{(((menuItem.price * 100) / 130) * item.quantity).toFixed(2)}</span>
                                                                                )}
                                                                        </td>
                                                                    </tr>
                                                                ))}

                                                                {/* Total Amount */}
                                                                <tr>
                                                                    <td>Total Amount</td>
                                                                    <td className="text-end">
                                                                        <strong>
                                                                            ₹ {(caculateTotalAmount(order) * 100) / 130}
                                                                        </strong>
                                                                    </td>
                                                                </tr>

                                                                {/* Order Status */}
                                                                <tr>
                                                                    <td>Order Status</td>
                                                                    {order.orderStatus === "Pending" ?
                                                                        <td className='d-flex'>
                                                                            <button className='btn btn-success w-50' onClick={() => updateOrderStatus("Active", order._id)}>Accept</button>&nbsp;
                                                                            <button className='btn btn-danger w-50' onClick={() => updateOrderStatus("Rejected", order._id)}>Reject</button>
                                                                        </td>
                                                                        :
                                                                        <td className='d-flex justify-content-end'>
                                                                            <select name="" className='in form-select w-50' onChange={(e) => updateOrderStatus(e.target.value, order._id)} defaultValue={order.orderStatus}>
                                                                                <option value="Active" disabled={order.orderStatus !== "Active"}>Active</option>
                                                                                <option value="Prepared">Prepared</option>
                                                                                <option value="Delivered">Delivered</option>
                                                                            </select>
                                                                        </td>
                                                                    }
                                                                </tr>
                                                            </>
                                                        }
                                                    </tbody>
                                                </table>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    }
                </div>
            </div>
        </div>
    )
}
