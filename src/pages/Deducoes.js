import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  ListGroup,
  Row,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";
import DeducaoCreate from "../components/DeducaoCreate.js";
import DeducaoEdit from "../components/DeducaoEdit.js";
import DeducaoDelete from "../components/DeducaoDelete.js";
import { AuthContext } from "../contexts/authContext.js";
function Deducoes() {
  const [isLoading, setIsLoading] = useState(true);
  const [deducoes, setDeducoes] = useState([]);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(true);
  const { loggedUser } = useContext(AuthContext);
  //api dos dados do setor
  async function fetchingDeducoes() {
    try {
      const response = await api.get(`/deducao/`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setDeducoes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingDeducoes();
  }, [reload]);
  async function handleDeducaoStatus(e, deducoesId) {
    const newStatus = e.target.checked;

    try {
      await api.put(`/deducao/edit/${deducoesId}`, { ativa: newStatus });
      if (newStatus) {
        toast.success("Dedução ativada para o setor");
      } else {
        toast.success("Dedução desativada para o setor");
      }
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  function handleSearch(e) {
    setSearch(e.target.value);
  }

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
            <h4>Gestão das Deduções</h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                <ListGroup.Item
                  as={"div"}
                  action
                  variant="light"
                  style={{ width: "92vw", marginBottom: 20 }}
                >
                  <Row>
                    <Col>
                      <FloatingLabel
                        label="Filtrar por Título ou descrição..."
                        className="ms-3"
                      >
                        <Form.Control
                          type="text"
                          value={search}
                          onChange={handleSearch}
                          placeholder="Insira a hora esperada"
                        />
                      </FloatingLabel>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
                      {loggedUser.user.role === "gestor" && (
                        <DeducaoCreate reload={reload} setReload={setReload} />
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {deducoes
                  .filter((deducao) => {
                    return (
                      deducao.titulo
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      deducao.descricao
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    );
                  })
                  .reverse()
                  .map((obj, index) => {
                    return (
                      <ListGroup.Item
                        as={"div"}
                        action
                        variant="light"
                        style={{
                          width: "92vw",
                          marginBottom: 10,
                          animation: "fadein 1.5s",
                        }}
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
                            {obj.titulo.length < 15 ? (
                              <Row style={{ textAlign: "left" }}>
                                {obj.titulo}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-top`}>
                                      {obj.titulo}
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
                                    {obj.titulo.slice(0, 15)}...
                                  </Card.Text>
                                </OverlayTrigger>
                              </Row>
                            )}
                          </Col>
                          <Col className="col-4 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Descrição
                            </Row>
                            {obj.descricao && (
                              <div>
                                {obj.descricao.length < 40 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.descricao}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.descricao}
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
                                        {obj.descricao.slice(0, 40)}...
                                      </Card.Text>
                                    </OverlayTrigger>
                                  </Row>
                                )}
                              </div>
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
                              Ativa
                            </Row>
                            <Row>
                              <Form.Check
                                className="p-0"
                                style={{ textAlign: "left" }}
                                type="checkbox"
                                defaultChecked={obj.ativa}
                                onChange={(e) =>
                                  handleDeducaoStatus(e, obj._id)
                                }
                              ></Form.Check>
                              {obj.active}
                            </Row>
                          </Col>

                          <Col className="col-2 d-flex justify-content-center align-items-end">
                            <DeducaoEdit
                              deducaoData={obj}
                              reload={reload}
                              setReload={setReload}
                            />
                          </Col>
                          <Col className="col-2 d-flex justify-content-center align-items-end">
                            <DeducaoDelete
                              deducaoData={obj}
                              reload={reload}
                              setReload={setReload}
                            />
                          </Col>
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

export default Deducoes;
