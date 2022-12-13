import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";
import SetorEdit from "../components/SetorEdit.js";
import SetorDelete from "../components/SetorDelete.js";

function SetorAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [setorData, setSetorData] = useState({});

  //api dos dados do setor
  async function fetchingDadosSetor() {
    try {
      const response = await api.get(`/setor/`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setSetorData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingDadosSetor();
  }, []);

  async function handleUserStatus(e, userId) {
    const newStatus = e === "on" ? false : true;

    try {
      await api.put(`/user/edit/${userId}`, { active: newStatus });
    } catch (error) {
      console.log(error);
      toast.error("Algo deu errado. Tente novamente!");
    }
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
            marginTop: 10,
            marginBottom: 30,
            animation: "fadein 1.5s",
            boxShadow:
              "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
          }}
        >
          <Card.Header>
            <h4>Gestão Unidades</h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                <ListGroup.Item
                  action
                  variant="light"
                  style={{ width: "92vw", marginBottom: "20px" }}
                >
                  <Row>
                    <Col>Nome setor</Col>
                    <Col>nome servidor</Col>

                    <Col>Usuários: </Col>
                    <Col> </Col>
                    <Col>
                      <Button className="my-0" variant="success" size="sm">
                        Criar novo setor{" "}
                        <i className="bi bi-plus-square-dotted"></i>
                      </Button>
                    </Col>
                    <Col> </Col>
                  </Row>
                </ListGroup.Item>
                {setorData.map((obj, index) => {
                  return (
                    <ListGroup.Item
                      action
                      variant="light"
                      style={{ width: "92vw", marginBottom: "10px" }}
                      key={index}
                    >
                      <Row>
                        <Col>
                          {obj.sigla} – {obj.nome}
                        </Col>
                        {obj.chefe.name && <Col>{obj.chefe.name}</Col>}
                        {obj.substituto.name && (
                          <Col>{obj.substituto.name}</Col>
                        )}
                        <Col>Usuários: {obj.usuarios.length}</Col>
                        <Col>
                          <Button variant="primary">
                            <Link
                              className="text-white text-decoration-none"
                              to={`/setor/${obj._id}`}
                            >
                              <i className="bi bi-ticket-detailed"></i> Detalhar
                            </Link>
                          </Button>
                        </Col>
                        <Col>
                          <SetorEdit setorData={obj} />
                        </Col>
                        <Col>
                          <SetorDelete setorData={obj} />
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
      ;
    </>
  );
}

export default SetorAdmin;
