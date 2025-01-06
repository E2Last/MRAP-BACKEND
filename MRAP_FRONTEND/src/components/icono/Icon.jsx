import './Icon.css'
import { Typography } from "antd"
const { Text } = Typography

export const CustomIcon = ({ size, title, icono }) => {
    return (
        <div
            style={{
                width: size,
                height: size,
            }}

            className="customIcon"
        >
            {icono}
            <Text strong
                style={{
                    fontSize: '20px',
                    color: '#797979'
                }}
            >
                {title}
            </Text>
        </div>
    )
}
