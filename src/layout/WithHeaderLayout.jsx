import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';

const WithHeaderLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export default WithHeaderLayout;