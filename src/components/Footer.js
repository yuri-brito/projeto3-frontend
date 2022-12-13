import { Col, Container, Row } from "react-bootstrap";
import logoFooter from "../assets/patria_amada.png";

function Footer() {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "linen",
      }}
    >
      <Row>
        <Col className="left">Desenvolvido por Lucas e Yuri</Col>
        <Col className="center">Todos os direitos reservados (v.1.1)</Col>
        <Col>
          <img
            alt="Institucional"
            src={logoFooter}
            width="240px"
            height="50px"
          />
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
