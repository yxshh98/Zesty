import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { Card, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import "../assets/css/forms.css"

export default function HelpCenterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("https://zesty-backend.onrender.com/ask-help", { email, name, query });
            if (res.status === 200) {
                toast.dark("Your query has been sent.");
                navigate("/dashboard");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const restaurantId = localStorage.getItem("restaurantId");

    const fetchData = async () => {
        setLoading(true);
        const res = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
        setName(res.data.restaurantName);
        setEmail(res.data.email);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='app'>
            <Sidebar id={7} />
            <div style={{ width: "100%", padding: "0", margin: "0" }}>
                <Header />

                <Container>
                    <h1 className='p-3'>Help Center</h1>
                    <Card className='text-center mt-3 mx-auto p-5 form-card'>
                        <div className="form-floating mt-3">
                            <input type="text" name="name" value={name} id="name" placeholder='name' className='in form-control' style={{ width: "100%" }} disabled />
                            <label style={{ color: "#222" }}>Enter Name</label>
                        </div>

                        <div className="form-floating mb-2">
                            <input type="email" name="name" value={email} id="email" placeholder='email' className='in form-control' style={{ width: "100%" }} disabled />
                            <label style={{ color: "#222" }}>Enter Email</label>
                        </div>

                        <textarea rows={5} name="name" value={query} onChange={(e) => setQuery(e.target.value)} id="name" placeholder='Enter your query' className='in form-control' style={{ width: "100%" }}></textarea>

                        {!loading ?
                            <button className='btn btn-dark mt-5' onClick={handleSubmit}>Submit</button>
                            : <Loading />
                        }
                    </Card>
                </Container>
            </div>
        </div>
    )
}
