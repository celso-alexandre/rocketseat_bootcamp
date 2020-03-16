import React from 'react';

import { FaGithubAlt, FaPlus } from 'react-icons/fa';

import { Container, Form, SubmitButton } from './styles';

export default function Main() {
  return (
    <Container>
      <h1>
        <FaGithubAlt />
        &nbsp;Repositories
      </h1>

      <Form onSubmit={() => {}}>
        <input type="text" placeholder="Add Repository" />

        <SubmitButton disabled>
          <FaPlus color="#FFF" size={14} />
        </SubmitButton>
      </Form>
    </Container>
  );
}
