import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import { storeContext } from "../context/StoreContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";

const isEmpty = (obj) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true
}

const LoginPage = () => {
  const { setToken } = useContext(storeContext);
  const { fetchCart } = useContext(CartContext);

  const [isRegister, setIsRegister] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loginUser, setLoginUser] = useState({ email: "", password: "" });
  const [registerUser, setRegisterUser] = useState({
    name: "", email: "", password: "", cnfPassword: "",
    phone: "", address1: "", address2: "",
    zip: "", country: "", state: "", city: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // load country list once
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // load states for selected country
  useEffect(() => {
    setStates(registerUser.country
      ? State.getStatesOfCountry(registerUser.country)
      : []);
    setRegisterUser(prev => ({ ...prev, state: "", city: "" }));
    setCities([]);
  }, [registerUser.country]);

  // load cities for selected state
  useEffect(() => {
    setCities(
      registerUser.country && registerUser.state
        ? City.getCitiesOfState(registerUser.country, registerUser.state)
        : []
    );
    setRegisterUser(prev => ({ ...prev, city: "" }));
  }, [registerUser.state]);

  const validateField = (name, value) => {
    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email address";
    if (name === "password" && value.length < 6)
      return "Password must be at least 6 characters";
    if (name === "phone" && value && !/^\d{10}$/.test(value))
      return "Phone must be exactly 10 digits";
    if (name === "zip" && value && !/^\d{6}$/.test(value))
      return "ZIP must be a 6-digit number";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (isRegister) {
      setRegisterUser(prev => ({ ...prev, [name]: value }));
    } else {
      setLoginUser(prev => ({ ...prev, [name]: value }));
    }

    const err = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (formErrors.email || formErrors.password) {
      return toast.error("Please fix errors before submitting");
    }
    try {
      const res = await axiosInstance.post("/user/login", loginUser);
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        fetchCart();
        navigate("/");
      } else toast.error(res.data.message);
    } catch {
      toast.error("Login failed. Try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { password, cnfPassword, phone, email, zip } = registerUser;
    if (password !== cnfPassword) return toast.error("Passwords do not match");
    if (validateField("phone", phone)) return toast.error("Invalid phone");
    if (validateField("email", email)) return toast.error("Invalid email");
    if (validateField("zip", zip)) return toast.error("Invalid ZIP");

    try {
      const res = await axiosInstance.post("/user/register", registerUser);
      if (res.data.status < 400) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        fetchCart();
        navigate("/");
      } else toast.error(res.data.message);
    } catch {
      toast.error("Registration failed. Try again.");
    }
  };

  const getInputClass = (name) =>
    `w-full px-4 py-2 border rounded focus:ring-2 ${formErrors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-black"
    }`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="relative bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <button onClick={() => navigate("/")} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input name="name" placeholder="Full Name" required onChange={handleInputChange} className={getInputClass("name")} />
                  {formErrors.name && <span className="text-red-500 text-sm">{formErrors.name}</span>}
                </div>
                <div className="space-y-2">
                  <input name="phone" placeholder="Phone (10 digits)" required onChange={handleInputChange} className={getInputClass("phone")} />
                  {formErrors.phone && <span className="text-red-500 text-sm">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <input name="email" placeholder="Email" required onChange={handleInputChange} className={getInputClass("email")} />
                  {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
                </div>
                <div className="space-y-2">
                  <input name="password" type="password" placeholder="Password" required onChange={handleInputChange} className={getInputClass("password")} />
                  {formErrors.password && <span className="text-red-500 text-sm">{formErrors.password}</span>}
                </div>
                <input name="cnfPassword" type="password" placeholder="Confirm Password" required onChange={handleInputChange} className={getInputClass("cnfPassword")} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <input name="address1" placeholder="Address Line 1" required onChange={handleInputChange} className={getInputClass("address1")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input name="address2" placeholder="Address Line 2 (opt.)" onChange={handleInputChange} className={getInputClass("address2")} />
                <input name="zip" placeholder="ZIP Code" required onChange={handleInputChange} className={getInputClass("zip")} />
                {formErrors.zip && <span className="text-red-500 text-sm">{formErrors.zip}</span>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <select name="country" required onChange={handleInputChange} className={getInputClass("country")}>
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                </select>

                <select name="state" required onChange={handleInputChange} className={getInputClass("state")} disabled={!states.length}>
                  <option value="">{states.length ? "Select State" : "No states"}</option>
                  {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>

                <select name="city" required onChange={handleInputChange} className={getInputClass("city")} disabled={!cities.length}>
                  <option value="">{cities.length ? "Select City" : "No cities"}</option>
                  {cities.map(ci => <option key={ci.name} value={ci.name}>{ci.name}</option>)}
                </select>
              </div>
            </>
          )}

          {!isRegister && (
            <>
              <div className="space-y-2">
                <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className={getInputClass("email")} />
                {/* {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>} */}
              </div>
              <div className="space-y-2">
                <input type="password" name="password" placeholder="Password" required onChange={handleInputChange} className={getInputClass("password")} />
                {/* {formErrors.password && <span className="text-red-500 text-sm">{formErrors.password}</span>} */}
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full bg-black text-white py-2 rounded transition font-semibold ${Object.values(formErrors).some(err => err) ? 'cursor-not-allowed bg-gray-500 hover:bg-gray-500' : 'cursor-pointer bg-black hover:bg-gray-800'}`}
            disabled={Object.values(formErrors).some(err => err)}
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-black font-semibold hover:underline">
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div >
  );
};

export default LoginPage;
