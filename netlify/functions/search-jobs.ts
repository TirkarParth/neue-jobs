import type { Handler, HandlerEvent } from '@netlify/functions'

const BA_BASE =
  'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs'
const API_KEY = 'jobboerse-jobsuche'

const ALLOWED_PARAMS = [
  'was',
  'wo',
  'umkreis',
  'page',
  'size',
  'angebotsart',
  'arbeitszeit',
  'befristung',
  'veroeffentlichtseit',
  'zeitarbeit',
] as const

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' })
  }

  const incoming = event.queryStringParameters ?? {}
  const params = new URLSearchParams()

  for (const key of ALLOWED_PARAMS) {
    const value = incoming[key]
    if (value != null && value !== '') {
      params.set(key, value)
    }
  }

  if (!params.has('size')) params.set('size', '20')
  if (!params.has('page')) params.set('page', '1')

  try {
    const response = await fetch(`${BA_BASE}?${params.toString()}`, {
      headers: {
        'X-API-Key': API_KEY,
        Accept: 'application/json',
      },
    })

    const text = await response.text()
    let body: unknown
    try {
      body = JSON.parse(text)
    } catch {
      body = { error: 'Invalid upstream response', raw: text.slice(0, 200) }
    }

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify(body),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed'
    return json(502, { error: message })
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }
}

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
