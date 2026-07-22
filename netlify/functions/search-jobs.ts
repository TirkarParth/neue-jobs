import type { Handler, HandlerEvent } from '@netlify/functions'
import { aggregateJobs, credentialsFromEnv } from './lib/aggregate'
import type { AggregateSearchParams, JobSource } from './lib/types'

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
  const params: AggregateSearchParams = {
    was: incoming.was || undefined,
    wo: incoming.wo || undefined,
    umkreis: toNumber(incoming.umkreis),
    page: toNumber(incoming.page) ?? 1,
    size: toNumber(incoming.size) ?? 20,
    angebotsart: toNumber(incoming.angebotsart),
    arbeitszeit: incoming.arbeitszeit || undefined,
    befristung: toNumber(incoming.befristung),
    veroeffentlichtseit: toNumber(incoming.veroeffentlichtseit),
    sources: parseSourcesParam(incoming.sources),
  }

  try {
    const body = await aggregateJobs(params, credentialsFromEnv(process.env))
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify(body),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Aggregation failed'
    return json(502, { error: message })
  }
}

function toNumber(value?: string | null): number | undefined {
  if (value == null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseSourcesParam(value?: string | null): JobSource[] | undefined {
  if (!value) return undefined
  return value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean) as JobSource[]
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
