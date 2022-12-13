import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  FloatingLabel,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext.js";
import SpinnerImage from "./SpinnerImage";
const TrocaEmail = () => {
  const { setLoggedUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "" });
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.put("/user/editprofile", form);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success("Email alterado, faça o login com o novo email.", {
        duration: 7000,
      });
      localStorage.removeItem("loggedUser");
      setLoggedUser(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.msg);
      setIsLoading(false);
      console.log(error);
    }
  }
  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Alterar email <i className="bi bi-envelope-at"></i>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Alterar Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {isLoading ? (
              <SpinnerImage />
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col className="d-flex justify-content-center align-items-center">
                    <Form.Group className="ms-3 mb-3 w-100">
                      <FloatingLabel label="Novo email" className="mb-3">
                        <Form.Control
                          width
                          type="email"
                          name="email"
                          placeholder="Novo email"
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col className="col-md-6 text-center">
                <Button variant="success" type="submit" onClick={handleSubmit}>
                  <i className="bi bi-download"></i> Salvar
                </Button>
              </Col>
              <Col className="col-md-6 text-center">
                <Button variant="secondary" onClick={handleClose}>
                  <i className="bi bi-x-square"></i> Cancelar
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TrocaEmail;
