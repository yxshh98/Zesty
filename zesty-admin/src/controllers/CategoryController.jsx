import React, { useEffect, useReducer, useState } from 'react'
import Header from '../components/Header'
import { Card, Container } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import MessageBox from '../components/MessageBox'

export function CreateCategory() {
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
    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        setLoading(true);
        const categoryData = new FormData();
        categoryData.append("name", name);
        categoryData.append("image", image);
        try {
            const res = await axios.post("https://zesty-backend.onrender.com/category/add-category", categoryData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: 'include' });
            if (res.status === 200) {
                toast.dark("Category Added");
                navigate("/admin/categories");
            } else if (res.status === 401) {
                setLoading(false);
                toast.dark("Category already exist");
            } else if (res.status === 405) {
                setLoading(false);
                toast.dark("category saving failed");
            } else {
                setLoading(false);
                toast.dark("internal server error");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.dark("failed to add.")
        }
    }

    return (
        <div style={{ width: "100%", padding: "0", margin: "0" }}>
            <Header />

            <Container>
                <Card className='text-center mt-5 w-50 mx-auto p-5'>
                    <h3><u>Add Category</u></h3>

                    <form>
                        <div className="form-floating mt-5 mb-2">
                            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} required />
                            <label style={{ color: "#222" }}>Category Name</label>
                        </div>

                        <div className="form-floating mt-3 mb-2">
                            <input type="file" accept='image/png, image/jpeg' name="image" onChange={(e) => setImage(e.target.files[0])} id="image" placeholder='Category name' className='in form-control' style={{ width: "100%" }} required />
                            <label style={{ color: "#222" }}>Category Image</label>
                        </div>
                        {image && (
                            <div className="text-center">
                                <img src={URL.createObjectURL(image)} alt='category' height={'200px'} />
                            </div>
                        )}
                        {loading ? <Loading /> :
                            <Link className='btn btn-dark mt-5' onClick={submitHandler}>Add Category</Link>
                        }
                    </form>
                </Card>
            </Container>
        </div>
    )
}

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, category: action.payload };
        case "FETCH_FAILED":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export default function UpdateCategory() {
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
    const [{ loading, error, category }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
        category: {}
    });

    const [loading1, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const { id } = useParams();

    const submitHandler = async () => {
        setLoading(true);
        const categoryData = new FormData();
        categoryData.append("id", id);
        categoryData.append("name", name);
        categoryData.append("image", image);
        try {
            const res = await axios.post(
                "https://zesty-backend.onrender.com/category/update-category",
                categoryData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true  // Ensure credentials are included
                }
            );
            if (res.status === 200) {
                toast.dark("Category Updated");
                navigate("/admin/categories");
            } else if (res.status === 401) {
                toast.dark("category update failed");
                setLoading(false);
            } else {
                setLoading(false);
                toast.dark("internal server error");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.dark("failed to add.")
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            try {
                const res = await axios.get(`https://zesty-backend.onrender.com/category/get/${id}`);
                dispatch({ type: "FETCH_SUCCESS", payload: res.data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAILED', payload: error.message })
            }
        }
        fetchData();
    }, [id])
    return (
        <div style={{ width: "100%", padding: "0", margin: "0" }}>
            <Header />

            <Container>
                <Card className='text-center mt-5 w-50 mx-auto p-5'>
                    <h3><u>Update Category</u></h3>

                    {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> :
                        <form>
                            <div className="form-floating mt-5 mb-2">
                                <input type="text" name="name" defaultValue={category.name} onChange={(e) => setName(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} required />
                                <label style={{ color: "#222" }}>Category Name</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="file" accept='image/png, image/jpeg' name="image" onChange={(e) => setImage(e.target.files[0])} id="image" placeholder='Category name' className='in form-control' style={{ width: "100%" }} required />
                                <label style={{ color: "#222" }}>Category Image</label>
                            </div>
                            <img src={category.image} height={"200px"} alt={category.name} /> <br />
                            {image && (
                                <div className="text-center">
                                    <img src={URL.createObjectURL(image)} alt='category' height={'200px'} />
                                </div>
                            )}
                            {loading1 ? <Loading /> :
                                <Link className='btn btn-dark mt-5' onClick={submitHandler}>Update Category</Link>
                            }
                        </form>
                    }
                </Card>
            </Container>
        </div>
    )
}
