export const BA_API_KEY = 'jobboerse-jobsuche'

export const BA_SEARCH_URL =
  'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v6/jobs'

export const BA_DETAILS_URL =
  'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobdetails'

export function baHeaders(): Record<string, string> {
  return {
    'X-API-Key': BA_API_KEY,
    Accept: 'application/json',
    'User-Agent': 'NahJobs/1.0 (+https://github.com/TirkarParth/neue-jobs)',
  }
}
