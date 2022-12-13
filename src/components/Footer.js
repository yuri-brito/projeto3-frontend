import { Col, Container, Row } from "react-bootstrap";
import logoFooter from "../assets/patria_amada.png";

function Footer() {
  return (
    <div
      className="footer"
      style={{
        width: "100%",
        backgroundColor: "linen",
      }}
    >
      <Row className="d-flex flex-row align-items-center justify-content-center">
        <Col className="left" style={{ fontSize: 14 }}>
          Desenvolvido por Lucas e Yuri
        </Col>
        <Col className="center" style={{ fontSize: 14 }}>
          Todos os direitos reservados (v.1.1)
        </Col>
        <Col>
          <img
            style={{ marginBottom: 4 }}
            alt="Institucional"
            src={logoFooter}
            width="180px"
          />
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
