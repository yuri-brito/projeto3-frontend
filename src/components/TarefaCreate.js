import { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../contexts/authContext";
import SpinnerImage from "./SpinnerImage";

const TarefaCreate = ({ reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { loggedUser, setLoggedeUser } = useContext(AuthContext);
  const [atividade, setAtividades] = useState([]);
  const [deducao, setDeducao] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    atividade: null,
    deducao: null,
    horas: 0,
    concluida: false,
    observacao: "",
    validada: false,
  });
  async function fetchingDadosSetor() {
    try {
      const resAtividade = await api.get("/atividade/");
      setAtividades(resAtividade.data);
      const resDeducao = await api.get("/deducao/");
      setDeducao(resDeducao.data);
    } catch (error) {
      console.log(error);
      toast.errot(error.response.data.msg);
    }
  }
  useEffect(() => {
    fetchingDadosSetor();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.atividade && !form.deducao)
      return toast.error(`Uma Atividade ou Dedução tem que ser preenchida.`, {
        duration: 7000,
      });
    if (form.atividade && form.deducao) {
      return toast.error(`Só pode ser cadastrada uma Atividade/Dedução.`, {
        duration: 7000,
      });
    }
    let body = {};
    if (!form.deducao) {
      body = { ...form, atividade: form.atividade._id };
      delete body.deducao;
    }
    if (!form.atividade) {
      body = { ...form, deducao: form.deducao._id };
      delete body.atividade;
    }

    try {
      setIsLoading(true);
      await api.post(`/tarefa/create`, body);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setIsLoading(false);
      toast.success(`Nova Tarefa criada com sucesso.`, {
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

  const handleChange = (e, selector) => {
    if (selector) {
      if (selector.name === "atividade") {
        setForm({ ...form, atividade: e });
      }
      if (selector.name === "deducao") {
        setForm({ ...form, deducao: e });
      }
    } else if (e.target.checked) {
      setForm({ ...form, concluida: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setForm({
      atividade: null,
      deducao: null,
      horas: 0,
      concluida: false,
      observacao: "",
      validada: false,
    });
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
        <i className="bi bi-plus-square-dotted"></i> Cadastrar tarefa
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar nova tarefa</Modal.Title>
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
                      <Select
                        placeholder="Selecione uma atividade"
                        name="atividade"
                        className="mb-3"
                        options={atividade.filter((ele) => ele.ativa)}
                        getOptionLabel={(option) => `${option.titulo}`}
                        styles={colourStyles}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(e, selector) => handleChange(e, selector)}
                      />

                      <Select
                        placeholder="Selecione uma Dedução"
                        name="deducao"
                        className="mb-3"
                        options={deducao.filter((ele) => ele.ativa)}
                        getOptionLabel={(option) => `${option.titulo}`}
                        styles={colourStyles}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(e, selector) => handleChange(e, selector)}
                      />
                      <FloatingLabel label="Horas de trabalho" className="mb-3">
                        <Form.Control
                          type="number"
                          name="horas"
                          value={form.horas}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel label="Observações" className="mb-3">
                        <Form.Control
                          type="textarea"
                          name="observacao"
                          value={form.observacao}
                          onChange={handleChange}
                        />
                      </FloatingLabel>
                      <Form.Check
                        className=""
                        style={{ textAlign: "left" }}
                        type="checkbox"
                        label="Atividade já foi concluída?"
                        defaultChecked={form.concluida}
                        onChange={(e) => handleChange(e)}
                      ></Form.Check>
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

export default TarefaCreate;
