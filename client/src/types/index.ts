import { Block } from "../components/blocks/block-renderer"

export type TLink = {
  id: number
  href: string
  label: string
  isExternal: boolean
  isButtonLink: boolean
  type: string | null
}

export type TCard = {
  id: number
  heading: string
  text: string
}

export type TImage = {
  id: number
  documentId: string
  alternativeText: string | null
  url: string
}

export type TAuthor = {
  fullName: string
  bio?: string
  image?: TImage
}

export type TLogo = {
  id: number
  label: string
  href: string
  isExternal: boolean
  image: TImage
}

export type THeader = {
  id: number
  logo: TLogo
  navItems: TLink[]
  cta: TLink
}

export type TGlobal = {
  documentId: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  header: THeader
}

export type TLandingPage = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: Block[];
}

export type TMetaData = {
  documentId: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export type TStrapiResponseSingle<T> = {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type TStrapiResponseCollection<T> = {
  data: T[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type TStrapiResponse<T = null> = {
  data?: T
  error?: {
    status: number
    name: string
    message: string
    details?: Record<string, string[]>
  }
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
