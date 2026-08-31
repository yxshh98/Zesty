import React, { useContext } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { SigninContext } from '../../context/signinContext';

export default function RestaurantDocumentsForm({ onNext, onBack }) {

    const handleBack = () => {
        onBack();
    }
    const { formData, setFormData } = useContext(SigninContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const panRegEx = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
        const gstRegEx = new RegExp("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$");
        const ifscRegEx = new RegExp("^[A-Z]{4}0[A-Z0-9]{6}$");

        if (!panRegEx.test(formData["pan"].trim().toUpperCase()) || !gstRegEx.test(formData["gstin"].trim().toUpperCase()) || !ifscRegEx.test(formData["ifsc"].trim().toUpperCase())) {
            if (!panRegEx.test(formData["pan"].trim().toUpperCase())) {
                console.log(formData["pan"]);

                toast.error("Invalid PAN number");
            } else if (!gstRegEx.test(formData["gstin"].trim().toUpperCase())) {
                toast.error("Invalid GSTIN");
            } else if (!ifscRegEx.test(formData["ifsc"].trim().toUpperCase())) {
                toast.error("Invalid IFSC Code");
            }
        } else {
            onNext();
        }
    }

    return (
        <div>
            <h4 style={{ width: "250px", color: "#000" }} className='form-h4'><strong>Restaurant Documents</strong></h4>
            <Form onSubmit={handleSubmit}>
                <Card className='form-card'>
                    <h5>Enter PAN & GSTIN Details</h5>

                    <div className="form-floating">
                        <input type="text" name="businesspan" value={formData["pan"]} onChange={(e) => setFormData({ ...formData, "pan": e.target.value.slice(0,10) })} placeholder="Business/Owner PAN" className='in form-control text-uppercase' required />
                        <label style={{ color: "#222" }}>Business/Owner PAN </label>
                    </div>

                    <div className="form-floating">
                        <input type="text" name="gstin" value={formData["gstin"]} onChange={(e) => setFormData({ ...formData, "gstin": e.target.value.slice(0,15) })} placeholder="GSTIN" className='in form-control text-uppercase' required />
                        <label style={{ color: "#222" }}>GSTIN</label>
                    </div>
                </Card>

                <Card className="form-card mt-4">
                    <h5>Official Bank Details</h5>
                    <p style={{ color: "#aaa" }}>Payments from Zesty will be credited here</p>

                    <div className="form-floating">
                        <input type="text" name="ifsc" value={formData["ifsc"]} onChange={(e) => setFormData({ ...formData, "ifsc": e.target.value.slice(0,11) })} placeholder="Bank IFSC code" className='in form-control text-uppercase' required />
                        <label style={{ color: "#222" }}>Bank IFSC code </label>
                    </div>

                    <div className="form-floating">
                        <input type="number" name="bankac" value={formData["acno"]} onChange={(e) => setFormData({ ...formData, "acno": e.target.value })} placeholder="Bank Account number" className='in form-control' required />
                        <label style={{ color: "#222" }}>Bank Account number</label>
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
