// Gravedad.jsx
import React from 'react';
import { Tag } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import './Gravedad.css';

const Gravedad = () => {
    const gravedadOptions = [
        { label: 'Baja', color: 'yellow', icon: <WarningOutlined /> },
        { label: 'Media', color: 'orange', icon: <WarningOutlined /> },
        { label: 'Alta', color: 'red', icon: <WarningOutlined /> }
    ];

    return (
        <div className='gravedad-section'>
            <h3>Gravedad</h3>
            <div className='gravedad-options'>
                {gravedadOptions.map((option) => (
                    <Tag
                        key={option.label}
                        color={option.color}
                        icon={option.icon}
                        className='gravedad-tag'
                    >
                        {option.label}
                    </Tag>
                ))}
            </div>
        </div>
    );
};

export default Gravedad;
