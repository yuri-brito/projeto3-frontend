import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  NavLink,
  Row,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
} from "react-bootstrap";
import { startOfMonth, endOfMonth, parseISO, set } from "date-fns";
import { AuthContext } from "../contexts/authContext";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";
import DashUser from "../components/DashUser.js";
import TarefaCreate from "../components/TarefaCreate.js";
import TarefaEdit from "../components/TarefaEdit.js";
import TarefaDelete from "../components/TarefaDelete.js";
import TarefaDetail from "../components/TarefaDetail.js";
import { useNavigate } from "react-router-dom";

function TarefasGestor() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(true);
  const [datas, setDatas] = useState({
    dataInicial: startOfMonth(new Date()),
    dataFinal: endOfMonth(new Date()),
  });
  const [metaPeriodo, setMetaPeriodo] = useState(0);
  const { userId } = useParams();
  const navigate = useNavigate();
  if (loggedUser.user._id === userId) {
    navigate("/tarefas");
  }
  //api dos dados do setor
  async function fetchingDadosUser() {
    try {
      const response = await api.get(`/user/one-user/${userId}`);
      // const tempo = (ms) => {
      //   return new Promise((resolve) => setTimeout(resolve, ms));
      // };
      // await tempo(2000);
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }
  useEffect(() => {
    fetchingDadosUser();
  }, [reload]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }
  async function handleValidadaStatus(e, tarefaId) {
    const newStatus = e.target.checked;

    try {
      await api.put(`/tarefa/edit/${tarefaId}`, { validada: newStatus });
      if (newStatus) {
        toast.success("Validação cadastrada");
      } else {
        toast.success("Validação descadastrada");
      }
      setReload(!reload);
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  console.log(userData);
  return (
    <>
      {isLoading ? (
        <SpinnerImage />
      ) : (
        <Card
          bg="light"
          style={{
            width: "95vw",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 30,
            marginBottom: 30,
            animation: "fadein 1.5s",
            boxShadow:
              "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
          }}
        >
          <Card.Header>
            <Row>
              <Col className="d-flex flex-column align-items-center justify-content-center">
                <h4>{userData.name}</h4>
              </Col>
              <Col className="d-flex flex-column align-items-center justify-content-center">
                <h6>{userData.email}</h6>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                {loggedUser.user.role === "gestor" && (
                  <DashUser
                    userData={userData.tarefas}
                    datas={datas}
                    setDatas={setDatas}
                    metaPeriodo={metaPeriodo}
                    setMetaPeriodo={setMetaPeriodo}
                  />
                )}
                <ListGroup.Item
                  as={"div"}
                  variant="light"
                  style={{ width: "92vw", marginBottom: "20px" }}
                >
                  <Row className="justify-content-md-center">
                    <Col>
                      <FloatingLabel
                        label="Filtrar por Atividade/Dedução, Observação"
                        className="ms-3"
                      >
                        <Form.Control
                          type="text"
                          value={search}
                          onChange={handleSearch}
                          placeholder="..."
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {userData.tarefas
                  .filter((tarefa) => {
                    let titulo = "";
                    let obs = "";
                    if (tarefa.atividade) {
                      titulo = tarefa.atividade.titulo;
                    }
                    if (tarefa.deducao) {
                      titulo = tarefa.deducao.titulo;
                    }
                    if (tarefa.observacao) {
                      obs = tarefa.observacao;
                    } else {
                      obs = "-";
                    }
                    return (
                      titulo.toLowerCase().includes(search.toLowerCase()) ||
                      obs.toLowerCase().includes(search.toLowerCase()) ||
                      tarefa.horas.toString().includes(search.toLowerCase())
                    );
                  })
                  .reverse()
                  .map((obj, index) => {
                    return (
                      <ListGroup.Item
                        as={"div"}
                        action
                        variant="light"
                        style={{ width: "92vw", marginBottom: "10px" }}
                        key={index}
                      >
                        <Row>
                          <Col className="col-2 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Título
                            </Row>
                            {obj.atividade ? (
                              <div>
                                {obj.atividade.titulo.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.atividade.titulo}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.atividade.titulo}
                                        </Tooltip>
                                      }
                                    >
                                      <Card.Text
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          textAlign: "left",
                                        }}
                                      >
                                        {obj.atividade.titulo.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            ) : (
                              <div>
                                {obj.deducao.titulo.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.deducao.titulo}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.deducao.titulo}
                                        </Tooltip>
                                      }
                                    >
                                      <Card.Text
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          textAlign: "left",
                                        }}
                                      >
                                        {obj.deducao.titulo.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            )}
                          </Col>
                          <Col className="col-2 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Observação
                            </Row>
                            {obj.observacao ? (
                              <div>
                                {obj.observacao.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.observacao}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.observacao}
                                        </Tooltip>
                                      }
                                    >
                                      <Card.Text
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          textAlign: "left",
                                        }}
                                      >
                                        {obj.observacao.slice(0, 15)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
                            ) : (
                              <Row>-</Row>
                            )}
                          </Col>
                          <Col className="col-1 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Horas
                            </Row>
                            {obj.horas ? (
                              <Row style={{ textAlign: "left" }}>
                                {obj.horas}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>-</Row>
                            )}
                          </Col>
                          <Col className="col-1 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Concluída
                            </Row>
                            <Row>
                              <Form.Check
                                className="p-0"
                                isValid
                                readOnly
                                style={{ textAlign: "left" }}
                                type="checkbox"
                                checked={obj.concluida}
                              ></Form.Check>
                            </Row>
                          </Col>
                          {loggedUser.user.role === "admin" && (
                            <Col className="col-1 ms-3">
                              <Row
                                style={{
                                  fontSize: 11,
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                Validada
                              </Row>
                              <Row>
                                <Form.Check
                                  className="p-0"
                                  isValid
                                  readOnly
                                  style={{ textAlign: "left" }}
                                  type="checkbox"
                                  checked={obj.validada}
                                ></Form.Check>
                              </Row>
                            </Col>
                          )}
                          <Col className="d-flex justify-content-center align-items-end">
                            <TarefaDetail tarefaData={obj} />
                          </Col>
                          {loggedUser.user.role === "gestor" && (
                            <Col className="col-1 ms-3">
                              <Row
                                style={{
                                  fontSize: 11,
                                  fontStyle: "italic",
                                  fontWeight: "bold",
                                }}
                              >
                                Validada
                              </Row>
                              <Row>
                                {obj.concluida ? (
                                  <Form.Check
                                    className="p-0"
                                    style={{ textAlign: "left" }}
                                    type="checkbox"
                                    defaultChecked={obj.validada}
                                    onChange={(e) =>
                                      handleValidadaStatus(e, obj._id)
                                    }
                                  ></Form.Check>
                                ) : (
                                  <Form.Check
                                    disabled
                                    className="p-0"
                                    style={{ textAlign: "left" }}
                                    type="checkbox"
                                    defaultChecked={obj.validada}
                                    onChange={(e) =>
                                      handleValidadaStatus(e, obj._id)
                                    }
                                  ></Form.Check>
                                )}
                              </Row>
                            </Col>
                          )}
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Container>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default TarefasGestor;
