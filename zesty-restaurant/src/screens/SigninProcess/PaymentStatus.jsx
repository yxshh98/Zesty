import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

export default function PaymentSuccess() {
    const [restaurant, setRestaurant] = useState(null);
    const restaurantId = localStorage.getItem("restaurantId");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const res = await axios.get(`https://zesty-backend.onrender.com/restaurant/get-menu-images/${restaurantId}`);
            console.log(res.data);

            setRestaurant(res.data);
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    }

    const updatePaymentStatus = async () => {
        try {
            const res = await axios.put(`https://zesty-backend.onrender.com/restaurant/update-payment-status/${restaurantId}`);
            if (res.status === 200) {
                console.log("status updated");
            } else if (res.status === 401) {
                console.log("error in updating");
            } else if (res.status === 405) {
                console.log("internal server error");
            } else {
                console.log("unknown error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkVerified = async () => {
        const res = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
        if (res.data.verified === "Approved") {
            navigate("/dashboard");
        } else if (res.data.verified === "Rejected") {
            window.alert("Your application has been rejected please try again");
            localStorage.removeItem("restaurantId");
            navigate("/signinProcess");
        }
    }

    useEffect(() => {
        updatePaymentStatus();
        checkVerified();
        fetchData();
    }, [restaurantId]);

    return (
        <div>
            {restaurant ? (
                <div className='text-center'>
                    <img src="/images/zesty-without-bg-black.png" alt="" height={"500px"} width={"500px"} />
                    <h4>Your application is submitted to admin for verification</h4>
                </div>
            ) : (
                <p><Loading /></p>
            )}
        </div>
    )
}

export function PaymentFailed() {
    return (
        <div>
            <h1>OOps !!</h1>
            <h3>Payment Failed Please try after some time</h3>
        </div>
    )
}