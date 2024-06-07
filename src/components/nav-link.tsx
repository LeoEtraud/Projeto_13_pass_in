import { ComponentProps } from "react"

interface NavLinkProps extends ComponentProps<'a'>{
    children: string
}

export function Navlink(props: NavLinkProps) {
    return (
        <a {...props} className="font-medium text-sm">
            {props.children}
        </a>
    )
}
