import { Col, Card, Placeholder, CardBody, CardTitle, CardText, CardFooter } from "reactstrap";

export default function CardsSkeleton() {
  return <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
    {Array.from({ length: 6 }).map((_, index) => (
      <Col key={index}>
        <Card className="h-100">
          <div className="card-img-container position-relative" style={{ paddingBottom: '66.67%', overflow: 'hidden' }}>
            <Placeholder color="secondary" tag="img"
              animation="wave"
              className="card-img-top position-absolute top-0 start-0 w-100 h-100"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
          <CardBody>
            <CardTitle tag="h5" className="fs-4 fs-md-3 mb-3">
              <Placeholder animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
            </CardTitle>
            <CardText className="flex-grow-1 fs-6 fs-md-5">
              <Placeholder animation="wave">
                <Placeholder xs={12} />
              </Placeholder>
              <Placeholder animation="wave">
                <Placeholder xs={8} />
              </Placeholder>
            </CardText>
          </CardBody>
          <CardFooter className="d-flex flex-column flex-md-row justify-content-end align-items-center gap-3">
            {/* <button className="btn-purple-1 w-100 w-md-auto" disabled>
            <Placeholder xs={4} />
          </button> */}
            <Placeholder animation="wave" className="w-100 w-md-auto btn-purple-1" style={{
              width: '100%',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'wait',
            }}>
              {/* <Placeholder xs={6} /> */}
            </Placeholder>

          </CardFooter>
        </Card>
      </Col>
    ))}
  </div>
}