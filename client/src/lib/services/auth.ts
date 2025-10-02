import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TAuthUser } from "@/types";
// import { actions } from "@/data/actions";
// import qs from "qs"

type TRegisterUser = {
  username: string;
  password: string;
  email: string;
};

type TLoginUser = {
  identifier: string;
  password: string;
};

type TAuthResponse = {
  jwt: string;
  user: TAuthUser;
};

type TAuthServiceResponse = TAuthResponse | TStrapiResponse<null>;

// Type guard functions
export function isAuthError(
  response: TAuthServiceResponse
): response is TStrapiResponse<null> {
  return "error" in response;
}

export function isAuthSuccess(
  response: TAuthServiceResponse
): response is TAuthResponse {
  return "jwt" in response;
}

const baseUrl = getStrapiURL();

export async function registerUserService(
  userData: TRegisterUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    const data = (await response.json()) as TAuthServiceResponse;
    console.dir(data, { depth: null });
    return data;
  } catch (error) {
    console.error("Registration Service Error:", error);
    return undefined;
  }
}

export async function loginUserService(
  userData: TLoginUser
): Promise<TAuthServiceResponse> {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    return response.json() as Promise<TAuthServiceResponse>;
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
}

// export async function getUserMeService(): Promise<TStrapiResponse<TAuthUser>> {
//   const authToken = await actions.auth.getAuthTokenAction();

//   if (!authToken)
//     return { success: false, data: undefined, error: undefined, status: 401 };

//   const url = new URL("/api/users/me", baseUrl);

//   url.search = qs.stringify({
//     populate: {
//       image: {
//         fields: ["url", "alternativeText"],
//       },
//     },
//   });

//   try {
//     const response = await fetch(url.href, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     const data = await response.json();
//     if (data.error)
//       return {
//         success: false,
//         data: undefined,
//         error: data.error,
//         status: response.status,
//       };
//     return {
//       success: true,
//       data: data,
//       error: undefined,
//       status: response.status,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       success: false,
//       data: undefined,
//       error: {
//         status: 500,
//         name: "NetworkError",
//         message:
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred",
//         details: {},
//       },
//       status: 500,
//     };
//   }
// }
