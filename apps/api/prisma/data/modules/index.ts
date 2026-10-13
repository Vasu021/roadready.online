import type { SeedModule } from "../types";
import { module01 } from "./m01-personal";
import { module02 } from "./m02-risk";
import { module03 } from "./m03-legal";
import { module04 } from "./m04-road-system";
import { module05 } from "./m05-priority";
import { module06 } from "./m06-signs";
import { module07 } from "./m07-other-users";
import { module08 } from "./m08-speed";
import { module09 } from "./m09-manoeuvres";
import { module10 } from "./m10-parking";
import { module11 } from "./m11-special";
import { module12 } from "./m12-lifelong";
import { module13 } from "./m13-technical";
import { module14 } from "./m14-driving";

/**
 * The 14 modules of the official German class-B curriculum:
 * 12 Grundstoff lessons (FahrschAusbO Anlage 1) plus 2 class-B Zusatzstoff
 * lessons (Anlage 2.2).
 */
export const GERMANY_MODULES: SeedModule[] = [
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
  module11,
  module12,
  module13,
  module14,
];
