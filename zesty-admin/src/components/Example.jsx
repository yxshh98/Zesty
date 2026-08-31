import React from 'react'
import { FaChartBar, FaUser, FaShoppingCart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
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

export default function Example() {
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

    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Order Statistics (LE)',
                data: [500, 1200, 2150, 1800, 2000, 2500, 3000, 2200, 2700, 2900, 3100, 3200],
                borderColor: '#024b3b',
                backgroundColor: '#edf5f3',
                borderWidth: 2.5,
                pointBorderColor: '#024b3b',
                pointBackgroundColor: '#edf5f3',
                pointBorderWidth: 2.5,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#edf5f3',
                tension: 0.5, // Smooth curve
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        // maintainAspectRatio: false,
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
                    label: (tooltipItem) => `${tooltipItem.raw} LE`,
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
                    callback: (value) => `${value} LE`,
                },
            },
        },
    };

    const doughnutData = {
        labels: ['Delivered', 'On Delivery', 'Cancelled'],
        datasets: [
            {
                data: [95, 20, 5],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            },
        ],
    };
    return (
        <div className='d-flex'>
            <div className="sidebar bg-light">
                <div className="sidebar-header text-center py-4">
                    <h3>Tawsila</h3>
                </div>
                <ul className="list-unstyled px-3">
                    <li><FaChartBar className="icon" /> Dashboard</li>
                    <li><FaShoppingCart className="icon" /> Orders</li>
                    <li><FaUser className="icon" /> Customers</li>
                    <li><FaCog className="icon" /> Settings</li>
                    <li><FaSignOutAlt className="icon" /> Logout</li>
                </ul>
            </div>







            <div className="dashboard-container w-100 p-4">
                <div className="header d-flex justify-content-between align-items-center">
                    <h4>Welcome to Dashboard</h4>
                    <p>Zahra Ebraheem - Admin</p>
                </div>

                <div className="stats d-flex justify-content-between mb-4">
                    <div className="card text-center bg-light p-3">
                        <h5>Total Revenue</h5>
                        <p>6000LE</p>
                    </div>
                    <div className="card text-center bg-light p-3">
                        <h5>Total Orders</h5>
                        <p>250</p>
                    </div>
                    <div className="card text-center bg-light p-3">
                        <h5>iOS Downloads</h5>
                        <p>1600</p>
                    </div>
                    <div className="card text-center bg-light p-3">
                        <h5>Android Downloads</h5>
                        <p>900</p>
                    </div>
                </div>

                <div className="charts row">
                    <div className="col-md-8">
                        <div className="card p-4">
                            <h5>Order Statistics</h5>
                            <Line data={lineChartData} options={options} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-4">
                            <h5>Order Summary</h5>
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>
                </div>

                <div className="last-order mt-4">
                    <h5>Last Order</h5>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#121212</td>
                                <td>26 Oct 2024</td>
                                <td>Ahmed Saad</td>
                                <td>Delivered</td>
                                <td>4street, Heliopolis</td>
                                <td>200 LE</td>
                            </tr>
                            <tr>
                                <td>#121213</td>
                                <td>26 Oct 2024</td>
                                <td>Ahmed Saad</td>
                                <td>On Delivery</td>
                                <td>4street, Heliopolis</td>
                                <td>200 LE</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
