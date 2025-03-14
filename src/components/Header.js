import React, { useState } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Rating from './salary';
import { useNavigate } from "react-router-dom";

const logo = require('../assets/images/logosmwhite.png');

function Header({ filter }) {
  const navigate = useNavigate();
  const [rate, setRate] = useState(2);
  const [pricingasec, setPricingasec] = useState(false);

  return (
    <Navbar className='headerBg' fixed="top" expand="lg">
      <Container>
        <Navbar.Brand className='logo'><img src={logo} alt="Logo" onClick={() => navigate(`/`)} /></Navbar.Brand>
        {filter && (
          <>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link></Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link style={styles.whiteFont}>
                  <label style={styles.paddingRTen}>Pricing: </label>
                  <ButtonGroup aria-label="Basic example">
                    <Button variant="light" size="sm" disabled={pricingasec} onClick={(i) => setPricingasec(!pricingasec)}>Low to high</Button>
                    <Button variant="light" size="sm" disabled={!pricingasec} onClick={(i) => setPricingasec(!pricingasec)}>High to low</Button>
                  </ButtonGroup>
                </Nav.Link>
                <Nav.Link eventKey={2} style={styles.whiteFont}>
                  <label style={styles.paddingRTen}>Rating: </label>
                  <Rating rating={rate} onClick={(i) => setRate(i + 1)} style={styles.pointer} />
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;

const styles = {
  whiteFont: {
    color: '#fff'
  },
  paddingRTen: {
    paddingRight: '10px'
  },
  pointer: {
    cursor: 'pointer'
  }


};