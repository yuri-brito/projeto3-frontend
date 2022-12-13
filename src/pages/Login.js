import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Card, FloatingLabel } from "react-bootstrap";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../contexts/authContext";
import Footer from "../components/Footer.js";
function Login(props) {
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  function handleChange(e) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post("/user/login", loginForm);

      setLoggedUser({ ...response.data });
      localStorage.setItem("loggedUser", JSON.stringify(response.data));
      navigate("/profile");
    } catch (error) {
      toast.error(error.response.data.msg);
      return;
    }
  }
  return (
    <Card
      bg="light"
      style={{
        width: "30rem",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 30,
        marginBottom: 30,
        boxShadow:
          "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
        animation: "fadein 1.5s",
      }}
    >
      <Card.Header>
        <h2>Entrar no SisPro</h2>
      </Card.Header>
      <Card.Body>
        <Container className="d-flex flex-column align-items-center justify-content-center">
          <Form onSubmit={handleSubmit} className="w-100">
            <Form.Group className="mb-3">
              <FloatingLabel label="Endereço de email" className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleChange}
                  placeholder="Insira o endereço de e-mail cadastrado"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Senha" className="mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleChange}
                  placeholder="Insira a senha cadastrada"
                />
              </FloatingLabel>
            </Form.Group>
            <Button className="my-2" variant="primary" type="submit">
              Login <i className="bi bi-box-arrow-in-right"></i>
            </Button>
          </Form>
        </Container>
      </Card.Body>
      <Card.Footer>
        <Container className="d-flex flex-raw justify-items-center align-items-center justify-content-evenly">
          <p className="mb-0">Ainda não possui cadastro?</p>

          <Link
            className="text-dark fw-bold text-decoration-none"
            to="/registro"
          >
            <Button className="my-0" variant="success" size="sm">
              Cadastre-se <i className="bi bi-door-open"></i>
            </Button>
          </Link>
        </Container>
      </Card.Footer>
    </Card>
  );
}

export default Login;
