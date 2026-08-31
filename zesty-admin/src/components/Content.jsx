import React, { useReducer, useEffect, useState } from 'react';
import Header from './Header';
import TotalOrdersCard from './TotalOrdersCard';
import { Col, Row } from 'react-bootstrap';
import OrdersChart from './OrdersChart';
import PastOrdersandPartners from './PastOrders&partner';
import axios from 'axios';
import Loading from "../components/Loading"
import MessageBox from "../components/MessageBox"

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

const reducerUsers = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload };
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
            return { ...state, loading: false, restaurant: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function Content() {
    const [{ loadingOrders, errorOrders, orders }, dispatchOrders] = useReducer(reducerOrders, {
        loading: true,
        error: '',
        orders: [],
    });

    const [{ loadingUsers, errorUsers, users }, dispatchUsers] = useReducer(reducerUsers, {
        loading: true,
        error: '',
        users: [],
    });

    const [{ loadingRestaurant, errorRestaurant, restaurant }, dispatchRestaurants] = useReducer(reducerRestaurant, {
        loading: true,
        error: '',
        restaurant: [],
    });

    const [revenue, setRevenue] = useState(0); // State to store the calculated revenue

    const fetchOrders = async () => {
        dispatchOrders({ type: 'FETCH_REQUEST' });
        try {
            const orders = await axios.get('https://zesty-backend.onrender.com/order/get-all-orders/0');
            setRevenue(calculateRevenue(orders.data).toFixed(2)); // Calculate revenue after fetching orders
            dispatchOrders({ type: 'FETCH_SUCCESS', payload: orders.data });
        } catch (error) {
            dispatchOrders({ type: 'FETCH_FAIL', payload: error.message });
        }
    };

    const fetchUsers = async () => {
        dispatchUsers({ type: 'FETCH_REQUEST' });
        try {
            const users = await axios.get('https://zesty-backend.onrender.com/user/get-all-users');
            dispatchUsers({ type: 'FETCH_SUCCESS', payload: users.data });
        } catch (error) {
            dispatchUsers({ type: 'FETCH_FAIL', payload: error.message });
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

    const calculateRevenue = (orders) => {
        if (!orders || orders.length === 0) return 0;

        return orders.reduce((totalRevenue, order) => {
            const userAmount = parseFloat(order.totalAmountUser) || 0;
            const restaurantAmount = parseFloat((order.totalAmountRestaurant * 100) / 130) || 0;

            return totalRevenue + (userAmount - restaurantAmount);
        }, 0);
    };

    useEffect(() => {
        fetchOrders();
        fetchUsers();
        fetchRestaurants();
    }, []);

    return (
        <div style={{ width: '100%', padding: '0', margin: '0' }}>
            <Header />
            <h2 style={{ margin: '15px 0 5px 20px' }}>Dashboard</h2>
            <p style={{ marginLeft: '20px', color: '#676a6c' }}>Welcome to Dashboard</p>
            <Row style={{ marginTop: '20px', marginLeft: '10px', marginRight: '5px' }}>
                <Col>
                    <TotalOrdersCard type="Revenue" total={revenue} image={'./images/revenue.png'} />
                </Col>
                {loadingOrders ? (
                    <Loading />
                ) : errorOrders ? (
                    <MessageBox>{errorOrders}</MessageBox>
                ) : (
                    <Col>
                        <TotalOrdersCard type="Orders" total={orders.length} image={'./images/orders.png'} />
                    </Col>
                )}
                {loadingUsers ? (
                    <Loading />
                ) : errorUsers ? (
                    <MessageBox>{errorUsers}</MessageBox>
                ) : (
                    <Col>
                        <TotalOrdersCard type="Users" total={users.length} image={'./images/users.png'} />
                    </Col>
                )}
                {loadingRestaurant ? (
                    <Loading />
                ) : errorRestaurant ? (
                    <MessageBox>{errorRestaurant}</MessageBox>
                ) : (
                    <Col>
                        <TotalOrdersCard type="Restaurants" total={restaurant.length} image={'./images/restaurants.png'} />
                    </Col>
                )}
            </Row>
            <OrdersChart />
            <PastOrdersandPartners />
        </div>
    );
}