import { strapi } from '@strapi/client';
import type { TAuthUser } from '@/types';
import { getStrapiURL } from "@/lib/utils";

const BASE_API_URL = getStrapiURL() + "/api";
const sdk = strapi({ baseURL: BASE_API_URL });

// Helper to get authenticated SDK collection
const getAuthenticatedCollection = (collectionName: string, jwt: string) => {
  const authenticatedSdk = strapi({
    baseURL: BASE_API_URL,
    auth: jwt,
  })
  return authenticatedSdk.collection(collectionName)
}

// Helper to get current authenticated user from Strapi using SDK
const getUserMe = async (jwt: string): Promise<TAuthUser> => {
  const authenticatedSdk = strapi({
    baseURL: BASE_API_URL,
    auth: jwt,
  })

  const response = await authenticatedSdk.fetch('/users/me')

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`)
  }

  return response.json() as Promise<TAuthUser>
}

export { sdk, getAuthenticatedCollection, getUserMe };