import api from "../api/api.js";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Select from "react-select";
import {
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  NavLink,
  Row,
} from "react-bootstrap";
import SpinnerImage from "../components/SpinnerImage.js";
import { Link, useParams } from "react-router-dom";

function SetorGestor() {
  const [isLoading, setIsLoading] = useState(true);
  const [setorData, setSetorData] = useState({});
  const userData = JSON.parse(window.localStorage.getItem("loggedUser"));
  console.log(setorData);

  //resolver essa captura - retornando undefined
  const { setorId } = useParams();

  //api dos dados do setor
  async function fetchingDadosSetor() {
    try {
      const response = await api.get(`/setor/${setorId}`);
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
            marginTop: 30,
            marginBottom: 30,
            animation: "fadein 1.5s",
            boxShadow:
              "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
          }}
        >
          <Card.Header>
            <h4>
              {setorData.nome} – {setorData.sigla}
            </h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                <ListGroup.Item
                  variant="light"
                  style={{
                    width: "92vw",
                    height: "20vh",
                    marginBottom: "20px",
                  }}
                >
                  dashboard do Gestor
                </ListGroup.Item>

                <ListGroup.Item
                  variant="light"
                  style={{ width: "92vw", marginBottom: "20px" }}
                >
                  <Row>
                    <Col>Nome setor</Col>
                    <Col>nome servidor</Col>

                    <Col>Usuários: </Col>
                    <Col> </Col>
                    <Col> </Col>
                    <Col> </Col>
                  </Row>
                </ListGroup.Item>

                {setorData.usuarios.map((obj, index) => {
                  return (
                    <ListGroup.Item
                      action
                      variant="light"
                      style={{ width: "92vw", marginBottom: "10px" }}
                      key={index}
                    >
                      <Row>
                        <Col>{obj.name}</Col>
                        <Col>{obj.email}</Col>
                        <Col>{obj.role}</Col>
                        <Col>ProgressBar1</Col>
                        <Col>ProgressBar2</Col>
                        <Col>
                          <Button variant="primary" size="sm">
                            <i className="bi bi-ticket-detailed"></i> Detalhar
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Container>
          </Card.Body>
          {userData.user.role === "admin" && (
            <Button variant="secondary">
              <NavLink href="/adminsetor">
                <i className="bi bi-arrow-return-left"></i> Voltar
              </NavLink>
            </Button>
          )}
        </Card>
      )}
      ;
    </>
  );
}

export default SetorGestor;
