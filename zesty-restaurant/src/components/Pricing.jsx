import React from 'react'
import { Link } from "react-router-dom";
import { Card, Col, Container, Row } from 'react-bootstrap'

export default function Pricing() {
    return (
        <div>
            <Container className='py-5'>
                <Row>
                    <Col md={8} className='py-2 bg-white' style={{ boxShadow: "rgba(100, 100, 111, 0.2) -10px 10px 29px 0px" }}>
                        <Card className='overflow-hidden' style={{ border: "none" }}>
                            <Card.Body>
                                <div className="m-4">
                                    <h3><strong>One Month Membership</strong></h3>
                                    <p className='text-muted'>
                                        Get <strong>30 days of premium visibility</strong> and attract more customers to your restaurant! With our exclusive one-month ad plan, your restaurant will be featured in a prime carousel spot on Zesty, ensuring maximum exposure.
                                    </p>
                                    <Row>
                                        <Col md={2}>
                                            <b
                                                className="text-uppercase mb-3 new-section"
                                                style={{ fontSize: "14px", color: "#024b3b" }}
                                            >
                                                what’s include
                                            </b>
                                        </Col>
                                        <Col>
                                            <hr />
                                        </Col>
                                    </Row>

                                    <li className='mb-3 mt-2 w-100' style={{ listStyle: "none" }}>
                                        <i className='fa-solid fa-check text-success me-2'></i>
                                        <small>Get featured on the app’s homepage and category sections.</small>
                                    </li>
                                    <li className='mb-3 mt-2 w-100' style={{ listStyle: "none" }}>
                                        <i className='fa-solid fa-check text-success me-2'></i>
                                        <small>Stand out from competitors with premium placement.</small>
                                    </li>
                                    <li className='mb-3 mt-2 w-100' style={{ listStyle: "none" }}>
                                        <i className='fa-solid fa-check text-success me-2'></i>
                                        <small>Ads help drive traffic to your restaurant profile and menu.</small>
                                    </li>
                                    <li className='mb-3 mt-2 w-100' style={{ listStyle: "none" }}>
                                        <i className='fa-solid fa-check text-success me-2'></i>
                                        <small>Simple and quick ad submission process with instant previews.</small>
                                    </li>
                                    <li className='mb-3 mt-2 w-100' style={{ listStyle: "none" }}>
                                        <i className='fa-solid fa-check text-success me-2'></i>
                                        <small>Gain recognition and repeat customers over time.</small>
                                    </li>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className='text-center justify-content-center align-items-center d-flex' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", backgroundColor: "#f9fafb" }}>
                        <div>
                            <h5>Boost Your Restaurant’s Sales – Get Featured for a Whole Month!</h5>
                            <h2 className='fw-bold text-black mt-4'>₹ 199</h2>
                            <Link to={"/restaurant/create-ads"} className="btn btn-dark w-100 p-2 mt-4">Get Access</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
