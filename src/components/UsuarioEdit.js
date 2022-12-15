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
import Select from "react-select";
import { toast } from "react-hot-toast";
import api from "../api/api";
import SpinnerImage from "./SpinnerImage";

const UsuarioEdit = ({ usuarioData, reload, setReload, setoresData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    setor: "",
  });
  const roles = [
    { value: "usuario", label: "usuario" },
    { value: "gestor", label: "gestor" },
    { value: "admin", label: "admin" },
  ];

  const handleShow = () => {
    if (!usuarioData.setor) {
      setForm({
        name: usuarioData.name,
        email: usuarioData.email,
        role: usuarioData.role,
        setor: "blank",
      });
    } else {
      setForm({
        name: usuarioData.name,
        email: usuarioData.email,
        role: usuarioData.role,
        setor: usuarioData.setor._id,
      });
    }
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setForm({
      name: "",
      email: "",
      role: "",
      setor: "",
    });
  };

  const handleChange = (e, selector) => {
    if (selector) {
      if (selector.name === "setor") {
        setForm({ ...form, setor: e._id });
      }
      if (selector.name === "role") {
        setForm({ ...form, role: e.value });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const userUpdate = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    try {
      setIsLoading(true);
      await api.put(`/user/edit/${usuarioData._id}`, userUpdate);
      await api.put(`/setor/insertUser/${usuarioData._id}/${form.setor}`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success(`Dados de "${usuarioData.name}" alterados com sucesso.`, {
        duration: 7000,
      });

      handleClose();
      setReload(!reload);
    } catch (error) {
      toast.error(error.response.data);
      setIsLoading(false);
    }
  }

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
      <Button
        size="sm"
        className="my-0"
        variant="secondary"
        onClick={handleShow}
      >
        <i className="bi bi-pencil"></i> Editar
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Editar: ${usuarioData.name}`}</Modal.Title>
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
                      <FloatingLabel label="Nome completo" className="mb-3">
                        <Form.Control
                          // width
                          type="string"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel label="e-mail" className="mb-3">
                        <Form.Control
                          // width
                          type="string"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </FloatingLabel>

                      <Select
                        placeholder="Selecione um Perfil..."
                        name="role"
                        className="mb-3"
                        options={roles}
                        defaultValue={usuarioData.role}
                        styles={colourStyles}
                        isSearchable={true}
                        onChange={(e, selector) => handleChange(e, selector)}
                      />
                      <Select
                        placeholder="Selecione um setor..."
                        name="setor"
                        className="mb-3"
                        options={setoresData}
                        getOptionLabel={(option) =>
                          `${option.sigla} - ${option.nome}`
                        }
                        defaultValue={usuarioData.setor}
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

export default UsuarioEdit;
