import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const FormContainer = ({children}) => {
  return (
    <div>
        <Container>
            <Row className='flex justify-center mt-5'>
                <Col lg={4} md={6}>
                   {children}
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default FormContainer