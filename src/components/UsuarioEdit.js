import { useEffect, useState } from "react";
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

const UsuarioEdit = ({ usuarioData, reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [setoresData, setSetoresData] = useState({});
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });
  const roles = ["usuario", "gestor", "admin"];

  async function fetchingSetores() {
    try {
      const response = await api.get(`/setor/registroPage`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setSetoresData(response.data);
      setIsLoading(false);
      console.log(setoresData);
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingSetores();
  }, []);

  const handleShow = () => {
    setForm({
      name: usuarioData.name,
      email: usuarioData.email,
      role: usuarioData.role,
    });
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setForm({});
  };

  const handleChange = (e) => {
    if (e.target === undefined) {
      setForm({ ...form, role: e });
      console.log(e);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.put(`/user/edit/${usuarioData._id}}`, form);
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
      toast.error(error.response.data.msg);
      setIsLoading(false);
    }
  }

  async function handleUsuarioStatus(e) {
    const newStatus = e.target.checked;

    try {
      await api.put(`/user/edit/${usuarioData._id}`, { active: newStatus });
      if (newStatus) {
        toast.success(
          <span>
            Status do usuário alterado para: <b>ativo</b>
          </span>
        );
      } else {
        toast.success(
          <span>
            Status do usuário alterado para: <b>inativo</b>
          </span>
        );
      }
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
    }
  }

  async function handleUsuarioSetor(e) {
    const newSetor = e;

    try {
      await api.put(`/insertUser/${usuarioData._id}/${e._id}`);
      toast.success(`Dados de "${usuarioData.name}" alterados com sucesso.`, {
        duration: 7000,
      });
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
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
                          width
                          type="string"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel label="e-mail" className="mb-3">
                        <Form.Control
                          width
                          type="string"
                          name="sigla"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <Select
                        placeholder="Selecione um setor..."
                        options={setoresData}
                        getOptionLabel={(option) =>
                          `${option.sigla} - ${option.nome}`
                        }
                        defaultValue={usuarioData.setor}
                        styles={colourStyles}
                        isSearchable={true}
                        onChange={(e) => handleChange(e)}
                      />

                      <Select
                        placeholder="Selecione um(a) chefe"
                        name="chefe"
                        className="mb-3"
                        options={roles}
                        selectedoption
                        styles={colourStyles}
                        onChange={(e) => handleChange(e)}
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
