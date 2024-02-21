import { MainButton, MainButtonProps } from "./main-button";

import { Pen } from "lucide-react";

export function EditButton(props: MainButtonProps) {
    const newProps = {
        icon: <Pen size={16} />,
        ...props,
    };
    return <MainButton {...newProps} />;
}
