import { checkPasswordSecurity } from "../../api/password-validator";

self.onmessage = ({ data: password }) => {
  self.postMessage({ password, strength: checkPasswordSecurity(password) });
};
