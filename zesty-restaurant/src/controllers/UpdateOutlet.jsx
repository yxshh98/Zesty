import React, { useEffect, useReducer, useState } from 'react'
import Header from '../components/Header'
import { Card, Container } from 'react-bootstrap'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import MessageBox from "../components/MessageBox";
import "../assets/css/forms.css"

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, outlet: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function UpdateOutlet() {
    const [{ loading, error, outlet }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        outlet: [],
    });

    const [loading1, setLoading] = useState(false);

    const navigate = useNavigate();
    const restaurantId = localStorage.getItem("restaurantId");
    const [logoImg, setLogoImg] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [cuisines, setCuisines] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [pan, setPan] = useState("");
    const [gstin, setGstin] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [acno, setAcno] = useState("");

    const fetchData = async () => {
        dispatch({ type: 'FETCH_REQUEST' });
        try {
            const response = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
            dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_FAIL', payload: error.message });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const outletData = new FormData();
            outletData.append("restaurantId", restaurantId);
            outletData.append("logoImg", logoImg);
            outletData.append("restaurantName", restaurantName);
            outletData.append("ownerName", ownerName);
            outletData.append("cuisines", cuisines);
            outletData.append("email", email);
            outletData.append("mobile", mobile);
            outletData.append("pan", pan);
            outletData.append("gstin", gstin);
            outletData.append("ifsc", ifsc);
            outletData.append("acno", acno);

            const res = await axios.post("https://zesty-backend.onrender.com/restaurant/update-restaurant", outletData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            if (res.status === 200) {
                toast.dark("Updated.");
                navigate("/restaurant/info");
            } else if (res.status === 405) {
                toast.dark("Updating failed.");
                setLoading(false);
            } else {
                toast.dark("internal error");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [restaurantId]);
    return (
        <div style={{ width: "100%", padding: "0", margin: "0" }}>
            <Header />
            <Container>
                <Card className='text-center mt-5 mx-auto p-5 form-card'>
                    <h3><u>Update Outlet Info</u></h3>
                    {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> :
                        <form action="">

                            <div className="form-floating mt-5 mb-2">
                                <input type="file" accept='image/png, image/jpeg' name="image" onChange={(e) => setLogoImg(e.target.files[0])} id="logoImg" placeholder='Menu Item Image' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Image</label>
                            </div>
                            <img src={outlet.logoImg} width={"80%"} alt={outlet.name} />
                            {logoImg && (
                                <div className="text-center">
                                    <img src={URL.createObjectURL(logoImg)} alt='category' width={'80%'} />
                                </div>
                            )}

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.restaurantName} onChange={(e) => setRestaurantName(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Restaurant Name</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.ownerName} onChange={(e) => setOwnerName(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Owner Name</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.cuisines} onChange={(e) => setCuisines(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Cuisines</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.email} onChange={(e) => setEmail(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Email</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.mobile} onChange={(e) => setMobile(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Mobile</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.pan} onChange={(e) => setPan(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>PAN Number</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.gstin} onChange={(e) => setGstin(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>GST Number</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={outlet.ifsc} onChange={(e) => setIfsc(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>IFSC Code</label>
                            </div>

                            <div className="form-floating mt-3">
                                <input type="text" name="name" defaultValue={outlet.acno} onChange={(e) => setAcno(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Account Number</label>
                            </div>
                            {loading1 ? <Loading /> :
                                <button className='btn btn-dark mt-5' onClick={handleUpdate}>Update</button>
                            }
                        </form>
                    }
                </Card>
            </Container>
        </div>
    )
}