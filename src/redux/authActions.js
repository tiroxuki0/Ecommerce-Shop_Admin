import { addDocument } from "../firebase/service";
import { loginStart, loginSuccess, loginFailed } from "./authSlice";

const createUser = async (data, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const result = await addDocument("admins", data);
    dispatch(loginSuccess(data));
    navigate("/");
    return { code: 1, result };
  } catch (err) {
    dispatch(loginFailed());
    console.log(err);
    return { code: 0, err };
  }
};

export { createUser };
