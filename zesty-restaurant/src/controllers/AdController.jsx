import React, { useEffect, useReducer, useState } from 'react'
import Header from '../components/Header'
import { Card, Container } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';
import "../assets/css/forms.css"

export default function CreateAds() {
    const restaurantId = localStorage.getItem("restaurantId");
    const [image, setImage] = useState("");
    const [restaurantName, setRestroName] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        const res = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
        setRestroName(res.data.restaurantName);
        setMobile(res.data.mobile);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        getData();
        const data = {
            name: restaurantName,
            mobileNumber: mobile,
            amount: 19900
        }

        try {
            const res = await axios.post("https://zesty-backend.onrender.com/payment/create-order", data);
            console.log(res.data);

            const adData = new FormData();
            adData.append("image", image);
            adData.append("restaurantId", restaurantId);
            const res1 = await axios.post("https://zesty-backend.onrender.com/ad/create-ad", adData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res1.status === 200) {
                console.log(res1.data);
            } else {
                toast.error("err in inserting.");
                setLoading(false);
            }
            window.location.href = res.data.url;
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("err in inserting.");
        }
    }
    return (
        <div>
            <Header />
            <Container>
                <Card className='text-center mt-5 mx-auto p-5 form-card'>
                    <h3><u>Create Advertisement</u></h3>

                    <form action="">
                        <div className="form-floating mt-5 mb-2">
                            <input type="file" name="image" accept='image/png, image/jpeg' onChange={(e) => setImage(e.target.files[0])} id="image" placeholder='Add your advertisement image' className='in form-control' style={{ width: "100%" }} required />
                            <label style={{ color: "#222" }}>Add your advertisement image</label>
                        </div>
                        <p className='text-muted text-start'>*Image should be rectangle</p>
                        <p className='text-muted text-start'>*Image should 1200x600 px or 1920x960 px (with high resolution)</p>
                        {image && (
                            <div className="text-center">
                                <img src={URL.createObjectURL(image)} alt='category' width={'80%'} />
                            </div>
                        )}
                        {loading ? <Loading /> :
                            <Link className='btn btn-dark mt-5' onClick={submitHandler}>Pay Now</Link>
                        }
                    </form>
                </Card>
            </Container>
        </div>
    )
}

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, ad: action.payload };
        case "FETCH_FAILED":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export function UpdateAd() {
    const [{ loading, error, ad }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
        ad: {}
    });

    const [loading1, setLoading] = useState(false);

    const restaurantId = localStorage.getItem("restaurantId");
    const [image, setImage] = useState("");
    const { adId } = useParams();

    const navigate = useNavigate();

    const fetchData = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
            const res = await axios.get(`https://zesty-backend.onrender.com/ad/get-ad/${restaurantId}`);
            dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        } catch (error) {
            dispatch({ type: 'FETCH_FAILED', payload: error.message })
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const adData = new FormData();
        adData.append("image", image);
        adData.append("id", adId);
        try {
            const res = await axios.post(`https://zesty-backend.onrender.com/ad/update-ad`, adData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true  // Ensure credentials are included
            });
            if (res.status === 200) {
                toast.dark("Updated.");
                navigate("/restaurant/ads");
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

    return (
        <div>
            <Header />
            <Container>
                <Card className='text-center mt-5 mx-auto p-5 form-card'>
                    <h3><u>Update Advertisement</u></h3>

                    {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> :
                        <form action="">
                            <div className="form-floating mt-5 mb-2">
                                <input type="file" name="image" accept='image/png, image/jpeg' onChange={(e) => setImage(e.target.files[0])} id="image" placeholder='Add your advertisement image' className='in form-control' style={{ width: "100%" }} required />
                                <label style={{ color: "#222" }}>Add your advertisement image</label>
                            </div>
                            <p className='text-muted text-start'>*Image should be rectangle</p>
                            <p className='text-muted text-start'>*Image should 1200x600 px or 1920x960 px (with high resolution)</p>
                            {image && (
                                <div className="text-center">
                                    <img src={URL.createObjectURL(image)} alt='category' width={'80%'} />
                                </div>
                            )}
                            <img src={ad.image} alt={ad} srcset="" width={"80%"} /> <br />
                            {loading ? <Loading /> :
                                <Link className='btn btn-dark mt-5' onClick={submitHandler}>Submit</Link>
                            }
                        </form>
                    }
                </Card>
            </Container>
        </div>
    )
}
