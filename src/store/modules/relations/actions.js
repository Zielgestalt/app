import api from "../../../api";
import { SET_RELATIONS } from "../../mutation-types";

export function getRelations({ commit }) {
  return api
    .getRelations({ limit: -1 })
    .then(res => res.data)
    .then(relations => commit(SET_RELATIONS, relations));
}
