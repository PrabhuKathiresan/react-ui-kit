import dayjs, { OpUnitType } from 'dayjs'

export const startOf = (date: Date, key: OpUnitType) => dayjs(date).startOf(key).toDate()

export const endOf = (date: Date, key: OpUnitType) => dayjs(date).endOf(key).toDate()

