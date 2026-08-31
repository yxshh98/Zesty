import React, { useContext, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { SigninContext } from '../../context/signinContext';

export default function MenuSetup({ onNext, onBack }) {

    const handleBack = () => {
        onBack();
    }

    const { formData, setFormData } = useContext(SigninContext);

    const [menu1, setMenu] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData["veg"] === "") {
            toast.error("Please select food type");
        }
        setFormData({ ...formData, "menuImg": menu1, "payment": "Pending", "verified": "Pending" });
        onNext();
    }

    const handleFileChange = (e) => {
        const filesArray = Array.from(e.target.files); // Convert FileList to Array
        setMenu([...menu1, ...filesArray]); // Append new images properly
    };

    return (
        <div>
            <h4 style={{ width: "250px", color: "#000" }} className='form-h4'><strong>Menu Setup</strong></h4>

            <Form onSubmit={handleSubmit}>
                <Card className='form-card'>
                    <h5>What kind of food is on your menu ?</h5>
                    <div className="form-check mt-3">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" value="veg" onChange={(e) => setFormData({ ...formData, "veg": e.target.value })} id="flexRadioDefault1" />
                        <label className="form-check-label ms-2" for="flexRadioDefault1">
                            Veg Only
                        </label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" value="both" onChange={(e) => setFormData({ ...formData, "veg": e.target.value })} id="flexRadioDefault2" />
                        <label className="form-check-label ms-2" for="flexRadioDefault2">
                            Both Veg & Non-Veg
                        </label>
                    </div>

                    <hr />
                    <h6>Add Cuisines that you serve</h6>
                </Card>

                <Card className='form-card mt-4'>
                    <h5>Upload your menu</h5>
                    <ul style={{ color: "#aaa" }}>
                        <li>Upload clear menu card photos or as a word/excel file. Item names prices should be readable.</li>
                        <li>Menu should be in English Only.</li>
                        <li>Every item should have price mentioned against it.</li>
                        <li>Max file size 25 MB (.jpg, .png, .docx, .xlsx, .pdf)</li>
                    </ul>

                    <input type="file" name="menuImg" onChange={handleFileChange} id="" multiple required />
                    <p style={{ color: "#aaa" }}>*You can select multiple files</p>
                    <div className="d-flex" style={{ width: "450px" }}>
                        {menu1.map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt='menu'
                                width='150px'
                                height='200px'
                                className='p-1'
                            />
                        ))}
                    </div>
                </Card>

                <Card className='form-card mt-4'>
                    <h5>Packaging Charges</h5>
                    <p style={{ color: "#aaa" }}>Not Applicable on Indian Breads, MRP Items, Packaged Beverages.</p>

                    <div>
                        <table className='table table-striped mt-3'>
                            <thead>
                                <tr>
                                    <th>Item Price</th>
                                    <th>Packaging Charge</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>0 - 50</td>
                                    <td>5</td>
                                </tr>
                                <tr>
                                    <td>51 - 150</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>151 - 300</td>
                                    <td>10</td>
                                </tr>
                                <tr>
                                    <td>301 - 500</td>
                                    <td>15</td>
                                </tr>
                                <tr>
                                    <td>501 and above</td>
                                    <td>20</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Row>
                    <Col>
                        <button type='submit' onClick={handleBack} className='btn-continue'>Back</button>
                    </Col>
                    <Col>
                        <button type='submit' className='btn-continue'>Continue</button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
