export function getDistanceFromLatLonInMeters(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
): number {
  const earthRadiusMeters = 6371000;
  const latDifferenceRadians = (endLat - startLat) * (Math.PI / 180);
  const lonDifferenceRadians = (endLon - startLon) * (Math.PI / 180);

  const startLatRadians = startLat * (Math.PI / 180);
  const endLatRadians = endLat * (Math.PI / 180);

  const haversineFormula =
    Math.sin(latDifferenceRadians / 2) * Math.sin(latDifferenceRadians / 2) +
    Math.cos(startLatRadians) *
      Math.cos(endLatRadians) *
      Math.sin(lonDifferenceRadians / 2) *
      Math.sin(lonDifferenceRadians / 2);

  const angularDistance =
    2 *
    Math.atan2(Math.sqrt(haversineFormula), Math.sqrt(1 - haversineFormula));

  return earthRadiusMeters * angularDistance;
}

// startLat, startLon → titik awal (misal lokasi user)
// endLat, endLon → titik tujuan (misal lokasi sekolah)
// earthRadiusMeters → jari-jari bumi dalam meter
// latDifferenceRadians, lonDifferenceRadians → perbedaan lintang dan bujur dalam radian
// startLatRadians, endLatRadians → lintang awal dan akhir dalam radian
// haversineFormula → rumus haversine bagian dalam untuk menghitung jarak angular
// angularDistance → jarak angular di permukaan bola bumi (dalam radian)
