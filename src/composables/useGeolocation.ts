import { ref } from 'vue'
import { reverseGeocode } from '../api/jobs'

export function useGeolocation() {
  const locating = ref(false)
  const locationError = ref<string | null>(null)
  const detectedPlace = ref<string | null>(null)
  const coords = ref<{ lat: number; lon: number } | null>(null)

  async function detectLocation(): Promise<string | null> {
    locationError.value = null
    detectedPlace.value = null

    if (!('geolocation' in navigator)) {
      locationError.value = 'Geolocation wird von diesem Browser nicht unterstützt.'
      return null
    }

    locating.value = true

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 12000,
          maximumAge: 60_000,
        })
      })

      coords.value = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }

      const place = await reverseGeocode(coords.value.lat, coords.value.lon)
      detectedPlace.value = place
      return place
    } catch (error) {
      if (isGeolocationError(error)) {
        locationError.value =
          error.code === 1
            ? 'Standortzugriff wurde verweigert. Bitte Ort manuell eingeben.'
            : 'Standort konnte nicht ermittelt werden.'
      } else if (error instanceof Error) {
        locationError.value = error.message
      } else {
        locationError.value = 'Standort konnte nicht ermittelt werden.'
      }
      return null
    } finally {
      locating.value = false
    }
  }

  return {
    locating,
    locationError,
    detectedPlace,
    coords,
    detectLocation,
  }
}

function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as GeolocationPositionError).code === 'number'
  )
}
