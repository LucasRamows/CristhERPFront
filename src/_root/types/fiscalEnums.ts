export const ICMSCST = {
  CST00: "CST00",
  CST10: "CST10",
  CST20: "CST20",
  CST30: "CST30",
  CST40: "CST40",
  CST41: "CST41",
  CST50: "CST50",
  CST51: "CST51",
  CST60: "CST60",
  CST70: "CST70",
  CST90: "CST90",
} as const;

export type ICMSCST = typeof ICMSCST[keyof typeof ICMSCST];

export const PISCOFINS_CST = {
  CST01: "CST01",
  CST02: "CST02",
  CST03: "CST03",
  CST04: "CST04",
  CST05: "CST05",
  CST06: "CST06",
  CST07: "CST07",
  CST08: "CST08",
  CST09: "CST09",
} as const;

export type PISCOFINS_CST = typeof PISCOFINS_CST[keyof typeof PISCOFINS_CST];

export const IPI_CST = {
  CST00: "CST00",
  CST01: "CST01",
  CST02: "CST02",
  CST03: "CST03",
  CST04: "CST04",
  CST05: "CST05",
  CST49: "CST49",
  CST50: "CST50",
  CST99: "CST99",
} as const;

export type IPI_CST = typeof IPI_CST[keyof typeof IPI_CST];
