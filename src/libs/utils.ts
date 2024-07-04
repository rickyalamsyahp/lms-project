export const enumToArray = (en: object) => {
  return [...Object.keys(en).map((key: any) => en[key as keyof typeof en])]
}
