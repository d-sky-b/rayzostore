import React from "react";

/* REACT-BOOTSTRAP */
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy; 2023 rayzostore . All rights reserved. Developed by <a href="https://www.dskyb.com" target="_blank" >dskyb</a></Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
