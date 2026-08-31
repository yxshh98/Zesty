import React, { useEffect, useReducer, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Col, Row } from 'react-bootstrap'
import TotalOrdersCard from '../components/TotalOrdersCard'
import axios from "axios"
import Content from '../components/Content'
import { useNavigate } from 'react-router-dom'

const reducerRestaurant = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loadingRestaurant: true };
        case 'FETCH_SUCCESS':
            return { ...state, loadingRestaurant: false, restaurant: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loadingRestaurant: false, error: action.payload };
        default:
            return state;
    }
};

export default function Dashboard() {
    const [{ loadingRestaurant, errorRestaurant, restaurant }, dispatchRestaurant] = useReducer(reducerRestaurant, {
        loading: true,
        error: '',
        restaurant: {},
    });

    const restaurantId = localStorage.getItem("restaurantId");
    const navigate = useNavigate();

    const fetchRestaurant = async () => {
        dispatchRestaurant({ type: 'FETCH_REQUEST' });
        try {
            const restaurant = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
            dispatchRestaurant({ type: 'FETCH_SUCCESS', payload: restaurant.data });
        } catch (error) {
            navigate("/signinProcess");
            dispatchRestaurant({ type: 'FETCH_FAIL', payload: error.message });
        }
    };

    useEffect(() => {
        fetchRestaurant();
    }, [restaurantId]);

    return (
        <div className='app'>
            <Sidebar id={1} />
            <Content />
        </div>
    )
}
