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
import { useParams } from "react-router-dom";

function SetorAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [setorData, setSetorData] = useState({});
  const userData = JSON.parse(window.localStorage.getItem("loggedUser"));
  console.log(setorData);

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
            boxShadow:
              "0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)",
          }}
        >
          <Card.Header>
            <h4>Gestão setores</h4>
          </Card.Header>
          <Card.Body>
            <Container className="d-flex flex-column align-items-center justify-content-center">
              <ListGroup>
                {setorData.map((obj, index) => {
                  return (
                    <ListGroup.Item
                      action
                      variant="light"
                      style={{ width: "92vw", marginBottom: "10px" }}
                      key={index}
                    >
                      <Row>
                        <Col>{obj.nome}</Col>
                        <Col>{obj.sigla}</Col>
                        <Col>{obj.chefe}</Col>
                        <Col>{obj.substituto}</Col>
                        <Col>Usuários: {obj.usuarios.length}</Col>
                        <Col>
                          <Button variant="primary">
                            <NavLink href={`/setor/${obj._id}`}>
                              <i className="bi bi-ticket-detailed"></i> Detalhar
                            </NavLink>
                          </Button>
                        </Col>
                        <Col>
                          <Button variant="secondary">
                            <i className="bi bi-pencil"></i> Editar
                          </Button>
                        </Col>
                        <Col>
                          <Button variant="danger">
                            <i className="bi bi-trash3"></i> Excluir
                          </Button>
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
