import React, { useReducer, useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

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

export default function OrdersChart() {
    const [{ loadingOrders, errorOrders, orders }, dispatchOrders] = useReducer(reducerOrders, {
        loading: true,
        error: '',
        orders: [],
    });

    const [delivered, setDelivered] = useState(0);
    const [onDelivery, setOnDelivery] = useState(0);
    const [cancelled, setCancelled] = useState(0);

    const [lineChartData, setLineChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Order Statistics (Orders)',
                data: [],
                borderColor: '#024b3b',
                backgroundColor: '#edf5f3',
                borderWidth: 2.5,
                pointBorderColor: '#024b3b',
                pointBackgroundColor: '#edf5f3',
                pointBorderWidth: 2.5,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#edf5f3',
                tension: 0.5,
                fill: true,
            },
        ],
    });

    const restaurantId = localStorage.getItem("restaurantId");
    const fetchOrders = async () => {
        dispatchOrders({ type: 'FETCH_REQUEST' });
        try {
            const orders = await axios.get(`https://zesty-backend.onrender.com/order/get-all-orders-for-restaurant/${restaurantId}`);
            calculateOrderStatus(orders.data); // Calculate order status counts
            aggregateOrdersByDay(orders.data); // Aggregate orders by day
            dispatchOrders({ type: 'FETCH_SUCCESS', payload: orders.data });
        } catch (error) {
            dispatchOrders({ type: 'FETCH_FAIL', payload: error.message });
        }
    };

    const calculateOrderStatus = (orders) => {
        let deliver = 0;
        let active = 0;
        let rejected = 0;

        orders.forEach((order) => {
            if (order.orderStatus === 'Delivered') {
                deliver += 1;
            }
            if (order.orderStatus === 'Pending' || order.orderStatus === 'Active' || order.orderStatus === 'Prepared') {
                active += 1;
            }
            if (order.orderStatus === 'Rejected') {
                rejected += 1;
            }
        });

        setDelivered(deliver);
        setOnDelivery(active);
        setCancelled(rejected);
    };

    const aggregateOrdersByDay = (orders) => {
        const ordersByDay = {};

        // Group orders by day
        orders.forEach((order) => {
            const date = new Date(order.createdAt).toLocaleDateString(); // Extract date (e.g., "10/1/2023")
            if (!ordersByDay[date]) {
                ordersByDay[date] = 0;
            }
            ordersByDay[date] += 1;
        });

        // Sort dates in ascending order
        const sortedDates = Object.keys(ordersByDay).sort(
            (a, b) => new Date(a) - new Date(b)
        );

        // Update lineChartData
        setLineChartData((prevState) => ({
            ...prevState,
            labels: sortedDates,
            datasets: [
                {
                    ...prevState.datasets[0],
                    data: sortedDates.map((date) => ordersByDay[date]),
                },
            ],
        }));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    ChartJS.register(
        LineElement,
        PointElement,
        LineController,
        CategoryScale,
        LinearScale,
        Title,
        Tooltip,
        Legend,
        ArcElement
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#495057',
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw} Orders`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6c757d',
                },
            },
            y: {
                grid: {
                    color: '#e9ecef',
                },
                ticks: {
                    color: '#6c757d',
                    callback: (value) => `${value} Orders`,
                },
            },
        },
    };

    const doughnutData = {
        labels: ['Delivered', 'On Delivery', 'Cancelled'],
        datasets: [
            {
                data: [delivered, onDelivery, cancelled],
                backgroundColor: ['#024b3b', '#88cfbf', '#c6f5ea'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <Row style={{ marginRight: '5px' }}>
            <Col md={8}>
                <Card className="graph-card">
                    <h5>Order Statistics</h5>
                    <Line data={lineChartData} options={options} />
                </Card>
            </Col>

            <Col md={4}>
                <Card className="graph-card" style={{ marginLeft: '0' }}>
                    <h5>Order Summary</h5>
                    <br />
                    <Doughnut data={doughnutData} />
                </Card>
            </Col>
        </Row>
    );
}