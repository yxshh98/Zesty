import React, { useState } from 'react'
import RegistrationHeader from '../components/RegistrationHeader'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

import "../assets/css/registration.css"
import Loading from '../components/Loading'

export default function SigninScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secretCode, setSecretCode] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // try {
        //     const res = await fetch("https://zesty-backend.onrender.com/admin/signup", {
        //         method: 'POST',
        //         headers: { 'content-type': 'application/json' },
        //         body: JSON.stringify({ username, password, secretCode })
        //     });
        //     if (res.status === 405) {
        //         toast.dark("Invalid Secret Code");
        //     } else if (res.status === 403) {
        //         toast.dark("User Already Registered");
        //     } else if (res.status === 200) {
        //         toast.dark("Successfully Signed Up");
        //         navigate("/admin/signin");
        //     }
        // } catch (error) {
        //     console.log(error);
        // }

        if(username === "Admin" && password === "Admin" && secretCode === "ZestyAdmin@123") {
            localStorage.setItem("username", "Admin");
            setLoading(false);
            navigate("/");
        } else {
            setLoading(false);
            toast.dark("Invalid Credentials")
        }
    }

    return (
        <div>
            <RegistrationHeader />
            <section id="signup-form">
                <Card className='mx-auto card-registration'>
                    <h2 className='card-title'>Hi, Welcome</h2>
                    <p>Enter credentials to continue</p>

                    <form action="">
                        <div className="form-floating m-3">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="username" placeholder='name@gmail.com' className='form-control' />
                            <label for="username">Username</label>
                        </div>
                        <div className="form-floating m-3">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder='password' className='form-control' />
                            <label for="password">Password</label>
                        </div>
                        <div className="form-floating m-3">
                            <input type="password" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} name="secretCode" id="secretCode" placeholder='Secret Code' className='form-control' />
                            <label for="secretCode">Secret Code</label>
                        </div>

                        {loading ? <Loading /> :
                            <Button className='btn-register m-3 me-3' onClick={submitHandler}>Sign In</Button>
                        }
                    </form><br />
                    <hr />
                </Card><br />
            </section>
        </div>
    )
}
