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

const SetorEdit = ({ setorData, reload, setReload, usuarios }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    sigla: "",
    chefe: "",
    substituto: "",
  });

  const handleShow = () => {
    const chefia = setorData.chefe === null ? "" : setorData.chefe;
    const subchefia = setorData.substituto === null ? "" : setorData.substituto;

    setForm({
      nome: setorData.nome,
      sigla: setorData.sigla,
      chefe: chefia,
      substituto: subchefia,
    });
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setForm({});
  };

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.chefe === form.substituto) {
      return toast.error(
        `Chefe e substituto(a) não podem ser a mesma pessoa.`,
        {
          duration: 7000,
        }
      );
    }
    try {
      setIsLoading(true);
      await api.put(`/setor/edit/${setorData._id}`, form);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success(`Dados de ${setorData.sigla} alterados com sucesso.`, {
        duration: 7000,
      });

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
          <Modal.Title>{`Editar: ${setorData.sigla} - ${setorData.nome}`}</Modal.Title>
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
                          type="string"
                          name="nome"
                          value={form.nome}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel label="Sigla do setor" className="mb-3">
                        <Form.Control
                          type="string"
                          name="sigla"
                          value={form.sigla}
                          onChange={handleChange}
                        />
                      </FloatingLabel>

                      {setorData.chefe === null ? (
                        <Select
                          placeholder="Selecione um(a) chefe"
                          name="chefe"
                          className="mb-3"
                          options={usuarios.filter(
                            (usuario) => usuario.role === "gestor"
                          )}
                          selectedoption
                          getOptionLabel={(option) => `${option.name}`}
                          styles={colourStyles}
                          isSearchable={true}
                          onChange={(e, selector) => handleChange(e, selector)}
                        />
                      ) : (
                        <Select
                          name="chefe"
                          className="mb-3"
                          options={usuarios.filter(
                            (usuario) => usuario.role === "gestor"
                          )}
                          defaultValue={form.chefe}
                          getOptionLabel={(option) => `${option.name}`}
                          styles={colourStyles}
                          isSearchable={true}
                          onChange={(e, selector) => handleChange(e, selector)}
                        />
                      )}

                      {setorData.substituto === null ? (
                        <Select
                          placeholder="Selecione um(a) substituto(a)"
                          name="substituto"
                          className="mb-3"
                          options={usuarios.filter(
                            (usuario) => usuario.role === "gestor"
                          )}
                          getOptionLabel={(option) => `${option.name}`}
                          styles={colourStyles}
                          isSearchable={true}
                          onChange={(e, selector) => handleChange(e, selector)}
                        />
                      ) : (
                        <Select
                          name="substituto"
                          className="mb-3"
                          options={usuarios.filter(
                            (usuario) => usuario.role === "gestor"
                          )}
                          defaultValue={form.substituto}
                          getOptionLabel={(option) => `${option.name}`}
                          styles={colourStyles}
                          isSearchable={true}
                          onChange={(e, selector) => handleChange(e, selector)}
                        />
                      )}
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

export default SetorEdit;
