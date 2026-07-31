import type { Rule } from "eslint";
import noThrowOutsideAdapters from "./no-throw-outside-adapters.js";
import noNullInDomainTypes from "./no-null-in-domain-types.js";
import noSingleUseGenerics from "./no-single-use-generics.js";
import noPrimitiveObsession from "./no-primitive-obsession.js";
import requireTsPatternExhaustive from "./require-ts-pattern-exhaustive.js";
import noTsSuppressions from "./no-ts-suppressions.js";

export const rules: Record<string, Rule.RuleModule> = {
  "no-throw-outside-adapters": noThrowOutsideAdapters,
  "no-null-in-domain-types": noNullInDomainTypes,
  "no-single-use-generics": noSingleUseGenerics,
  "no-primitive-obsession": noPrimitiveObsession,
  "require-ts-pattern-exhaustive": requireTsPatternExhaustive,
  "no-ts-suppressions": noTsSuppressions,
};
