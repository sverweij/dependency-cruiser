import Maybe from 'graphql/tsutils/Maybe';

interface SearchStation {
  code: Maybe<string>;
  cityCode: Maybe<string>;
  airportName: Maybe<string>;
  cityName: Maybe<string>;
  country: Maybe<string>;
  display: Maybe<string>;
  isCity: Maybe<boolean>;
}


export function searchFlight(pFrom: SearchStation, pTo: SearchStation) {
    return 'abra ca dabra';
}
