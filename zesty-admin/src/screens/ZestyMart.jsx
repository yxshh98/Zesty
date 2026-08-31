import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useReducer } from 'react'
import { Row, Col, Modal } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useState } from 'react'
import Loading from '../components/Loading'
import MessageBox from '../components/MessageBox'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, martItems: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

export default function ZestyMart() {
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
    const [{ loading, error, martItems }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        martItems: []
    });

    const [showDetails, setShowDetails] = useState(false);
    const [details, setDetails] = useState(null);
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    // const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const martItem = await axios.get('https://zesty-backend.onrender.com/zestyMart/get-all-martItem');
                dispatch({ type: 'FETCH_SUCCESS', payload: martItem.data })
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message })
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const res = await fetch('https://zesty-backend.onrender.com/zestyMart/delete-mart-item', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id })
        })

        if (res.status === 200) {
            toast.dark("Mart item deleted successfully.");
            window.location.reload(true);
        } else if (res.status === 401) {
            toast.dark("Mart item delete failed.");
        }
    }

    const handleShow = async (details) => {
        setDetails(details);
        setShowDetails(true);
    }

    return (
        <div className='app'>
            <Sidebar id={2} />
            <div style={{ width: "100%", overflow: "hidden" }}>
                <Header />

                <div style={{ padding: "20px" }}>
                    <Row>
                        <Col md={5}>
                            <h2 style={{ margin: "15px 0 5px 20px" }}>Mart Items</h2>
                        </Col>
                        <Col md={2}>
                            <input type="text" value={search} placeholder='Search..' className='in form-control mt-4' onChange={(e) => setSearch(e.target.value)} />
                        </Col>
                        <Col md={3}>
                            <select name="category" id="" onChange={(e) => setCategory(e.target.value)} className='in form-select mt-4 w-30'>
                                <option value="" disabled selected>Select category</option>
                                <option value="">All</option>
                                <option value="Fresh">Fresh</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Home">Home</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </Col>
                        <Col>
                            <Link to={"/admin/add-mart-item"} className='btn btn-outline-dark mt-4'>Add Mart Item</Link>
                        </Col>
                    </Row>

                    <table className='table mt-5'>
                        <thead>
                            <tr>
                                <th>Product Id</th>
                                <th>product Name</th>
                                <th>Details</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        {
                            category === "" ? (
                                <>
                                    {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> : (
                                        <tbody>
                                            {search === "" && martItems.slice(0).reverse().map((martItem, i) => (
                                                <tr key={i} style={{ verticalAlign: "middle" }}>
                                                    <td>{i + 1}</td>
                                                    <td><h4>{martItem.name}</h4></td>
                                                    <td><button onClick={() => handleShow(martItem)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                                                    <td><Link to={`/admin/update-mart-item/${martItem._id}`} className='btn btn-primary'>Update</Link></td>
                                                    <td><button className='btn btn-danger' onClick={() => handleDelete(martItem._id)}>Delete</button></td>
                                                </tr>
                                            ))}

                                            {(() => {
                                                const filteredItems = martItems.slice(0).reverse()
                                                    .filter((item) => {
                                                        const searchTerm = search.toLowerCase();
                                                        const name = item.name.toLowerCase();
                                                        return searchTerm && name.includes(searchTerm);
                                                    });

                                                return filteredItems.length > 0 ? (
                                                    filteredItems.map((martItem, i) => (
                                                        <tr key={i} style={{ verticalAlign: "middle" }}>
                                                            <td>{i + 1}</td>
                                                            <td><h4>{martItem.name}</h4></td>
                                                            <td><button onClick={() => handleShow(martItem)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                                                            <td><Link to={`/admin/update-mart-item/${martItem._id}`} className='btn btn-primary'>Update</Link></td>
                                                            <td><button className='btn btn-danger' onClick={() => handleDelete(martItem._id)}>Delete</button></td>
                                                        </tr>
                                                    ))
                                                ) : search !== "" && (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            <MessageBox>No Results Found for "{search}"</MessageBox>
                                                        </td>
                                                    </tr>
                                                );
                                            })()}

                                        </tbody>
                                    )}
                                </>
                            ) : (
                                <>
                                    {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> : (
                                        <tbody>
                                            {search === "" && martItems.slice(0).reverse().map((martItem, i) => (
                                                martItem.category === category &&
                                                <tr key={i} style={{ verticalAlign: "middle" }}>
                                                    <td>{i + 1}</td>
                                                    <td><h4>{martItem.name}</h4></td>
                                                    <td><button onClick={() => handleShow(martItem)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                                                    <td><Link to={`/admin/update-mart-item/${martItem._id}`} className='btn btn-primary'>Update</Link></td>
                                                    <td><button className='btn btn-danger' onClick={() => handleDelete(martItem._id)}>Delete</button></td>
                                                </tr>
                                            ))}
                                            {martItems.slice(0).reverse()
                                                .filter((item) => {
                                                    const searchTerm = search.toLowerCase();
                                                    const name = item.name.toLowerCase();
                                                    return searchTerm && name.startsWith(searchTerm);
                                                })
                                                .map((martItem, i) => (
                                                    martItem.category === category &&
                                                    <tr key={i} style={{ verticalAlign: "middle" }}>
                                                        <td>{i + 1}</td>
                                                        <td><h4>{martItem.name}</h4></td>
                                                        <td><button onClick={() => handleShow(martItem)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                                                        <td><Link to={`/admin/update-mart-item/${martItem._id}`} className='btn btn-primary'>Update</Link></td>
                                                        <td><button className='btn btn-danger' onClick={() => handleDelete(martItem._id)}>Delete</button></td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    )}
                                </>
                            )
                        }

                        {details != null &&
                            <Modal show={showDetails} onHide={() => setShowDetails(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{details.restaurantName}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Product Name : <h2 className='ms-3'>{details.name}</h2>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {
                                            details.images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Product ${index}`}
                                                    style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
                                                />
                                            ))
                                        }
                                    </div>
                                    <table className='table'>
                                        <tbody>
                                            <tr>
                                                <td>Product Price</td>
                                                <td>{details.price}</td>
                                            </tr>
                                            <tr>
                                                <td>Product Description</td>
                                                <td>{details.description}</td>
                                            </tr>
                                            <tr>
                                                <td>Product Servings(weight)</td>
                                                <td>{details.weight}</td>
                                            </tr>
                                            <tr>
                                                <td>Product Category</td>
                                                <td>{details.category}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className="btn btn-secondary" onClick={() => setShowDetails(false)}>
                                        Close
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </table>
                </div>
            </div>
        </div >
    )
}
