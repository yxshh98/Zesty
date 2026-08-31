import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import axios from "axios"
import { useReducer } from 'react'
import { useState } from 'react'
import { toast } from "react-toastify"
import { Row, Col, Modal } from "react-bootstrap"
import { useEffect } from 'react'
import Loading from '../components/Loading'
import MessageBox from '../components/MessageBox'
import { useNavigate } from 'react-router-dom'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

export default function UsersScreen() {
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = () => {
            const user = localStorage.getItem("username");
            if (user === null) {
                navigate("/admin/signin")
            }
        }
        checkAuth();
    }, [navigate]);
    const [{ loading, error, users }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        users: []
    });

    const [showDetails, setShowDetails] = useState(false);
    const [data, setData] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const users = await axios.get('https://zesty-backend.onrender.com/user/get-all-users');
                dispatch({ type: 'FETCH_SUCCESS', payload: users.data })
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message })
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const res = await fetch('https://zesty-backend.onrender.com/user/delete-user', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id })
        })

        if (res.status === 200) {
            toast.dark("Restaurant deleted successfully.");
            window.location.reload(true);
        } else if (res.status === 401) {
            toast.dark("Restaurant delete failed.");
        }
    }

    const handleShow = (details) => {
        setData(details);
        setShowDetails(true);
    }

    return (
        <div className='app'>
            <Sidebar id={4} />
            <div style={{ width: "100%", overflow: "hidden" }}>
                <Header />
                <div style={{ padding: "20px" }}>
                    <Row>
                        <Col md={8}>
                            <h2 style={{ margin: "15px 0 5px 20px" }}>Users</h2>
                        </Col>
                        <Col>
                            <input type="text" value={search} placeholder='Search..' className='in form-control mt-4' onChange={(e) => setSearch(e.target.value)} />
                        </Col>
                    </Row>

                    <table className='table mt-5'>
                        <thead>
                            <tr>
                                <th>User Id</th>
                                <th>Mobile</th>
                                <th>Details</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> : (
                            <tbody>
                                {users.slice(0).reverse()
                                    .filter((item) => {
                                        const searchTerm = search.toLowerCase();
                                        const name = item.mobile.toLowerCase();
                                        return searchTerm && name.includes(searchTerm);
                                    })
                                    .map((user, i) => (
                                        <tr key={i} style={{ verticalAlign: "middle" }}>
                                            <td>{i + 1}</td>
                                            <td><h4>{user.mobile}</h4></td>
                                            <td><button onClick={() => handleShow(user)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                                            <td><button className='btn btn-danger' onClick={() => handleDelete(user._id)}>Delete</button></td>
                                        </tr>
                                    ))}
                                {search === "" && users.slice(0).reverse().map((user, i) => (
                                    <tr key={i} style={{ verticalAlign: "middle" }}>
                                        <td>{i + 1}</td>
                                        <td><h4>{user.mobile}</h4></td>
                                        <td><button onClick={() => handleShow(user)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                                        <td><button className='btn btn-danger' onClick={() => handleDelete(user._id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        )}

                        {data != null && (

                            <Modal show={showDetails} className='modal modal-lg' onHide={() => setShowDetails(false)} >
                                <Modal.Header closeButton>
                                    <Modal.Title>{data.mobile}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <table className='table'>
                                        <tbody>
                                            <tr>
                                                <td>User Email</td>
                                                <td>{data.email}</td>
                                            </tr>
                                            <tr>
                                                <td>Zesty Lite</td>
                                                <td>{data.zestyLite}</td>
                                            </tr>
                                            <tr>
                                                <td>Zesty Money</td>
                                                <td>{data.zestyMoney}</td>
                                            </tr>
                                            <tr>
                                                <td>Address</td>
                                                <td>{data.address.map((adr) => (<>{adr}<br /></>))}</td>
                                            </tr>
                                            <tr>
                                                <td>Latitute</td>
                                                <td>{data.latitute}</td>
                                            </tr>
                                            <tr>
                                                <td>Longitude</td>
                                                <td>{data.longitude}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Modal.Body>
                            </Modal>
                        )}
                    </table>

                </div>
            </div>
        </div>
    )
}
