import Cookies from "js-cookie";
import {
  useEffect,
  createContext,
  FC,
  useReducer,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import {
  login as loginApi,
  register as registerApi,
  me,
  registerWithPhone as registerWithPhoneApi,
} from "services/auth.service";
import type {
  AuthResponse,
  LoginInputs,
  MeResponse,
  RegisterInputs,
  UserDetail,
} from "services/auth.service";

interface AuthContextType {
  user: UserDetail | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (inputs: LoginInputs) => Promise<void>;
  register: (inputs: RegisterInputs) => Promise<void>;
  registerWithPhone: (mobile: string) => Promise<void>;
  logout: () => Promise<void>;
  fromRegisterPhone: boolean;
  setFromRegisterPhone: Dispatch<SetStateAction<boolean>>;
}

enum AuthActionKind {
  INITIALIZE = "INITIALIZE",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

interface AuthAction {
  type: AuthActionKind;
  payload: {
    isAuthenticated: boolean;
    // isInitialized: boolean;
    user: UserDetail | null;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: UserDetail | null;
}

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction) => {
  const { type, payload } = action;
  const { isAuthenticated, user } = payload;

  switch (type) {
    case AuthActionKind.INITIALIZE:
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user,
      };
    case AuthActionKind.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    case AuthActionKind.REGISTER:
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    case AuthActionKind.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
  }
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: (inputs) => {},
  register: (inputs) => {},
  logout: () => {},
} as AuthContextType);

export const AuthProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [fromRegisterPhone, setFromRegisterPhone] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await me();
        dispatch({
          type: AuthActionKind.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user: data.data,
          },
        });
      } catch (error) {
        dispatch({
          type: AuthActionKind.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };
    initialize();
  }, []);

  const register = async (inputs: RegisterInputs) => {
    const data = await registerApi(inputs);

    dispatch({
      type: AuthActionKind.REGISTER,
      payload: {
        user: data.data.user,
        isAuthenticated: true,
      },
    });
  };

  const registerWithPhone = async (mobile: string) => {
    const data = await registerWithPhoneApi(mobile);

    dispatch({
      type: AuthActionKind.REGISTER,
      payload: {
        user: data.data.user,
        isAuthenticated: true,
      },
    });
  };

  const login = async (inputs: LoginInputs) => {
    const data = await loginApi(inputs);

    dispatch({
      type: AuthActionKind.LOGIN,
      payload: {
        user: data.data.user,
        isAuthenticated: true,
      },
    });
  };

  const logout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("user");

    dispatch({
      type: AuthActionKind.LOGOUT,
      payload: {
        isAuthenticated: false,
        user: null,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        registerWithPhone,
        fromRegisterPhone,
        setFromRegisterPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = () => {
  return useContext(AuthContext);
};
