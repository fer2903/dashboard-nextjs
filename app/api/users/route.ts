import { NextResponse } from "next/server";

type UserResponse = {
    id: number;
    name: string;
    email: string;
}

type User = {
    id: number;
    name: string;
    email: string;
}

export async function GET() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users")

    const data: UserResponse[] = await res.json()
    const formatted: User[] = data.map((u)=>({
        id: u.id,
        name: u.name,
        email: u.email
    }))

    return NextResponse.json(formatted)
}