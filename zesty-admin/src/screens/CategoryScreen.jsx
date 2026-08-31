import React from 'react'
import Sidebar from '../components/Sidebar'
import { useEffect } from 'react'
import { useReducer } from 'react'
import axios from "axios"
import { toast } from "react-toastify"
import { Row, Col } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import Header from '../components/Header'
import { useState } from 'react'
import Loading from '../components/Loading'
import MessageBox from '../components/MessageBox'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, categories: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

export default function CategoryScreen() {
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

    const [{ loading, error, categories }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        categories: []
    });

    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const category = await axios.get('https://zesty-backend.onrender.com/category/get-all-category');
                console.log(category.data);

                dispatch({ type: 'FETCH_SUCCESS', payload: category.data })
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message })
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const res = await fetch('https://zesty-backend.onrender.com/category/delete-category', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id })
        })

        if (res.status === 200) {
            toast.dark("category deleted successfully.");
            window.location.reload(true);
        } else if (res.status === 401) {
            toast.dark("category delete failed.");
        }
    }

    return (
        <div className="app">
            <Sidebar id={6} />
            <div style={{ width: "100%", padding: "0", margin: "0" }}>
                <Header />
                <div style={{ padding: "20px" }}>
                    <Row>
                        <Col md={8}>
                            <h2 style={{ margin: "15px 0 5px 20px" }}>Categories</h2>
                        </Col>
                        <Col>
                            <input type="text" value={search} placeholder='Search..' className='in form-control mt-4' onChange={(e) => setSearch(e.target.value)} />
                        </Col>
                        <Col>
                            <Link to={"/admin/add-category"} className='btn btn-outline-dark mt-4'>Add Category</Link>
                        </Col>
                    </Row>

                    <table className='table mt-5'>
                        <thead>
                            <tr>
                                <th>Category Id</th>
                                <th>Category Name</th>
                                <th>Category Image</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> : (
                            <tbody>

                                {categories.slice(0).reverse()
                                    .filter((item) => {
                                        const searchTerm = search.toLowerCase();
                                        const name = item.name.toLowerCase();
                                        return searchTerm && name.includes(searchTerm);
                                    })
                                    .map((category, i) => (
                                        <tr key={i} style={{ verticalAlign: "middle" }}>
                                            <td>{i + 1}</td>
                                            <td><h4>{category.name}</h4></td>
                                            <td><img src={category.image} height={"200px"} alt={category.name} /></td>
                                            <td><Link className='btn btn-primary' to={`/admin/update-category/${category._id}`}>Update</Link></td>
                                            <td><button className='btn btn-danger' onClick={() => handleDelete(category._id)}>Delete</button></td>
                                        </tr>

                                    ))}

                                {search === "" && categories.slice(0).reverse().map((category, i) => (
                                    <tr key={i} style={{ verticalAlign: "middle" }}>
                                        <td>{i + 1}</td>
                                        <td><h4>{category.name}</h4></td>
                                        <td><img src={category.image} height={"200px"} alt={category.name} /></td>
                                        <td><Link className='btn btn-primary' to={`/admin/update-category/${category._id}`}>Update</Link></td>
                                        <td><button className='btn btn-danger' onClick={() => handleDelete(category._id)}>Delete</button></td>
                                    </tr>

                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}
