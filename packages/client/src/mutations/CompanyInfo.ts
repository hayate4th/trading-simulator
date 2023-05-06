import { gql } from "@apollo/client";

export const SET_IS_FAVORITE = gql`
  mutation SetFavorite($code: ID!, $isFavorite: Boolean!) {
    setIsFavorite(code: $code, isFavorite: $isFavorite)
  }
`;
