import { strapi } from '@strapi/client';
import { getStrapiURL } from "@/lib/utils";

const BASE_API_URL = getStrapiURL() + "/api";
const sdk = strapi({ baseURL: BASE_API_URL });

export { sdk };