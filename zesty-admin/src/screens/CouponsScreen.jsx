import React, { useEffect, useReducer } from 'react';
import Sidebar from '../components/Sidebar';
import { Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import axios from "axios";
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, coupons: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function CouponScreen() {
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

    const [{ loading, error, coupons }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        coupons: []
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const res = await axios.get('https://zesty-backend.onrender.com/coupon/get-all-coupons');
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const res = await fetch('https://zesty-backend.onrender.com/coupon/delete-coupon', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (res.status === 200) {
            toast.dark("Coupon deleted successfully.");
            window.location.reload();
        } else {
            toast.dark("Coupon deletion failed.");
        }
    };

    return (
        <div className="app">
            <Sidebar id={7} />
            <div style={{ width: "100%", padding: "0", margin: "0" }}>
                <Header />
                <div style={{ padding: "20px" }}>
                    <Row>
                        <Col md={10}>
                            <h2 style={{ margin: "15px 0 5px 20px" }}>Coupons</h2>
                        </Col>
                        <Col>
                            <Link to={"/admin/add-coupon"} className='btn btn-outline-dark mt-4'>Add Coupon</Link>
                        </Col>
                    </Row>

                    <table className='table mt-5'>
                        <thead>
                            <tr>
                                <th>Promo Code</th>
                                <th>Description</th>
                                <th>Discount Percentage</th>
                                <th>Discount Upto</th>
                                <th>Minimum Amount</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> : (
                            <tbody>
                                {coupons.slice(0).reverse().map((coupon, i) => (
                                    <tr key={i}>
                                        <td>{coupon.promoCode}</td>
                                        <td>{coupon.description}</td>
                                        <td>{coupon.discountPercentage}%</td>
                                        <td>{coupon.discountUpto}</td>
                                        <td>{coupon.minAmtReq}</td>
                                        <td><Link to={`/admin/update-coupon/${coupon._id}`} className='btn btn-primary'>Update</Link></td>
                                        <td><button className='btn btn-danger' onClick={() => handleDelete(coupon._id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
