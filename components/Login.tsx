"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useState } from "react";

export function Login() {
    const router = useRouter()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = async () => {
        try {
            const response =  await axios.post("http://localhost:3000/api/login",{username,password});
            console.log("repsonse",response.data);
            if(response.data?.statusCode === 200){
                let token = response?.data?.token;
                localStorage.setItem("encodedToken",token);
                router.push("/story-ideas");
            }
        } catch (error) {
            console.log("error",error);
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            Login
                        </div>
                    </div>
                    <div className="pt-2">
                        <LabelledInput onChange={(e) => {
                            setUsername(e.target.value);
                        }} label="Username" placeholder="Email/username" />
                        <LabelledInput onChange={(e) => {
                            setPassword(e.target.value)
                        }} label="Password" type={"password"} placeholder="******" />
                        <button
                            onClick={async()=>loginHandler()}
                        type="button" className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">submit</button>
                        <div className="text-center mt-4 flex">
                            <hr className="border-gray-300 my-4" />
                            <p className="text-sm text-gray-600">
                            Don&apos;t have an account?
                            </p>
                            <p onClick={() => router.push("/signup")} className="text-center text-sm text-blue-600 hover:underline cursor-pointer">
                                    Sign up
                            </p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>

}

function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    type?: string;
    onChange: ChangeEventHandler<HTMLInputElement>
}
