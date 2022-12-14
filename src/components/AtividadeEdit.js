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
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import SpinnerImage from "./SpinnerImage";

const AtividadeEdit = ({ atividadeData, reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    horasEsperadas: "",
  });

  const handleShow = () => {
    setForm({
      titulo: atividadeData.titulo,
      descricao: atividadeData.descricao,
      horasEsperadas: atividadeData.horasEsperadas,
    });
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setForm({ titulo: "", descricao: "", horasEsperadas: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo) {
      return toast.error(
        `Título da atividade é de preenchimento obrigatório.`,
        {
          duration: 7000,
        }
      );
    }
    try {
      setIsLoading(true);
      await api.put(`/atividade/edit/${atividadeData._id}`, form);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success(
        `Dados de "${atividadeData.titulo}" alterados com sucesso.`,
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
          <Modal.Title>{`Editar: ${atividadeData.titulo}`}</Modal.Title>
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
                          type="text"
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

export default AtividadeEdit;
