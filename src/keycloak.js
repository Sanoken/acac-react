import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: process.env.REACT_APP_ACAC_KEYCLOAK_URL,
    realm: process.env.REACT_APP_ACAC_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_ACAC_KEYCLOAK_CLIENT_ID,
    pkceMethod: "S256" // Enables PKCE even in insecure contexts
});

export default keycloak;
