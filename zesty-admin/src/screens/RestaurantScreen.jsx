import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useReducer } from 'react'
import { Row, Col, Modal } from "react-bootstrap"
import axios from "axios"
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useState } from 'react'
import Loading from '../components/Loading'
import MessageBox from '../components/MessageBox'
import { useNavigate } from 'react-router-dom'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, restaurants: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state;
  }
}

export default function RestaurantScreen() {
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
  const [{ loading, error, restaurants }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    restaurants: []
  });

  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const restaurant = await axios.get('https://zesty-backend.onrender.com/restaurant/get-all-restaurants');
        dispatch({ type: 'FETCH_SUCCESS', payload: restaurant.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message })
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch('https://zesty-backend.onrender.com/restaurant/delete-restaurant', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id })
    })

    if (res.status === 200) {
      toast.dark("Restaurant deleted successfully.");
      window.location.reload(true);
    } else if (res.status === 401) {
      toast.dark("Restaurant delete failed.");
    }
  }

  const handleShow = (details) => {
    setData(details);
    setShowDetails(true);
  }

  return (
    <div className='app'>
      <Sidebar id={5} />
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Header />

        <div style={{ padding: "20px" }}>
          <Row>
            <Col md={8}>
              <h2 style={{ margin: "15px 0 5px 20px" }}>Restaurants</h2>
            </Col>
            <Col>
              <input type="text" value={search} placeholder='Search..' className='in form-control mt-4' onChange={(e) => setSearch(e.target.value)} />
            </Col>
          </Row>

          <table className='table mt-5'>
            <thead>
              <tr>
                <th>Restaurant Id</th>
                <th>Restaurant Name</th>
                <th>Details</th>
                <th>Remove</th>
              </tr>
            </thead>

            {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> : (
              <tbody>
                {restaurants.slice(0).reverse()
                  .filter((item) => {
                    const searchTerm = search.toLowerCase();
                    const name = item.restaurantName.toLowerCase();
                    return searchTerm && name.includes(searchTerm);
                  })
                  .map((restaurant, i) => (
                    <tr key={i} style={{ verticalAlign: "middle" }}>
                      <td>{i+1}</td>
                      <td><h4>{restaurant.restaurantName}</h4></td>
                      <td><button onClick={() => handleShow(restaurant)} style={{ textDecoration: "underline", background: "none", padding: 0, width: "100px" }}>Details</button></td>
                      <td><button className='btn btn-danger' onClick={() => handleDelete(restaurant._id)}>Remove</button></td>
                    </tr>
                  ))}
                {search === "" && restaurants.slice(0).reverse().map((restaurant, i) => (
                  <tr key={i} style={{ verticalAlign: "middle" }}>
                    <td>{i+1}</td>
                    <td><h4>{restaurant.restaurantName}</h4></td>
                    <td><button onClick={() => handleShow(restaurant)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                    <td><button className='btn btn-danger' onClick={() => handleDelete(restaurant._id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            )}

            {data != null && (

              <Modal show={showDetails} onHide={() => setShowDetails(false)} >
                <Modal.Header closeButton>
                  <Modal.Title>{data.restaurantName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Restaurant Logo : <br /><img className='ms-5' src={data.logoImg} alt={data.restaurantName} width={250} /><br />
                  <table className='table'>
                    <tbody>
                      <tr>
                        <td>Owner Name</td>
                        <td>{data.ownerName}</td>
                      </tr>
                      <tr>
                        <td>Address</td>
                        <td>{data.shopNumber}{', '}{data.floor}{', '}{data.buildingName}{', '}{data.selectedArea}{', '}{data.city}{', '}{data.state}{', '}{data.pincode}{'.'}</td>
                      </tr>
                      <tr>
                        <td>Latitude</td>
                        <td>{data.latitude}</td>
                      </tr>
                      <tr>
                        <td>Longitude</td>
                        <td>{data.longitude}</td>
                      </tr>
                      <tr>
                        <td>Email Address</td>
                        <td>{data.email}</td>
                      </tr>
                      <tr>
                        <td>Mobile Number</td>
                        <td>{data.mobile}</td>
                      </tr>
                      <tr>
                        <td>PAN Number</td>
                        <td>{data.pan}</td>
                      </tr>
                      <tr>
                        <td>GST Number</td>
                        <td>{data.gstin}</td>
                      </tr>
                      <tr>
                        <td>
                          <h5 className='mt-2'>Bank Details</h5>
                        </td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td>{data.acno}</td>
                      </tr>
                      <tr>
                        <td>IFSC Code</td>
                        <td>{data.ifsc}</td>
                      </tr>
                      <tr>
                        <td>Food Type</td>
                        <td>{data.veg}</td>
                      </tr>
                      <tr>
                        <td>Payment Status</td>
                        <td>{data.payment === "Pending" ?
                          <span className='text-warning bg-warning bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>Pending</span>
                          : data.payment === "Failed" ? <span className='text-danger bg-danger bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>Failed</span>
                            : data.payment === "Success" && <span className='text-success bg-success bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>Success</span>
                        }</td>
                      </tr>
                      <tr>
                        <td>Verification Status</td>
                        <td>{data.verified === "Pending" ?
                          <span className='text-warning bg-warning bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>Pending</span>
                          : data.verified === "Rejected" ? <span className='text-danger bg-danger bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>Rejected</span>
                            : data.verified === "Approved" && <span className='text-success bg-success bg-opacity-25' style={{ padding: "5px", borderRadius: "5px" }}>Approved</span>
                        }</td>
                      </tr>
                    </tbody>
                  </table>
                </Modal.Body>
              </Modal>
            )}
          </table>
        </div>
      </div>
    </div>)
}
