export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
