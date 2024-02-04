import { Container } from 'react-bootstrap'

const Footer = () => {

    const year = new Date().getFullYear()

  return (
    <div>
        <Container className='p-10 mt-10'>
            <p className='text-center'>UI Shop @ {year}</p>
        </Container>
    </div>
  )
}

export default Footer