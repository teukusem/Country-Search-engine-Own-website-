import React, { useState } from 'react';
import { InputGroup, Form, Container, Dropdown } from 'react-bootstrap';
import { FaSearchLocation } from 'react-icons/fa';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

function Search() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const setSelectedCountryData = (data) => {
    queryClient.setQueryData('selectedCountryData', data);
    navigate('/country');
  };

  let { data: countryData } = useQuery(
    ['countries', searchKey],
    async () => {
      const response = await axios.get('https://restcountries.com/v3.1/name/' + searchKey, {
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
    { enabled: searchKey.length > 0, retry: false }
  );

  const onChangeSearch = (e) => {
    setSearchKey(e.target.value);
  };

  useQuery(
    ['detail', selectedCountry],
    async () => {
      const response = await axios.get('https://restcountries.com/v3.1/name/' + selectedCountry + '?fullText=true', {
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
      return setSelectedCountryData(response.data[0]);
    },
    { enabled: selectedCountry.length > 0, retry: false }
  );

  return (
    <Container>
      <div className="mrgSearch">
        <h1 className="text-center">Country</h1>
        {/* make a search bar */}
        <div>
          <InputGroup>
            <Form.Control onChange={onChangeSearch} />
            <InputGroup.Text>
              <FaSearchLocation />
            </InputGroup.Text>
          </InputGroup>

          <Dropdown.Menu className="drowDwn" show={countryData?.length > 0}>
            {countryData?.map((item, index) => {
              return (
                <Dropdown.Item
                  eventKey={index}
                  key={index}
                  onClick={() => {
                    setSelectedCountry(item.name.common);
                  }}
                >
                  {item.name.common}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </div>
      </div>
    </Container>
  );
}

export default Search;
