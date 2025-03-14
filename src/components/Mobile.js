import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
    return (
        <header className="App-header">
            <FloatingLabel
                controlId="floatingInput"
                label="Mobile Number"
                className="mb-3"
                style={{ color: '#000' }}
            >
                <Form.Control type="phone" placeholder="99999-99999" />
            </FloatingLabel>
            <Link to="/location">
                <Button variant="primary">Login</Button>
            </Link>
        </header>
    );
}

export default Home;