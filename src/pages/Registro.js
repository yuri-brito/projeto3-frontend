import {
  Form,
  Button,
  Container,
  FloatingLabel,
  Card,
  Col,
  Row,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import toast from "react-hot-toast";
import Select from "react-select";
import SpinnerImage from "../components/SpinnerImage.js";
import Footer from "../components/Footer.js";
const Registro = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [setores, setSetores] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    setor: "",
    password: "",
    confirmPassword: "",
  });

  //chamar a api com os setores criados
  async function fetchingSetores() {
    try {
      const response = await api.get(`/setor/registroPage`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setSetores(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingSetores();
  }, []);

  const handleChange = (e) => {
    if (e.target === undefined) {
      setForm({ ...form, setor: e._id });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== form.confirmPassword) {
        toast.error("As senhas são incompatíveis!");
        return;
      }
      setIsLoading(true);
      const response = await api.post("/user/register", form);
      if (form.setor) {
        await api.put(`/setor/registerUser/${response.data._id}/${form.setor}`);
      }
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success("Usuário cadastrado com sucesso");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.msg);
      setIsLoading(false);
      console.log(error);
    }
  };
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      textAlign: "left",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected, is }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "rgba(13, 110, 253, 255)" : "white",
        color: isFocused ? "white" : "black",
        cursor: "pointer",
        textAlign: "left",
      };
    },
    placeholder: (styles) => ({ ...styles, textAlign: "left" }),
  };
  return (
    <>
      {isLoading ? (
        <SpinnerImage />
      ) : (
        <Card
          bg="light"
          style={{
            width: "50rem",
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
            <h2>Formulário de Cadastro</h2>
          </Card.Header>
          <Card.Body>
            <Container>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Nome completo" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Insira um nome"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Select
                    placeholder="Selecione um setor..."
                    options={setores}
                    getOptionLabel={(option) =>
                      `${option.sigla} - ${option.nome}`
                    }
                    styles={colourStyles}
                    isSearchable={true}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Endereço de email" className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Insira um e-mail"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <FloatingLabel label="Senha" className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Insira uma senha"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <FloatingLabel
                        label="Confirme a sua senha"
                        className="mb-3"
                      >
                        <Form.Control
                          type="password"
                          placeholder="Confirme sua senha criada"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant="primary" type="submit">
                      <i className="bi bi-person-plus"></i> Cadastrar
                    </Button>
                  </Col>
                  <Col>
                    <Link to="/">
                      <Button variant="secondary">
                        <i className="bi bi-arrow-return-left"></i> Voltar
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default Registro;
