import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import { io } from 'socket.io-client';
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap"
import { useReducer } from 'react';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
// import {socket} from "socket.io-client";

const socket = io("https://zesty-backend.onrender.com");

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, allRestaurants: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state;
  }
}

export default function Notification() {
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

  const [{ loading, error, allRestaurants }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    allRestaurants: []
  });

  const [restaurant, setRestaurant] = useState({});

  // const [allRestaurants, setAllRestaurants] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    socket.emit("admin_join");
    socket.on("new_restaurant", (data) => {
      setRestaurant(data)
      console.log(data);
      handleShow(data);
    });

    return () => socket.off("new_restaurant");
  }, []);

  const handleApproval = async (id, status) => {
    try {
      const res = await axios.put(`https://zesty-backend.onrender.com/restaurant/update-verification/${id}`, { verified: status });
      if (res.status === 200) {
        toast.dark("successfully verified");
        setShow(false);
        window.location.reload(true);
      } else {
        toast.dark("error in verifying");
        setShow(false);
      }
      // setRestaurant(restaurant.map(r => (r._id === id ? { ...r, verified: status } : r)));
    } catch (error) {
      console.log("err in updating " + error);
    }
  }

  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });

    const res = await axios.get("https://zesty-backend.onrender.com/restaurant/get-all-restaurants");
    // setAllRestaurants(res.data);
    dispatch({ type: 'FETCH_SUCCESS', payload: res.data });

  }

  const handleShow = async (restaurantData) => {
    setData(restaurantData);
    setShow(true);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className='app'>
      <Sidebar id={8} />
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Header />

        <div style={{ padding: "20px" }}>
          <table className='table'>
            <thead>
              <tr>
                <th>Id</th>
                <th>Restaurant Name</th>
                <th>Details</th>
                <th>Verification Status</th>
              </tr>
            </thead>

            {/* {restaurant != {} && (
              <tbody></tbody>
            )} */}

            {
              loading ? <Loading /> :
                allRestaurants.slice(0).reverse().map((res, i) => (
                  <tbody>
                    {res.verified === "Pending" && (
                      <tr>
                        <td>{i+1}</td>
                        <td>{res.restaurantName}</td>
                        <td><button onClick={() => handleShow(res)} className='btn btn-outline-dark' style={{ width: "100px" }}>Details</button></td>
                        <td>{(res.verified) === "Pending" && (<span className='p-1' style={{ borderRadius: "5px", color: "white", backgroundColor: "#ffd557" }}>Pending</span>)}</td>
                      </tr>
                    )}
                  </tbody>
                ))
            }
          </table>

          {data != null && (

            <Modal show={show} onHide={() => setShow(false)} >
              <Modal.Header>
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
                      <td>{data.payment}</td>
                    </tr>
                  </tbody>
                </table>
              </Modal.Body>
              <Modal.Footer>
                <button className='btn btn-success' onClick={() => handleApproval(data._id, "Approved")}>Approve</button>
                <button className='btn btn-danger' onClick={() => handleApproval(data._id, "Rejected")}>Reject</button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div>
    </div>
  )
}
