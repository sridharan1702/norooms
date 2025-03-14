import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import Header from './Header';
import Title from './Title';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import http from "../http-common";

const imageList = [
    { image: 'http://valparaihomestay.com/images/rooms/room-square-4a.jpg' },
    { image: 'http://valparaihomestay.com/images/rooms/room-square-5.jpg' },
    { image: 'http://valparaihomestay.com/images/pricing-img-1.jpg' },
]

function RoomDetail() {
    const location = useLocation();
    const hotel = location.state.id;
    const hotelName = location.state.name;
    const phone = location.state.phone;
    const [rooms, setrooms] = useState([]);
    const [isroom, setisroom] = useState(false);
    const [number, setNumber] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validNumber, setValidNumber] = useState(false);

    useEffect(() => {
        console.log(location.state.id);
        getRooms();
    }, []);

    const getRooms = () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        };

        http.post("/employee/add" + hotel, { headers })
            .then(response => {
                console.log(response.data);
                response.data.map((item) => {
                    item.images.map((img) => {
                        let url = img.imageurl.replace('10.0.2.2', 'localhost');
                        console.log(url);
                        img.imageurl = url;
                    })
                })
                setrooms(response.data);
                setisroom(true);
            }).catch(error => console.log(error));
    };

    const dialCall = (phone) => {
        if (number.length == 10) {
            setValidNumber(false);
            window.location.href = 'tel://' + phone;
        } else {
            setValidNumber(true);
        }
    }

    return (
        <div>
            <Header filter={false} />
            <div style={styles.pageHeader}>
                <Title name={hotelName}/>
                {isroom &&
                    <Row xs={1} md={5} className="g-2">
                        {rooms.map((item, idx) => (
                            <Col key={idx}>
                                <Card style={styles.card}>
                                    <Carousel interval={null}>
                                        {item.images.map((data, i) => {
                                            return <Carousel.Item>
                                                <img
                                                    className="d-block w-100"
                                                    src={data.imageurl}
                                                    alt="First slide"
                                                    style={styles.imageHeight}
                                                />
                                            </Carousel.Item>
                                        })}
                                    </Carousel>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item style={{fontWeight:'900'}}>{item.typeValue.name}</ListGroup.Item>
                                        <ListGroup.Item>${item.price}</ListGroup.Item>
                                        <ListGroup.Item>{item.ac ? 'AC' : 'Non-AC'}</ListGroup.Item>
                                        <ListGroup.Item>
                                            {item.facilities.map((d, i) => {
                                                return <span style={{ paddingLeft: 10, fontSize: 12 }}>{d.facilityValue.name}</span>
                                            })}
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Card.Body>
                                        <Button size="sm" className="callBg" onClick={handleShow}>Call & Book</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
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

export default RoomDetail;

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
    }
};