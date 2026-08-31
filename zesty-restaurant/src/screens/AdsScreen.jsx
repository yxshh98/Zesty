import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Pricing from '../components/Pricing'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';

export default function AdsScreen() {
    const restaurantId = localStorage.getItem("restaurantId");
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const checkExist = async () => {
        try {
            const res = await axios.get(`https://zesty-backend.onrender.com/ad/get-ad/${restaurantId}`);
            setAd(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkExist();
    }, []);
    return (
        <div className='app'>
            <Sidebar id={5} />
            <div style={{ width: "100%", padding: "0", margin: "0" }}>
                <Header />

                <div style={{ padding: "15px" }}>
                    <h1>Ads</h1>
                    {
                        loading ? <Loading /> :
                            ad === null ? (
                                <Pricing />
                            ) : (
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Advertisement Banner</th>
                                            <th>Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {/* <td><img src={`https://zesty-backend.onrender.com/ad/get-ad-image/${restaurantId}`} alt="" width={"600px"} /></td> */}
                                            <td><img src={ad.image} alt={ad} srcset="" className='img-ad' /></td>
                                            <td><Link to={`/restaurant/update-ad/${ad._id}`} className="btn btn-primary">Edit</Link></td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                </div>
            </div>
        </div>
    )
}
