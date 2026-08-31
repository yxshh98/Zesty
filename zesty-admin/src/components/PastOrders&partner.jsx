import axios from 'axios';
import React from 'react'
import { useReducer } from 'react';
import { useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap'
import Loading from './Loading';
import MessageBox from './MessageBox';

const reducerOrders = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, orders: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const reducerRestaurant = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, restaurants: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function PastOrdersandPartners() {
    const [{ loadingOrders, errorOrders, orders }, dispatchOrders] = useReducer(reducerOrders, {
        loading: true,
        error: '',
        orders: [],
    });

    const [{ loadingRestaurant, errorRestaurant, restaurants }, dispatchRestaurants] = useReducer(reducerRestaurant, {
        loading: true,
        error: '',
        restaurants: [],
    });

    const fetchOrders = async () => {
        dispatchOrders({ type: 'FETCH_REQUEST' });
        try {
            const orders = await axios.get('https://zesty-backend.onrender.com/order/get-all-orders/0');
            // calculateRevenue(orders.data); // Calculate revenue after fetching orders
            dispatchOrders({ type: 'FETCH_SUCCESS', payload: orders.data });
        } catch (error) {
            dispatchOrders({ type: 'FETCH_FAIL', payload: error.message });
        }
    };

    const fetchRestaurants = async () => {
        dispatchRestaurants({ type: 'FETCH_REQUEST' });
        try {
            const restaurants = await axios.get('https://zesty-backend.onrender.com/restaurant/get-all-restaurants');
            dispatchRestaurants({ type: 'FETCH_SUCCESS', payload: restaurants.data });
        } catch (error) {
            dispatchRestaurants({ type: 'FETCH_FAIL', payload: error.message });
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchRestaurants();
    }, []);

    return (
        <Row>
            <Col md={8}>
                <Card className='graph-card' style={{ margin: "20px 10px 0 20px", padding: "15px", }}>
                    <h5>Last Orders</h5>
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Date</th>
                                <th scope="col">Payment Mode</th>
                                <th scope="col">Restaurant</th>
                                <th scope="col">Status</th>
                                <th scope="col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingOrders ? <Loading /> : errorOrders ? <MessageBox>{errorOrders}</MessageBox> :
                                orders.slice(0).reverse().map((order, index) => (
                                    index < 10 &&
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{order.paymentMode}</td>
                                        <td>{order.restaurantName}</td>
                                        <td>{order.orderStatus === "Pending" || order.orderStatus === "Active" || order.orderStatus === "Prepared" ?
                                            <span className='text-warning bg-warning bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>{order.orderStatus}</span>
                                            : order.orderStatus === "Delivered" ? <span className='text-success bg-success bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>{order.orderStatus}</span>
                                                : order.orderStatus === "Rejected" && <span className='text-danger bg-danger bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>{order.orderStatus}</span>
                                        }</td>
                                        <td>{order.totalAmountUser}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Card>
            </Col>
            <Col md={4}>
                <Card className='graph-card' style={{ marginLeft: "-10px", marginRight: "15px" }}>
                    <h5>Top Partner</h5>
                    <table className='table'>
                        <tbody>
                            {loadingRestaurant ? <Loading /> : errorRestaurant ? <MessageBox>{errorRestaurant}</MessageBox> :
                                restaurants.map((restaurant, index) => (
                                    index < 4 &&
                                    <tr key={index}>
                                        <td>
                                            <img src={restaurant.logoImg} style={{ width: "150px", height: "100px" }} alt="" />
                                        </td>
                                        <td className='justify-content-center align-content-center'><h6>{restaurant.restaurantName}</h6></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Card>
            </Col>
        </Row>
    )
}
