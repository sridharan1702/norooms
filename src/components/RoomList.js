import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import Rating from './salary';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { FaPhoneSquareAlt } from 'react-icons/fa'
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import http from "../http-common";

const imageList = [
    { image: 'https://www.hillsandwills.com/blog_images/45191.jpg' },
    { image: 'https://r1imghtlak.mmtcdn.com/768e19844ddb11ecb7a30a58a9feac02.jpg?&output-quality=75&downsize=583:388&output-format=jpg' },
    { image: 'https://r1imghtlak.mmtcdn.com/768e19844ddb11ecb7a30a58a9feac02.jpg?&output-quality=75&downsize=583:388&output-format=jpg' },
]

function RoomList(props) {
    let navigate = useNavigate();
    const location = useLocation();
    const area = location.state.id;
    const [page, setPage] = useState(0);
    const size = 10;
    const [hotelName, setHotelName] = useState("");
    const [phone, setPhone] = useState("");
    const [rooms, setrooms] = useState([]);
    const [isroom, setisroom] = useState(false);
    const [number, setNumber] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [validNumber, setValidNumber] = useState(false);

    useEffect(() => {
        console.log(location.state.id);
        getRooms();
    }, [page]);

    const getRooms = () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        };

        http.get("/hotel/getHotelByArea/"+area+"/"+page+"/"+size, { headers })
            .then(response => {
                console.log(response.data);
                response.data.map((item) => {
                    item.images.map((img) => {
                        let url = img.imageurl.replace('10.0.2.2', 'localhost');
                        console.log(url);
                        img.imageurl = url;
                    })
                })
                setrooms(d=> d.concat(response.data));
                setisroom(true);
            }).catch(error => console.log(error));
    };

    const handleShow = (item) => {
        setHotelName(item.name);
        setPhone(item.phone);
        setShow(true);
    }

    const dialCall = (phone) => {
        if (number.length == 10) {
            setValidNumber(false);
            window.location.href = 'tel://' + phone;
        } else {
            setValidNumber(true);
        }
    }

    const roomDetail = (item) => {
        console.log("hotelId", item);
        navigate('/roomdetail', { state: { id: item.id, name: item.name, phone: item.phone } });
    };

    const loadMore = () => {
        setPage(page => page+1);
        // getRooms();
    };

    return (
        <div>
            <Header filter={false} />
            <div style={styles.pageHeader}>
                {isroom &&
                    <>
                        <Row xs={1} md={5} className="g-2">
                            {rooms.map((item, idx) => (
                                <Col key={idx}>
                                    <Card style={styles.card}>
                                        <Carousel interval={null}>
                                            {item.images.map((data, i) => {
                                                return <Carousel.Item>
                                                    <img
                                                        key={i}
                                                        className="d-block w-100"
                                                        src={data.imageurl}
                                                        alt="First slide"
                                                        style={styles.imageHeight}
                                                    />
                                                </Carousel.Item>
                                            })}
                                        </Carousel>
                                        <Card.Body>
                                            <Card.Title style={{ fontWeight: '900' }}>{item.name}</Card.Title>
                                            <Card.Text>
                                                {item.address1}
                                            </Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            {/* <ListGroup.Item>5 Rooms</ListGroup.Item>
                                        <ListGroup.Item>$500 - $10,000</ListGroup.Item> */}
                                            <ListGroup.Item>Ratings <Rating rating={item.rating} /></ListGroup.Item>
                                            <ListGroup.Item>
                                                {item.amenities.map((d, i) => {
                                                    return <span style={{ paddingLeft: 10, fontSize: 12 }}>{d.aminityValue.name}</span>
                                                })}
                                            </ListGroup.Item>

                                        </ListGroup>
                                        <Card.Body>
                                            <Button size="sm" className="blueBg" onClick={() => roomDetail(item)}>View Details</Button>
                                            <Button size="sm" className="callBg" onClick={() => handleShow(item)}>Call & Book</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Button size="sm" className='diffBg' onClick={() => loadMore()}>
                            Load More
                        </Button>
                    </>
                }
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{hotelName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body href="tel:+900300400">
                        <FloatingLabel controlId="floatingInputGrid" label="Please enter your mobile number">
                            <Form.Control type="text" value={number} onChange={(event) => { setNumber(event.target.value) }} placeholder="9**** 9****" />
                        </FloatingLabel>
                        {validNumber &&
                            <span style={styles.validationMessage}>Please enter a valid number</span>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='callBg' onClick={() => dialCall(phone)}>
                            <FaPhoneSquareAlt fontSize="30px" />
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default RoomList;

const styles = {
    pageHeader: {
        marginTop: '50px',
        padding: 10
    },
    card: {
        width: 'auto',
        margin: 5,
        border: '1px solid #ccc'
    },
    imageHeight: {
        height: '250px'
    },
    validationMessage: {
        color: 'red',
        fontSize: 14
    },

};