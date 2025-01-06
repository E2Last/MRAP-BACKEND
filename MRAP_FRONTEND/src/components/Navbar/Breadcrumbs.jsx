import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css'; // Importa el archivo CSS

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Verifica si la ruta actual es "/mapa"
  const isMapaRoute = location.pathname === '/mapa';
  const isInicioRoute = location.pathname === '/inicio';

  if (isInicioRoute || isMapaRoute) {
    return null;
  }

  // Genera los items para el Breadcrumb
  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <span style={{paddingLeft:'10px', fontSize:'18px', color: 'gray'}}>
          <HomeOutlined style={{fontSize:'18px', color: 'gray' }}/>
          </span>
        </Link>
      ),
    },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const last = index === pathnames.length - 1;

      return {
        title: last ? (
          <span style={{ fontSize:'18px', color: 'gray'}}>
            <UserOutlined style={{paddingRight: '8px', fontSize:'18px',}}/> 
            {value}
          </span>
        ) : (
          <Link to={to}>
            <span style={{padding: '0px', fontSize:'18px', color: 'gray',}} >{value}</span>
          </Link>
        ),
      };
    }),
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

export default Breadcrumbs;
