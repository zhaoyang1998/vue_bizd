import { reactive } from 'vue'

export default function () {
  const pages = reactive({
    current: 1,
    size: 5,
    total: 0,
    sizes: [1, 5, 10, 20, 30, 40, 50, 100, 200]
  })

  return {
    pages
  }
}
