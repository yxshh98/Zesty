import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import "../assets/css/totalOrdersCard.css";

export default function TotalOrdersCard({ type, total, image }) {

    return (
        <Card style={{ height: "100px" }} className='card-home'>
            <Row style={{marginTop: "7px"}}>
                <Col md={3}>
                    <Card style={{ width: "45px", height: "50px", backgroundColor: "#d7f5ee", justifyContent: "center", alignItems: "center", border: "none" }}>
                        <img src={image} style={{width: "30px"}} alt="" />
                    </Card>
                </Col>
                <Col style={{marginLeft: "10px"}}>
                    <h5 style={{margin: 1}}>{total}</h5>
                    {/* <hr /> */}
                    <p>Total {type}</p>
                </Col>
            </Row>
        </Card>
    )
}
