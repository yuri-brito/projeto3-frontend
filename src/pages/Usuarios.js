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
import { AuthContext } from "../contexts/authContext.js";
import UsuarioEdit from "../components/UsuarioEdit.js";
import UsuarioDelete from "../components/UsuarioDelete.js";

const Usuarios = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState({});
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(true);
  const { loggedUser } = useContext(AuthContext);

  //api dos dados dos usuários
  async function fetchingUsuarios() {
    try {
      const response = await api.get(`/user/all-users`);
      const tempo = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      await tempo(2000);
      setUsuarios(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente!");
    }
  }
  useEffect(() => {
    fetchingUsuarios();
  }, [reload]);

  async function handleUsuarioStatus(e, usuarioId) {
    const newStatus = e.target.checked;

    try {
      await api.put(`/user/edit/${usuarioId}`, { active: newStatus });
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
            <h4>Administração de usuários</h4>
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
                  <Row className="justify-content-md-center">
                    <Col>
                      <FloatingLabel
                        label="Filtrar por Nome, e-mail, perfil ou setor..."
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
                {usuarios
                  .filter((usuario) => {
                    return (
                      usuario.name
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      usuario.email
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      usuario.role
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      usuario.setor.toLowerCase().includes(search.toLowerCase())
                    );
                  })
                  .reverse()
                  .map((obj, index) => {
                    if (!obj.setor) obj.setor = "não atribuído";
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
                              Nome
                            </Row>
                            {obj.name.length < 15 ? (
                              <Row style={{ textAlign: "left" }}>
                                {obj.name}
                              </Row>
                            ) : (
                              <Row style={{ textAlign: "left" }}>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-top`}>
                                      {obj.name}
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
                                    {obj.name.slice(0, 15)}...
                                  </Card.Text>
                                </OverlayTrigger>
                              </Row>
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
                              e-mail
                            </Row>
                            {obj.email && (
                              <div>
                                {obj.email.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.email}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.email}
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
                                        {obj.email.slice(0, 15)}...
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
                              Setor
                            </Row>
                            {obj.setor && (
                              <div>
                                {obj.setor.length < 15 ? (
                                  <Row style={{ textAlign: "left" }}>
                                    {obj.setor}
                                  </Row>
                                ) : (
                                  <Row style={{ textAlign: "left" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-top`}>
                                          {obj.setor}
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
                                        {obj.setor.slice(0, 15)}...
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
                              Perfil
                            </Row>
                            {obj.role && <Row>{obj.role}</Row>}
                          </Col>
                          <Col className="col-1 ms-3">
                            <Row
                              style={{
                                fontSize: 11,
                                fontStyle: "italic",
                                fontWeight: "bold",
                              }}
                            >
                              Status
                            </Row>
                            <Row>
                              <Form.Check
                                className="p-0"
                                style={{ textAlign: "left" }}
                                type="checkbox"
                                defaultChecked={obj.active}
                                onChange={(e) =>
                                  handleUsuarioStatus(e, obj._id)
                                }
                              ></Form.Check>
                              {obj.active}
                            </Row>
                          </Col>

                          <Col className="col-1 d-flex justify-content-center align-items-end">
                            <UsuarioEdit
                              usuarioData={obj}
                              reload={reload}
                              setReload={setReload}
                            />
                          </Col>
                          <Col className="col-1 d-flex justify-content-center align-items-end">
                            <UsuarioDelete
                              usuarioData={obj}
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
};
export default Usuarios;
