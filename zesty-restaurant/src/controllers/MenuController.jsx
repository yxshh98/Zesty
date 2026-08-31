import React, { useEffect, useReducer, useState } from 'react'
import Header from '../components/Header'
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';
import "../assets/css/forms.css"

export default function AddMenuItem() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [foodType, setFoodType] = useState("Veg");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("0");
    const [packagingCharge, setPackagingCharge] = useState("0");
    const navigate = useNavigate();
    const restaurantId = localStorage.getItem("restaurantId");

    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        setLoading(true);
        if (name === "" || description === "" || foodType === "" || category === "" || price === "" || packagingCharge === "") {
            setLoading(false);
            toast.dark("Field are mandatory to fill");
            return;
        }
        if (price < 0 || packagingCharge < 0) {
            setLoading(false);
            toast.dark("price & packaging carce should positive integers");
            return;
        }
        const finalPrice = ((parseInt(price) + parseInt(packagingCharge)) + (parseInt(price) + parseInt(packagingCharge)) * 0.3).toString();
        const menuItemData = new FormData();
        menuItemData.append("name", name);
        menuItemData.append("description", description);
        menuItemData.append("image", image);
        menuItemData.append("foodType", foodType);
        menuItemData.append("category", category);
        menuItemData.append("price", finalPrice);
        menuItemData.append("packagingCharge", packagingCharge);
        menuItemData.append("restaurantId", restaurantId);
        try {
            const res = await axios.post("https://zesty-backend.onrender.com/menu/add-item", menuItemData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
            if (res.status === 200) {
                toast.dark("Menu Added");
                navigate("/restaurant/menu");
            } else if (res.status === 405) {
                toast.dark("menu saving failed");
            } else {
                toast.dark("internal server error");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.dark("failed to add.")
        }
    }

    const handleFoodType = (option) => {
        setFoodType(option);
    };

    const fetchCategories = async () => {
        try {
            const category = await axios.get('https://zesty-backend.onrender.com/category/get-all-category');
            setCategories(category.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div style={{ width: "100%", padding: "0", margin: "0" }}>
            <Header />

            <Container>
                <Card className='text-center mt-5 mx-auto p-5 form-card'>
                    <h3><u>Add Menu Item</u></h3>

                    <form>
                        <div className="form-floating mt-5 mb-2">
                            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} required={true} />
                            <label style={{ color: "#222" }}>Item Name</label>
                        </div>

                        <div className="form-floating mt-3 mb-2">
                            <input type="text" name="name" value={description} onChange={(e) => setDescription(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} required />
                            <label style={{ color: "#222" }}>Item Description</label>
                        </div>

                        <select name="" id="" className='in form-select' onChange={(e) => setCategory(e.target.value)}>
                            <option value="" disabled selected>Select category</option>
                            {categories.map((category) => (
                                <option value={category.name}>{category.name}</option>
                            ))}
                        </select>

                        <label htmlFor="" className='mt-4 float-start'>Food Type: </label> {window.innerWidth < 600 ? <br /> : ""}
                        <Row className='mt-4'>
                            <Col xs={12} md={6}>
                                <a
                                    onClick={() => handleFoodType('Veg')}
                                    style={{
                                        border: foodType === 'Veg' ? '4px solid #000' : '1px solid #000',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        margin: '5px',
                                    }}
                                >
                                    <img src="/images/vegSymbol.png" width={"30px"} alt="siuh" />{' '}
                                    Veg
                                </a>
                            </Col>

                            <Col className={window.innerWidth < 600 ? 'mt-4' : ""} xs={12} md={6}>
                                <a
                                    onClick={() => handleFoodType('Non-Veg')}
                                    style={{
                                        border: foodType === 'Non-Veg' ? '4px solid #000' : '1px solid #000',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        margin: '5px',
                                    }}
                                >
                                    <img src="/images/nonVegSymbol.png" width={"30px"} alt="siuh" /> {' '}
                                    Non-Veg
                                </a>
                            </Col>
                        </Row>

                        <div className="form-floating mt-5 mb-2">
                            <input type="file" accept='image/png, image/jpeg' name="image" onChange={(e) => setImage(e.target.files[0])} id="image" placeholder='Menu Item Image' className='in form-control' style={{ width: "100%" }} required />
                            <label style={{ color: "#222" }}>Menu Item Image</label>
                        </div>
                        {image && (
                            <div className="text-center">
                                <img src={URL.createObjectURL(image)} alt='category' width={'80%'} />
                            </div>
                        )}

                        <div className="form-floating mt-3 mb-2">
                            <input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} id="name" placeholder='Item' className='in form-control' style={{ width: "100%" }} required />
                            <label style={{ color: "#222" }}>Item Price</label>
                        </div>

                        <div className="form-floating mt-3 mb-2">
                            <input type="number" name="charges" value={packagingCharge} onChange={(e) => setPackagingCharge(e.target.value)} id="name" placeholder='Packaging Charges' className='in form-control' style={{ width: "100%" }} />
                            <label style={{ color: "#222" }}>Packaging Charges</label>
                        </div>

                        {/* price accordion */}
                        <Accordion>
                            <Accordion.Item eventKey='0'>
                                <Accordion.Header>
                                    <h5 style={{ width: "100%" }}>Final Price </h5>
                                    <h5 className='me-5' style={{ width: "100%", textAlign: "right" }}>{(parseInt(price) + parseInt(packagingCharge)) + (parseInt(price) + parseInt(packagingCharge)) * 0.3}</h5><br />
                                </Accordion.Header>
                                <Accordion.Body>
                                    <table className='table'>
                                        <tbody>
                                            <tr>
                                                <td className='text-start'>Item Total</td>
                                                <td>{parseInt(price)}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-start'>Packaging Charge</td>
                                                <td>{parseInt(packagingCharge)}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-start'>Zesty Commision (30%)</td>
                                                <td>{(parseInt(price) + parseInt(packagingCharge)) * 0.3}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                        {loading ? <Loading /> :
                            <Link className='btn btn-dark mt-5' onClick={submitHandler}>Add Menu Item</Link>
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
            return { ...state, loading: false, menuItem: action.payload };
        case "FETCH_FAILED":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export function UpdateMenu() {
    const [{ loading, error, menuItem }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
        menuItem: {}
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [foodType, setFoodType] = useState("");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("0");
    const [packagingCharge, setPackagingCharge] = useState("0");
    const navigate = useNavigate();

    const [loading1, setLoading] = useState(false);
    const { id } = useParams();

    const fetchData = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
            const res = await axios.get(`https://zesty-backend.onrender.com/menu/get/${id}`);
            setFoodType(res.data.foodType);
            setPrice(((res.data.price) / 1.3) - res.data.packagingCharge)
            setPackagingCharge(res.data.packagingCharge);
            dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        } catch (error) {
            dispatch({ type: 'FETCH_FAILED', payload: error.message })
        }
    }

    const fetchCategories = async () => {
        try {
            const category = await axios.get('https://zesty-backend.onrender.com/category/get-all-category');
            setCategories(category.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const handleFoodType = (option) => {
        setFoodType(option);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalPrice = "";
            if (price !== "" && packagingCharge !== "") {
                finalPrice = ((parseInt(price) + parseInt(packagingCharge)) + (parseInt(price) + parseInt(packagingCharge)) * 0.3).toString();
            } else {
                toast.dark("Fill Empty fields")
                return;
            }
            const menuData = new FormData();
            menuData.append("id", id);
            menuData.append("name", name);
            menuData.append("description", description);
            menuData.append("image", image);
            menuData.append("foodType", foodType);
            menuData.append("category", category);
            menuData.append("price", finalPrice);
            menuData.append("packagingCharge", packagingCharge);
            const res = await axios.post("https://zesty-backend.onrender.com/menu/update-item", menuData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            if (res.status === 200) {
                toast.dark("Updated.");
                navigate("/restaurant/menu");
            } else if (res.status === 405) {
                toast.dark("Updating failed.");
                setLoading(false);
            } else {
                setLoading(false);
                toast.dark("internal error");
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div style={{ width: "100%", padding: "0", margin: "0" }}>
            <Header />
            <Container>
                <Card className='text-center mt-5 mx-auto p-5 form-card'>
                    <h3><u>Update Menu Item</u></h3>
                    {loading ? <Loading /> : error ? <MessageBox>{error}</MessageBox> :
                        <form action="">
                            <div className="form-floating mt-5 mb-2">
                                <input type="text" name="name" defaultValue={menuItem.name} onChange={(e) => setName(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Menu Item Name</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="text" name="name" defaultValue={menuItem.description} onChange={(e) => setDescription(e.target.value)} id="name" placeholder='Category name' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Item Description</label>
                            </div>

                            <select name="" id="" className='in form-select' defaultValue={menuItem.category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map((category) => (
                                    <option value={category.name}>{category.name}</option>
                                ))}
                            </select>

                            <label htmlFor="" className='mt-4 float-start'>Food Type: </label>
                            <Row className='mt-4'>
                                <Col  xs={12} md={6}>
                                    <a
                                        onClick={() => handleFoodType('Veg')}
                                        style={{
                                            border: foodType === 'Veg' ? '4px solid #000' : '1px solid #000',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            margin: '5px',
                                        }}
                                    >
                                        <img src="/images/vegSymbol.png" width={"30px"} alt="siuh" />{' '}
                                        Veg
                                    </a>

                                </Col>

                                <Col className={window.innerWidth < 600 ? 'mt-4' : ""} xs={12} md={6}>
                                    <a
                                        onClick={() => handleFoodType('Non-Veg')}
                                        style={{
                                            border: foodType === 'Non-Veg' ? '4px solid #000' : '1px solid #000',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            margin: '5px',
                                        }}
                                    >
                                        <img src="/images/nonVegSymbol.png" width={"30px"} alt="siuh" /> {' '}
                                        Non-Veg
                                    </a>
                                </Col>
                            </Row>

                            <div className="form-floating mt-5 mb-2">
                                <input type="file" accept='image/png, image/jpeg' name="image" onChange={(e) => setImage(e.target.files[0])} id="image" placeholder='Menu Item Image' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Menu Item Image</label>
                            </div>
                            <img src={menuItem.image} width={"80%"} alt={menuItem.name} />
                            {image && (
                                <div className="text-center">
                                    <img src={URL.createObjectURL(image)} alt='category' width={'80%'} />
                                </div>
                            )}

                            <div className="form-floating mt-3 mb-2">
                                <input type="number" min={0} name="price" defaultValue={price} onChange={(e) => setPrice(e.target.value)} id="name" placeholder='Item' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Item Price</label>
                            </div>

                            <div className="form-floating mt-3 mb-2">
                                <input type="number" name="charges" defaultValue={packagingCharge} onChange={(e) => setPackagingCharge(e.target.value)} id="name" placeholder='Packaging Charges' className='in form-control' style={{ width: "100%" }} />
                                <label style={{ color: "#222" }}>Packaging Charges</label>
                            </div>

                            {/* price accordion */}
                            <Accordion>
                                <Accordion.Item eventKey='0'>
                                    <Accordion.Header>
                                        <h5 style={{ width: "100%" }}>Final Price</h5>
                                        <h5 className='me-5' style={{ width: "100%", textAlign: "right" }}>
                                            {(parseInt(price) + parseInt(packagingCharge)) + (parseInt(price) + parseInt(packagingCharge)) * 0.3}
                                        </h5>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <table className='table'>
                                            <tbody>
                                                <tr>
                                                    <td className='text-start'>Item Total</td>
                                                    <td>{price === "0" ? ((menuItem.price) / 1.3) - menuItem.packagingCharge : parseInt(price)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='text-start'>Packaging Charge</td>
                                                    <td>{packagingCharge === "0" ? menuItem.packagingCharge : parseInt(packagingCharge)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='text-start'>Zesty Commision (30%)</td>
                                                    <td>{price === "0" && packagingCharge === "0" ? ((menuItem.price) - (menuItem.price / 1.3)).toFixed(2) : (parseInt(price) + parseInt(packagingCharge)) * 0.3}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            {loading1 ? <Loading /> :
                                <button className='btn btn-dark' onClick={handleUpdate}>Update</button>
                            }
                        </form>
                    }
                </Card>
            </Container>
        </div>
    )
}
