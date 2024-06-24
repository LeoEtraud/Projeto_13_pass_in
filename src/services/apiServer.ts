import axios from "axios";

export const apiPassIn = axios.create({
  baseURL: `${process.env.REACT_APP_API}`
})

