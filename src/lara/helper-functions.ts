import { IExternalScriptContext } from "./interfaces";

export interface IPortalClaims {
  user_type: "learner" | "teacher";
  user_id: string;
  class_hash: string;
  offering_id: number;
}
export interface IJwtClaims {
  domain: string;
  returnUrl: string;
  externalId: number;
  class_info_url: string;
  claims: IPortalClaims;
}
export interface IJwtResponse {
  token: string;
  claims: IJwtClaims | {};
}

export interface IUser {
  id: string; // path
  firstName: string;
  lastName: string;
}
export interface IOffering {
  id: number;
  name: string;
  url: string;
}
export interface IClassInfo {
  id: number;
  uri: string;
  class_hash: string;
  teachers: IUser[];
  students: IUser[];
  offerings: IOffering[];
}

export interface IInteractiveState {
  id: number;
  key: string;
  raw_data: string;
  interactive_name: string;
  interactive_state_url: string;
  activity_name: string;
}

export const getFirebaseJWT = (context: IExternalScriptContext, appname: string): Promise<IJwtResponse|null> => {
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
          // tslint:disable-next-line
          console.error("unable to parse JWT Token");
          // tslint:disable-next-line
          console.error(error);
        }
        resolve({token: data, claims: {}});
      })
      .catch( (e) => resolve(null));
    });
  });
};

export const getClassInfo = (context: IExternalScriptContext): Promise<IClassInfo> => {
  const {classInfoUrl} = context;
  return new Promise( (resolve, reject) => {
    fetch(classInfoUrl, {method: "get", credentials: "include"})
    .then( (resp) => resp.json().then( (data) => resolve(data)));
  });
};

export const getInteractiveState = (context: IExternalScriptContext): Promise<IInteractiveState> => {
  const {interactiveStateUrl} = context;
  return new Promise( (resolve, reject) => {
    fetch(interactiveStateUrl, {method: "get", credentials: "include"})
    .then( (resp) => resp.json().then( (data) => resolve(data)));
  });
};
