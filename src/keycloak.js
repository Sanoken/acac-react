import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: process.env.REACT_APP_ACAC_KEYCLOAK_URL,
    realm: process.env.REACT_APP_ACAC_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_ACAC_KEYCLOAK_CLIENT_ID,
    scope: 'openid profile email roles group-memberships'
});

export default keycloak;
