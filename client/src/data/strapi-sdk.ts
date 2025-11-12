import { strapi } from '@strapi/client';
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

export { sdk, getAuthenticatedCollection };