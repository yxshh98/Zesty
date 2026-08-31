import React, { useReducer, useEffect, useState } from 'react';
import Header from './Header';
import TotalOrdersCard from './TotalOrdersCard';
import { Col, Row } from 'react-bootstrap';
import OrdersChart from './OrdersChart';
import axios from 'axios';
import PastOrdersandPartners from './PastOrders&partner';

export default function Content() {
    const [revenue, setRevenue] = useState(0); // State to store the calculated revenue
    const [totalMoenyItems, setTotalMenuItems] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchOrders = async () => {
        try {
            const orders = await axios.get(`https://zesty-backend.onrender.com/order/get-all-orders-for-restaurant/${restaurantId}`);
            calculateRevenue(orders.data); // Calculate revenue after fetching orders
        } catch (error) {
            console.log(error);
        }
    };

    const restaurantId = localStorage.getItem("restaurantId");

    const fetchRestaurants = async () => {
        try {
            const restaurants = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
            setTotalMenuItems(restaurants.data.menu.length);
            setTotalOrders(restaurants.data.orders.length);
        } catch (error) {
            console.log(error);
        }
    };

    const calculateRevenue = (orders) => {
        let totalAmountRestaurants = 0;
        orders.forEach((order) => {
            order.orderStatus === "Delivered" &&
                (totalAmountRestaurants += parseFloat(order.totalAmountRestaurant) || 0)
        });
        setRevenue((totalAmountRestaurants).toFixed(2)); // Update the revenue state
    };

    useEffect(() => {
        fetchOrders();
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
                <Col>
                    <TotalOrdersCard type="Orders" total={totalOrders} image={'./images/orders.png'} />
                </Col>
                <Col>
                    <TotalOrdersCard type="Menu Item" total={totalMoenyItems} image={'./images/restaurants.png'} />
                </Col>
            </Row>
            <OrdersChart />
            <PastOrdersandPartners />
        </div>
    );
}