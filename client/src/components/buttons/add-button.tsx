import { MainButton, MainButtonProps } from "./main-button";

import { Plus } from "lucide-react";

export function AddButton(props: MainButtonProps) {
    const newProps = {
        icon: <Plus size={16} />,
        ...props,
    };
    return <MainButton {...newProps} />;
}
