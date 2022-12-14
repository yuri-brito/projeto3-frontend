import { useContext, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../contexts/authContext";
import SpinnerImage from "./SpinnerImage";

const AtividadeCreate = ({ reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loggedUser, setLoggedeUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    horasEsperadas: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo)
      return toast.error(
        `Título da atividade é de preenchimento obrigatório.`,
        {
          duration: 7000,
        }
      );

    try {
      setIsLoading(true);
      await api.post(`/atividade/create/${loggedUser.user.setor._id}`, form);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success(`Nova atividade ${form.titulo} criada com sucesso.`, {
        duration: 7000,
      });
      handleClose();
      setReload(!reload);
    } catch (error) {
      toast.error(error.response);
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setForm({ titulo: "", descricao: "", horasEsperadas: "" });
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
    <div>
      <Button className="my-0" variant="success" size="sm" onClick={handleShow}>
        <i className="bi bi-plus-square-dotted"></i> Criar nova atividade
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar nova atividade</Modal.Title>
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
                      <FloatingLabel
                        label="Título da atividade"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          name="titulo"
                          value={form.titulo}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel
                        label="Descrição da atividade"
                        className="mb-3"
                      >
                        <Form.Control
                          type="textarea"
                          name="descricao"
                          value={form.descricao}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel label="Horas estimadas" className="mb-3">
                        <Form.Control
                          type="number"
                          name="horasEsperadas"
                          value={form.horasEsperadas}
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
                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  onClick={handleSubmit}
                >
                  <i className="bi bi-plus-circle-dotted"></i> Cadastrar
                </Button>
              </Col>
              <Col className="col-md-6 text-center">
                <Button variant="secondary" size="sm" onClick={handleClose}>
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

export default AtividadeCreate;
