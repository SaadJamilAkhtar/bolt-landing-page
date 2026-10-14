import { useEffect } from 'react'
import { COMPANY } from '../data/site'

const DEFAULT_TITLE = `${COMPANY.name} | Anchor Bolt and Construction Fastener Manufacturer`

/** Set the document title; an empty string restores the site default. */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${COMPANY.name}` : DEFAULT_TITLE
  }, [title])
}
