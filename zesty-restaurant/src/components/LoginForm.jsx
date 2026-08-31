import React, { useState } from 'react'
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import Loading from './Loading';

export default function LoginForm({ onNext }) {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (phone === "") {
                toast.error("Enter phone number");
            } else {
                const res = await axios.post(`https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-9761C5894CA2454&flowType=SMS&mobileNumber=${phone}`, { withCredentials: true }, {
                    headers: {
                        'authToken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTk3NjFDNTg5NENBMjQ1NCIsImlhdCI6MTczODQ5NTU4NiwiZXhwIjoxODk2MTc1NTg2fQ.8AnGMLdv7DcccoVkpdtIOqgJZiX95wjkX23vG06oy2DSxR41qok_TDFsWO7YzSIPwE9i10fvnJmM5vHouckCuA',
                    },
                });

                if (res.status === 200) {
                    console.log(res.data.data);
                    onNext({ contact: phone, verificationId: res.data.data.verificationId });
                    toast.success("Otp sent");
                } else {
                    console.log(res);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setPhone(e.target.value.slice(0, 10));
    }
    return (
        <Card className='card1'>
            <h2 style={{ color: "#000" }}>Get Started</h2>
            <p style={{ color: "#aaa" }}>Enter a mobile number to continue</p>

            <div className="form-floating mt-4 mb-2">
                <input type="number" name="phonenumber" value={phone} onChange={handleChange} id="phone" placeholder='Phone Number' className='in form-control' style={{ width: "100%" }} />
                <label style={{ color: "#222" }}>Phone Number</label>
            </div>
            {loading ? <Loading /> :
                <button className="btn mt-3 btn-submit" onClick={handleSubmit}>Send OTP</button>
            }
            <div className="mt-2 text-center">
                <p style={{ color: "#aaa" }}>By loggin in, I agree to Zesty's <a href="" style={{ color: "#222" }}>terms & conditions</a></p>
            </div>
        </Card>
    )
}
