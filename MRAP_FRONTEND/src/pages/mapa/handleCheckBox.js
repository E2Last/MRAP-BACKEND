import { useState } from "react";

export const useCheckboxToggle = () => {

    const [show, setShow] = useState(true)

    const handleCheckBox = () => {
        show ? setShow(false) : setShow(true)
    }

    return {
        show,
        handleCheckBox
    }
}