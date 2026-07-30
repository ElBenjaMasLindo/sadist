import noThrowOutsideAdapters from "./no-throw-outside-adapters.js";
import noNullInDomainTypes from "./no-null-in-domain-types.js";
import noSingleUseGenerics from "./no-single-use-generics.js";
import noPrimitiveObsession from "./no-primitive-obsession.js";

export const rules = {
  "no-throw-outside-adapters": noThrowOutsideAdapters,
  "no-null-in-domain-types": noNullInDomainTypes,
  "no-single-use-generics": noSingleUseGenerics,
  "no-primitive-obsession": noPrimitiveObsession,
};
