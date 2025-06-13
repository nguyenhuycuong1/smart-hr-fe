export const environment = {
  production: false,
  // api_endpoint: 'http://localhost:8080/smart-hr',
  // api_endpoint: 'http://localhost:8080/smart-hr',
  api_endpoint: 'https://nguyenhuycuong01.duckdns.org/smart-hr',
  keycloak: {
    // issuer: 'http://localhost:8081',
    issuer: 'https://smarthr.duckdns.org',
    realm: 'smart_hr',
    clientId: 'smart_hr',
  },
};
