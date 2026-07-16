import type { Handler, HandlerEvent } from '@netlify/functions'

const BA_BASE =
  'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobdetails'
const API_KEY = 'jobboerse-jobsuche'

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

  const refnr = event.queryStringParameters?.refnr
  if (!refnr) {
    return json(400, { error: 'Missing refnr query parameter' })
  }

  const encoded = Buffer.from(refnr, 'utf8').toString('base64')

  try {
    const response = await fetch(`${BA_BASE}/${encoded}`, {
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
        'Cache-Control': 'public, max-age=120',
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
