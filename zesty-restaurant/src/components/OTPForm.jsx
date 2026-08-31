import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from './Loading';

export default function OTPForm({ onNext, phone, id }) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const [timeLeft, setTimeLeft] = useState(60);
    useEffect(() => {
        if (timeLeft === 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleChange = (e) => {
        setOtp(e.target.value.slice(0, 4));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (otp === "") {
                toast.error("Enter OTP");
            } else {
                const number = phone.contact;
                const verificationId = id.verificationId;
                const res = await fetch("https://zesty-backend.onrender.com/otp/validate-otp", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ number, verificationId, otp })
                });

                if (res.status === 200) {
                    navigate("/signinProcess");
                    console.log(res.data);
                    toast.success("Otp verified");
                } else {
                    console.log(res);
                }
            }
        } catch (error) {
            console.log(error);

        }
    }

    const checkExist = async () => {
        try {
            const res = await axios.get(`https://zesty-backend.onrender.com/restaurant/check-exist/${phone.contact}`);
            if (res.status === 200) {
                console.log(res.data);
                console.log(res.data.restaurantData._id);
                localStorage.setItem("restaurantId", res.data.restaurantData._id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkExist();
    }, []);

    return (
        <div>
            <Card className='card1'>
                <h2 style={{ color: "#000" }}>Enter OTP</h2>
                <p style={{ color: "#aaa" }}>Enter OTP sent on number <strong style={{ color: "#000" }}>{phone.contact}</strong></p>

                <div className="form-floating mt-4 mb-2">
                    <input type="number" name="otp" value={otp} onChange={handleChange} id="otp" placeholder='OTP' className='in form-control' style={{ width: "100%" }} />
                    <label style={{ color: "#222" }}>Enter OTP</label>
                </div>
                <p style={{ color: "#aaa" }} className="text-center">
                    {
                        timeLeft == 0 ?
                            "Resend" :
                            `Resend OTP(00:${timeLeft})`
                    }
                </p>
                {loading ? <Loading /> :
                    <button className="btn mt-2 btn-submit" onClick={handleSubmit}>Continue</button>
                }

                <div className="mt-1 text-center">
                    <p style={{ color: "#aaa" }}>By loggin in, I agree to Zesty's <a href="" style={{ color: "#222" }}>terms & conditions</a></p>
                </div>
            </Card>
        </div>
    )
}
