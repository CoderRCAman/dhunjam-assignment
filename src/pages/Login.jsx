import React, { useState } from "react";
import { useAuth } from "../store/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !username) {
      toast.error("Missing username or password");
    }
    try {
      const res = await axios.post(
        "https://stg.dhunjam.in/account/admin/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.data.id,
          token: res.data.data.token,
        })
      );
      setUser({
        id: res.data.data.id,
        token: res.data.data.token,
      });
      toast.success("Sign in success!");
      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error.response.data?.password?.[0] ||
          error.response.data?.ui_err_msg ||
          error.message
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen w-screen flex justify-center items-center"
    >
      <div className="gap-8 w-[600px] flex flex-col items-center ">
        <h1 className="text-white  font-bold w-[600px] text-center text-[30px]">
          Venue Admin Login
        </h1>
        <div className="space-y-4 w-full">
          <div>
            <input
              type="text"
              name="email"
              placeholder="Username"
              className="bg-transparent border  px-1 py-2 rounded-md text-white w-full"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              name="email"
              placeholder="Password"
              className="bg-transparent border w-full px-1 py-2 rounded-md text-white"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-[600px] flex-col items-center gap-2">
          <button className="bg-[#6741D9] py-3 w-full  text-white text-sm font-bold rounded-md">
            Sign in
          </button>
          <h3 className="text-white">New Registration?</h3>
        </div>
      </div>
    </form>
  );
}
