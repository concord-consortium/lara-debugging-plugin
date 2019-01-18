import { IExternalScriptContext } from "./interfaces";

export const getFirebaseJWT = (context: IExternalScriptContext, appname: string): Promise<any> => {
  const {getFirebaseJwtUrl} = context;
  return new Promise( (resolve, reject) => {
    const appSpecificUrl = getFirebaseJwtUrl(appname);
    fetch(appSpecificUrl, {method: "POST"})
    .then( (response) => {
      response.json()
      .then( (data) => {
        try {
          const token = data.token.split(".")[1];
          const claimsJson = atob(token);
          const claims = JSON.parse(claimsJson);
          resolve({token: data, claims});
        } catch (error) {
          console.error("unable to parse JWT Token");
          console.error(error);
        }
        resolve({token: data, claims: {}});
      });
    });
  });
};

export const getClassInfo = (context: IExternalScriptContext): Promise<any> => {
  const {classInfoUrl} = context;
  return new Promise( (resolve, reject) => {
    fetch(classInfoUrl, {method: "get", credentials: "include"})
    .then( (resp) => resp.json().then( (data) => resolve(data)));
  });
};
