import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { SigninContext } from '../../context/signinContext';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

export default function PartnerContract({ onBack }) {

    const handleBack = () => {
        onBack();
    }
    const { formData } = useContext(SigninContext);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            name: formData["restaurantName"],
            mobileNumber: formData["mobile"],
            amount: 99900
        }

        try {
            const res = await axios.post("https://zesty-backend.onrender.com/payment/create-order", data);
            console.log(res.data);


            const restaurantData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "menuImg") {
                    formData["menuImg"].forEach((img) => {
                        restaurantData.append("menuImg", img);
                    });
                } else {
                    restaurantData.append(key, value);
                }
            });

            const res1 = await axios.post("https://zesty-backend.onrender.com/restaurant/register", restaurantData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res1.status === 201) {
                localStorage.setItem("restaurantId", res1.data.restaurant._id);
                console.log(res1.data);
            } else {
                toast.error("err in inserting.");
            }
            window.location.href = res.data.url;
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <h4 style={{ width: "250px", color: "#000" }} className='form-h4'><strong>Partner Contract   </strong></h4>

            <Card className='form-card'>
                <h5>Overview</h5>
                <table className='table mt-3'>
                    <tbody>
                        <tr>
                            <td>Zesty Commision</td>
                            <td>30%</td>
                        </tr>

                        <tr>
                            <td>Onboarding fee</td>
                            <td>₹ 999</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <Form>

                <Card className='form-card mt-4'>
                    <div className="form-check mt-2">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" required />
                        <label className="form-check-label ms-2" for="flexCheckDefault">
                            I have read & accept all the <strong style={{ borderBottom: "1px solid black" }}>terms and conditions</strong>
                        </label>
                    </div>
                </Card>

                <Row>
                    <Col>
                        <button type='submit' onClick={handleBack} className='btn-continue'>Back</button>
                    </Col>
                    <Col>
                        {loading ? <Loading /> :
                            <button type='submit' className='btn-continue' onClick={handleSubmit}>Pay Now</button>
                        }
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
