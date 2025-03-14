import Card from 'react-bootstrap/Card';

function Title({name}) {
  return (
    <Card>
      <Card.Body style={{fontWeight: 'bold'}}>{name}</Card.Body>
    </Card>
  );
}

export default Title;