import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { toast } from 'react-toastify';
import { SigninContext } from '../../context/signinContext';
import { useNavigate } from 'react-router-dom';

export default function RestaurantInformationForm({ onNext }) {
    const restaurantId = localStorage.getItem("restaurantId");
    // console.log(restaurantId);
    const navigate = useNavigate();

    const checkPaymentStatus = async () => {
        const res = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);

        if (res.status === 200) {
            console.log(res.data);
            if (res.data.payment === "Success") {
                navigate("/payment-success");
            } else if (res.data.payment === "Pending") {
                navigate("/payment-failure");
            }
        }
    };

    useEffect(() => {
        if (restaurantId != null)
            checkPaymentStatus();
    }, [restaurantId]);

    const { formData, setFormData } = useContext(SigninContext);

    const [pincode, setPincode] = useState("");
    const [area, setArea] = useState([]);
    const [workingDays, setWorkingDays] = useState([]);
    const [logoImg, setLogoImg] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const handleCheckChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            setWorkingDays([...workingDays, value]);
        } else {
            setWorkingDays(workingDays.filter((e) => (e !== value)))
        }
        setFormData({ ...formData, "workingDays": workingDays })
    }

    const fetchAddress = async (e) => {
        const enteredPincode = e.target.value.slice(0, 6); // Directly extract the first 6 digits
        setPincode(enteredPincode);
        setFormData({ ...formData, "pincode": enteredPincode });

        if (enteredPincode.length === 6) { // Use the updated value directly
            try {
                const res = await axios.get(`https://api.postalpincode.in/pincode/${enteredPincode}`);
                if (res.data[0].Status === "Success") {
                    const data = res.data[0].PostOffice[0];
                    setFormData((prev) => ({ ...prev, "city": data.District, "state": data.State }));

                    const areas = res.data[0].PostOffice.map((post) => post.Name);
                    setArea(areas); // Assuming you have a state for 'area'
                } else {
                    toast.error("Invalid Pincode");
                }
            } catch (error) {
                toast.error("Invalid Pincode");
            }
        }
    };


    const handleLogo = (e) => {
        setFormData({ ...formData, "logoImg": e.target.files[0] });
        setLogoImg(e.target.files[0]);
    }

    const getLocation = () => {
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,  // Try to use GPS if available
      timeout: 10000,           // 10 seconds timeout
      maximumAge: 0             // Don't use cached position
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setFormData({ 
          ...formData, 
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude 
        });
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        // Handle different error cases
        switch(err.code) {
          case err.PERMISSION_DENIED:
            alert("Location access was denied. Please enable permissions.");
            break;
          case err.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            alert("The request to get location timed out.");
            break;
          default:
            alert("An unknown error occurred.");
        }
      },
      options
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

    const handleSubmit = (e) => {
        e.preventDefault();

        if (latitude === "" && longitude === "") {
            getLocation();
        } else {
            onNext();
        }
    }

    return (
        <div>
            <Form>
                <h4 style={{ width: "250px", color: "#000" }} className='form-h4'><strong>Restaurant Information</strong></h4>
                <Card className='form-card'>
                    <h5>Basic Details</h5>

                    <div className="form-floating">
                        <input type="text" name="ownername" value={formData["ownerName"]} onChange={(e) => setFormData({ ...formData, "ownerName": e.target.value })} placeholder="Owner's Full Name" className='in form-control' required />
                        <label style={{ color: "#222" }}>Owner's Full Name</label>
                    </div>

                    <div className="form-floating">
                        <input type="text" name="restaurantName" value={formData["restaurantName"]} onChange={(e) => setFormData({ ...formData, "restaurantName": e.target.value })} placeholder="Restaurant Name" className='in form-control' required />
                        <label style={{ color: "#222" }}>Restaurant Name</label>
                    </div>

                    <div className="form-floating">
                        <input type="text" name="cuisines" value={formData["cuisines"]} onChange={(e) => setFormData({ ...formData, "cuisines": e.target.value })} placeholder="Restaurant Name" className='in form-control' required />
                        <label style={{ color: "#222" }}>Cuisines Your restaurant will serve</label>
                    </div>

                    <input type='file' name='logoImg' className='in form-control' placeholder='Name' onChange={handleLogo} /><br />
                    {logoImg && (
                        <div className="text-center">
                            <img src={URL.createObjectURL(logoImg)} alt='carousel' height={'200px'} />
                        </div>
                    )}

                    <h5 className='mt-3'>Address Details</h5>
                    <div className="form-floating">
                        <input type="number" name="pincode" value={pincode} onChange={fetchAddress} placeholder="Pin Code" className='in form-control' required />
                        <label style={{ color: "#222" }}>Pin Code</label>
                    </div>

                    <Row>
                        <Col>
                            <div className="form-floating">
                                <input type="text" name="shopnumber" value={formData["shopNumber"]} onChange={(e) => setFormData({ ...formData, "shopNumber": e.target.value })} placeholder="Shop/Plot Number" className='in form-control' required />
                                <label style={{ color: "#222" }}>Shop/Plot Number</label>
                            </div>
                        </Col>
                        <Col>
                            <div className="form-floating">
                                <input type="text" name="floor" value={formData["floor"]} onChange={(e) => setFormData({ ...formData, "floor": e.target.value })} placeholder="Floor" className='in form-control' />
                                <label style={{ color: "#222" }}>Floor</label>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="form-floating">
                                <input type="text" name="buildingName" value={formData["buildingName"]} onChange={(e) => setFormData({ ...formData, "buildingName": e.target.value })} placeholder="Building/Mall/Complex Name" className='in form-control' />
                                <label style={{ color: "#222" }}>Building Name</label>
                            </div>
                        </Col>
                        <Col>
                            <select className='in form-select' onChange={(e) => setFormData({ ...formData, "selectedArea": e.target.value })} style={{ height: "55px", marginTop: "10px" }}>
                                <option value="" selected disabled>-- Select Area --</option>
                                {
                                    area.map((a) => (
                                        <option value={a}>{a}</option>
                                    ))
                                }
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="form-floating">
                                <input type="text" name="city" value={formData["city"]} onChange={(e) => setFormData({ ...formData, "city": e.target.value })} placeholder="City" className='in form-control' disabled />
                                <label style={{ color: "#222" }}>City</label>
                            </div>
                        </Col>
                        <Col>
                            <div className="form-floating">
                                <input type="text" name="state" value={formData["state"]} onChange={(e) => setFormData({ ...formData, "state": e.target.value })} placeholder="State" className='in form-control' disabled />
                                <label style={{ color: "#222" }}>State</label>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <Card className='form-card mt-4'>
                    <h5>Owner Contact Details</h5>

                    <div className="form-floating">
                        <input type="email" name="email" value={formData["email"]} onChange={(e) => setFormData({ ...formData, "email": e.target.value })} placeholder="Email Address" className='in form-control' required />
                        <label style={{ color: "#222" }}>Email Address</label>
                    </div>

                    <div className="form-floating">
                        <input type="number" name="phone" maxLength={10} value={formData["mobile"]} onChange={(e) => setFormData({ ...formData, "mobile": e.target.value })} placeholder="Mobile Number" className='in form-control' required />
                        <label style={{ color: "#222" }}>Mobile Number</label>
                    </div>
                </Card>

                <Card className='form-card mt-4'>
                    <h5>Working Days</h5>
                    <Row>
                        <Col>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" onChange={handleCheckChange} value="Monday" id="flexCheckDefault" />
                                <label className="form-check-label ms-2" for="flexCheckDefault">
                                    Monday
                                </label>
                            </div>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" onChange={handleCheckChange} value="Tuesday" id="flexCheckDefault1" />
                                <label className="form-check-label ms-2" for="flexCheckDefault1">
                                    Tuesday
                                </label>
                            </div>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" onChange={handleCheckChange} value="Wednesday" id="flexCheckDefault2" />
                                <label className="form-check-label ms-2" for="flexCheckDefault2">
                                    Wednesday
                                </label>
                            </div>
                            <div className="form-check  mt-2">
                                <input className="form-check-input" type="checkbox" onChange={handleCheckChange} value="Thursday" id="flexCheckDefault3" />
                                <label className="form-check-label ms-2" for="flexCheckDefault3">
                                    Thursday
                                </label>
                            </div>
                        </Col>
                        <Col>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" onChange={handleCheckChange} value="Friday" id="flexCheckDefault4" />
                                <label className="form-check-label ms-2" for="flexCheckDefault4">
                                    Friday
                                </label>
                            </div>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" onChange={handleCheckChange} value="Saturday" id="flexCheckDefault5" />
                                <label className="form-check-label ms-2" for="flexCheckDefault5">
                                    Saturday
                                </label>
                            </div>
                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" onChange={handleCheckChange} value="Sunday" id="flexCheckDefault6" />
                                <label className="form-check-label ms-2" for="flexCheckDefault6">
                                    Sunday
                                </label>
                            </div>
                        </Col>
                    </Row>
                </Card>


                <button onClick={handleSubmit} className='btn-continue'>Continue</button>
            </Form>
        </div >
    )
}
