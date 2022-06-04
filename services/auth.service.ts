import Cookies from "js-cookie";

export type LoginInputs = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
};

export type UserDetail = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: "exhibitor" | "visitor" | "admin";
  img_profile?: string;
  job_function?: string;
  country?: string;
  province?: string;
  member_sehat_ri?: string | null;
  allow_share_info?: number;
  institution_name?: string;
  institution_type?: string;
  visitor_type?: string;
  product_interest?: string[];
  visit_purpose?: string[];
  company_name?: string;
  company_website?: string;
  package?: string | null;
  business_nature?: string[];
  additional_remarks?: string;
  company_logo?: string;
  company_video_url?: string | null;
  company_description?: string;
};

export type AuthResponse = {
  code: number;
  type: string;
  message: string;
  data: {
    user: UserDetail;
    token_type: string;
    token: string;
  };
};

export type RegisterInputs = {
  email: string;
  mobile: string;
  name: string;
  password: string;
  password_confirmation: string;
  job_function?: string;
  country?: string;
  province?: string;
  package_id?: number[];
  institution_name?: string; //Visitor
  institution_type?: string; //Visitor
  visitor_type?: string; //Visitor
  product_interest?: string[]; //Visitor
  visit_purpose?: string[]; //Visitor
  member_sehat_ri?: string; //Visitor
  allow_share_info?: boolean; //Visitor
  company_name?: string; //Exhibitor
  company_website?: string; //Exhibitor
  business_nature?: string[]; //Exhibitor
  role: "visitor" | "exhibitor";
};

export type MeResponse = {
  code: number;
  type: string;
  message: string;
  data: UserDetail;
  status?: string;
};

export const login = async (inputs: LoginInputs): Promise<AuthResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(inputs),
  });

  if (!res.ok) {
    throw await res.json();
  }

  const json: AuthResponse = await res.json();

  Cookies.set("accessToken", json?.data?.token);

  const userData = await me();

  Cookies.set("user", userData.data);

  return {
    ...json,
    data: {
      ...json.data,
      user: userData.data,
    },
  };
};

export const register = async (
  inputs: RegisterInputs
): Promise<AuthResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });

  if (!res.ok) {
    throw await res.json();
  }

  const json: AuthResponse = await res.json();

  Cookies.set("accessToken", json?.data?.token);

  const userData = await me();

  Cookies.set("user", userData.data);

  return {
    ...json,
    data: {
      ...json.data,
      user: userData.data,
    },
  };
};

export const me = async () => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies}`,
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  const json: MeResponse = await res.json();

  if (!json.data) {
    throw new Error(json?.status || "Error");
  }

  Cookies.set("user", json?.data);

  return json;
};

export type UpdatePackagePayload = {
  package_id?: number;
  user_id: number;
  position?: number;
  role: "visitor" | "exhibitor";
};

export const updatePackage = async ({
  package_id,
  user_id,
  position,
  role,
}: UpdatePackagePayload) => {
  const cookies = Cookies.get("accessToken");

  if (!package_id || !user_id) {
    throw new Error("Invalid Payload");
  }

  const data = {
    _method: "PUT",
    package_id,
    user_id,
    position,
    role,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/update/status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw await res.json();
  }

  const json: MeResponse = await res.json();

  if (!json.data) {
    throw new Error(json?.status || "Error");
  }

  Cookies.set("user", json?.data);

  return json;
};

export const resetPassword = async (email: string) => {
  const cookies = Cookies.get("accessToken");

  if (!email) {
    throw new Error("Invalid Payload");
  }

  const data = {
    email,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/reset/password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};

export const changePassword = async (newPassword: string) => {
  const cookies = Cookies.get("accessToken");

  if (!newPassword) {
    throw new Error("Invalid Payload");
  }

  const data = {
    _method: "PUT",
    password: newPassword,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};

export type UpdateProfilePayload = {
  email: string;
  name: string;
  job_function: string;
  mobile: string;
  img_profile?: File;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const cookies = Cookies.get("accessToken");
  const { email, job_function, mobile, name, img_profile } = payload;

  const data = new FormData();
  img_profile && data.append("img_profile", img_profile);
  data.append("_method", "PUT");
  data.append("email", email);
  data.append("name", name);
  data.append("job_function", job_function);
  data.append("mobile", mobile);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cookies}`,
    },
    body: data,
  });

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};

export type UpdateExhibitorPayload = {
  company_name?: string;
  company_website?: string;
  company_logo?: File;
  company_video_url?: string;
  email?: string;
};

export const updateExhibitor = async (payload: UpdateExhibitorPayload) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/update`;
  const {
    company_logo,
    company_name,
    company_video_url,
    company_website,
    email,
  } = payload;

  const formData = new FormData();
  formData.append("_method", "PUT");
  company_logo && formData.append("company_logo", company_logo);
  company_name && formData.append("company_name", company_name);
  company_video_url && formData.append("company_video_url", company_video_url);
  company_website && formData.append("company_website", company_website);
  email && formData.append("email", email);

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json.data;
};

export const userResetPassword = async (email: string) => {
  const cookies = Cookies.get("accessToken");

  if (!email) {
    throw new Error("Invalid Payload");
  }

  const data = {
    email,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/reset/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};
