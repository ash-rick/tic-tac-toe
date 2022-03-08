import { ref, update, get, child} from "firebase/database";
import { db } from "./FirebaseSetup";

//-function for reading firebase data
export const readFireBase = async (endpoint, path) => {
  const snapshot = await get(child(ref(db), `${endpoint}/${path}`));
  return snapshot.val();
};

//-function for updating firebase data
export const updateFireBase = (endpoint, newKey, keys, value) => {
  switch (endpoint) {
    case "Game":
      switch (keys) {
        case "gamestate":
          update(ref(db, `${endpoint}/${newKey}`), { gamestate: value });
          break;
        case "current":
          update(ref(db, `${endpoint}/${newKey}`), { current: value });
          break;
        case "players":
          update(ref(db, `${endpoint}/${newKey}`), { players: value });
          break;
        case "moveNow":
          update(ref(db, `${endpoint}/${newKey}`), { moveNow: value });
          break;
        case "lastMove":
          update(ref(db, `${endpoint}/${newKey}`), { lastMove: value });
          break;
        case "winner":
          update(ref(db, `${endpoint}/${newKey}`), { winner: value });
          break;
        default:
          break;
      }
      break;
    case "UserList":
      newKey = newKey.replace(/[^a-zA-Z/\d]/g, "");
      switch (keys) {
        case "name":
          update(ref(db, `${endpoint}/${newKey}`), { name: value });
          break;
        case "email":
          update(ref(db, `${endpoint}/${newKey}`), { email: value });
          break;
        case "dp":
          update(ref(db, `${endpoint}/${newKey}`), { dp: value });
          break;
        case "total":
          {
            let newval;
            readFireBase("UserList", `${newKey}/total`).then((res) => {
              newval = res?parseInt(res):0;
              update(ref(db, `${endpoint}/${newKey}`), { total: newval + 1 });
            });
          }
          break;
        case "scoreCredit":
          {
            let newval=0;
            readFireBase("UserList", `${newKey}/scores/scoreCredit`).then(
              (res) => {
                newval = res?parseInt(res):0;
                update(ref(db, `${endpoint}/${newKey}/scores/scoreCredit`), {
                  total: newval + 50,
                });
              }
            );
          }
          break;
        case "gameID":
          {
            let newval;
            readFireBase("UserList", `${newKey}/gameID`).then((res) => {
              newval = res?res:{};
              newval[value.gameid] = value;
              update(ref(db, `${endpoint}/${newKey}`), { gameID: newval });
            });
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
};
