import React, { useEffect, useState } from 'react';
import { Container, Button, Card, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import { GiEarthAsiaOceania } from 'react-icons/gi';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

function Country() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('');
  const [callKey, setcallKey] = useState('');
  const { data: detailCountry } = useQuery('selectedCountryData', () => '', {
    initialData: '',
    staleTime: Infinity,
  });

  let { data: currencyList } = useQuery(
    ['countries', currency],
    async () => {
      const response = await axios.get('https://restcountries.com/v3.1/currency/' + currency, {
        headers: {
          'Content-Security-Policy': 'connect-src "self" *.restcountries.com"',
          Accept: '*/*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
      });

      return response.data;
    },
    { enabled: currency.length > 0, retry: false }
  );

  let { data: callData } = useQuery(
    ['callCode', callKey],
    async () => {
      const response = await axios.get('https://restcountries.com/v2/callingcode/' + callKey, {
        headers: {
          'Content-Security-Policy': 'connect-src "self" *.restcountries.com"',
          Accept: '*/*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
      });
      return response.data;
    },
    { enabled: callKey.length > 0, retry: false }
  );

  useEffect(() => {
    const callingCode = detailCountry?.idd.suffixes.length > 1 ? detailCountry?.idd.root.replace('+', '') : `${detailCountry?.idd.root.replace('+', '')}${detailCountry?.idd.suffixes[0]}`;
    setCurrency(Object.keys(detailCountry?.currencies));
    setcallKey(callingCode);
  }, []);

  return (
    <Container>
      <Button variant="primary" className="btnCountry text-center d-flex mt-5" onClick={() => navigate('/')}>
        <BiArrowBack className="me-2" />
        Back To Home Page
      </Button>
      <div>
        <div className="d-flex mt-5">
          <h1 className="me-3">{detailCountry?.name.common}</h1>
          <img src={detailCountry?.flags.png} alt="indonesia" className="flagCountry" />
        </div>
        <Button variant="primary" size="sm" disabled className="codeCountry px-3 me-2">
          {detailCountry?.cca2}
        </Button>
        <Button variant="primary" size="sm" disabled className="codeCountry px-3 me-2">
          {detailCountry?.name.official}
        </Button>
        <Button variant="primary" size="sm" disabled className="codeCountry px-3">
          {detailCountry?.name.nativeName[`${Object.keys(detailCountry?.languages)[0]}`].official}
        </Button>
      </div>
      <Row className="mt-4">
        <Col md={6}>
          {' '}
          <Card>
            <Card.Body className="">
              <h5>Lat Long</h5>
              <div className="d-flex">
                <h1 className="cardText">
                  {detailCountry?.capitalInfo.latlng[0]},{detailCountry?.capitalInfo.latlng[1]}
                </h1>
                <GiEarthAsiaOceania className="logoEarth ms-auto" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          {' '}
          <Card>
            <Card.Body className="heightCard">
              <p>
                Capital : <span className="fw-bold">{detailCountry?.capital}</span>
              </p>
              <p>
                Region : <span className="fw-bold"> {detailCountry?.region}</span>
              </p>
              <p>
                Subregion : <span className="fw-bold">{detailCountry?.subregion}</span>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h5>Calling Code</h5>
          <h1 className="cardText">{`${detailCountry?.idd.root}${detailCountry?.idd.suffixes[0]}`}</h1>
          <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-`}>{callData?.map((item) => item.name + ', ')}</Tooltip>}>
            <h5 style={{ textDecoration: 'underline' }}>{`${callData?.length} with this calling code`}</h5>
          </OverlayTrigger>
        </Col>
        <Col>
          <h5>Currency</h5>
          <h1 className="cardText">{Object.keys(detailCountry?.currencies)}</h1>
          <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-`}>{currencyList?.map((item) => item.name.common + ', ')}</Tooltip>}>
            <h5 style={{ textDecoration: 'underline' }}>{`${currencyList?.length} Countries with this curencty`}</h5>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}

export default Country;
