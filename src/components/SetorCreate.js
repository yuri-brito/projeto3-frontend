import { useEffect, useState } from "react";
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
import Select from "react-select";
import api from "../api/api";
import SpinnerImage from "./SpinnerImage";

const SetorCreate = ({ reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [usuarios, setUsuarios] = useState({});
  const [form, setForm] = useState({
    nome: "",
    sigla: "",
    chefe: "",
    substituto: "",
  });

  async function fetchingUsuarios() {
    try {
      const response = await api.get(`/user/all-users`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setUsuarios(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingUsuarios();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome)
      return toast.error(`Nome do setor é de preenchimento obrigatório.`, {
        duration: 7000,
      });
    if (!form.sigla)
      return toast.error(`Sigla do setor é de preenchimento obrigatório.`, {
        duration: 7000,
      });
    if (form.chefe === form.substituto)
      return toast.error(
        `Chefe e substituto(a) não podem ser a mesma pessoa.`,
        {
          duration: 7000,
        }
      );
    try {
      setIsLoading(true);
      await api.post(`/setor/create`, form);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success(
        `Novo setor ${form.sigla} - ${form.nome} criado com sucesso.`,
        {
          duration: 7000,
        }
      );

      handleClose();
      setReload(!reload);
    } catch (error) {
      toast.error(error.response.data.msg);
      setIsLoading(false);
    }
  }

  const handleChange = (e, selector) => {
    if (selector) {
      if (selector.name === "chefe") {
        setForm({ ...form, chefe: e._id });
      }
      if (selector.name === "substituto") {
        setForm({ ...form, substituto: e._id });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setForm({});
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
      <Button className="my-3" variant="success" size="sm" onClick={handleShow}>
        <i className="bi bi-plus-square-dotted"></i> Criar novo setor
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar novo setor</Modal.Title>
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
                      <FloatingLabel label="Nome do setor" className="mb-3">
                        <Form.Control
                          width
                          type="string"
                          name="nome"
                          value={form.nome}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel label="Sigla do setor" className="mb-3">
                        <Form.Control
                          width
                          type="string"
                          name="sigla"
                          value={form.sigla}
                          onChange={handleChange}
                        />
                      </FloatingLabel>

                      <Select
                        placeholder="Selecione um(a) chefe"
                        name="chefe"
                        className="mb-3"
                        options={usuarios}
                        selectedoption
                        getOptionLabel={(option) => `${option.name}`}
                        styles={colourStyles}
                        isSearchable={true}
                        onChange={(e, selector) => handleChange(e, selector)}
                      />

                      <Select
                        placeholder="Selecione um(a) substituto(a)"
                        name="substituto"
                        className="mb-3"
                        options={usuarios}
                        getOptionLabel={(option) => `${option.name}`}
                        styles={colourStyles}
                        isSearchable={true}
                        onChange={(e, selector) => handleChange(e, selector)}
                      />
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

export default SetorCreate;
