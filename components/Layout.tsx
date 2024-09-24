import React, { ReactNode } from 'react';
import Header from './Header';
import { Container } from '@mui/material';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <Container>{props.children}</Container>
  </div>
);

export default Layout;
