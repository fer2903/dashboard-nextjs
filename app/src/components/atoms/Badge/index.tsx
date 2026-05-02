type Props ={
    value: string;
}

export const Badge = ({value}:Props) =>{
    return (
        <span>
            {value}
        </span>
    )
}
