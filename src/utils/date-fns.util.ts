import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export function timeFormat(datetime: string | number, fmt = 'YYYY-MM-DD HH:mm:ss') {
  const time =
    typeof datetime === 'number'
      ? Number.parseInt(datetime.toString().padEnd(13, '0'), 10)
      : Date.parse(datetime)

  return dayjs(time).format(fmt)
}
