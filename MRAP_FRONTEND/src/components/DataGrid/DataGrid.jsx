import './DataGrid.css';
import { useRef, useState } from "react";
import { Button, Input, message, Space, Table } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

export const DataGrid = ({ data, columns, footerCreate, expandible, callDataFunction = null, pages = null }) => {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [dataSource, setDataSource] = useState(data)

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Filtrar por ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Filtrar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Borrar filtros
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                        style={{ color: 'red' }}
                    >
                        Cerrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const setColumns = (columnList) => {
        return columnList.map((column) => {
            // Evitar que las columnas tengan filtros
            if (column.dataIndex === 'operacion' || column.dataIndex === 'latitud' || column.dataIndex === 'longitud') {
                return {
                    ...column,
                    filterDropdown: false,
                    sorter: false,
                };
            }

            // Si la columna ya tiene un render (como los botones), lo preservamos
            const renderFunction = column.render ? column.render : null;

            return {
                ...column,
                ...getColumnSearchProps(column.dataIndex),
                sorter: (a, b) => {
                    if (a[column.dataIndex] < b[column.dataIndex]) return -1;
                    if (a[column.dataIndex] > b[column.dataIndex]) return 1;
                    return 0;
                },
                render: (text, record) => {
                    if (renderFunction) {
                        return renderFunction(text, record);
                    }
                    return text;
                },
            };
        });
    };

    let col = setColumns(columns);

    const handlePageChange = async (page) => {
        try {
            const nuevosDatos = await callDataFunction(page)
            setDataSource(nuevosDatos.resultados)
        } catch (error) {
            message.error("Error al obtener los incidentes", error)
        }
    }

    return (
        <Table
            pagination={{
                pageSize: 10,
                position: ['bottomCenter'],
                total: pages ? pages.pages : null, // Si data tiene 25 elementos
                onChange: callDataFunction ? handlePageChange : null,
            }}
            size='small'
            columns={col}
            dataSource={dataSource}
            style={{
                width: '100%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.10)',
                borderRadius: '8px',
            }}
            scroll={{ x: 'max-content', }}
            footer={() => footerCreate()} // Renderiza footerCreate
            bordered
            expandable={
                expandible ? {
                    expandedRowRender: (record) => (
                        <div>
                            {expandible(record)}
                        </div>
                    ),
                    rowExpandable: (record) => !!record.descripcion,
                } : null
            }
        />
    );
};
