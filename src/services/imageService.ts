import { generateSalt } from '../utils/salt.utils'

export interface Image {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export const fetchImages = async (
  width: number = 500,
  height: number = 300
): Promise<{ id: string; url: string; salt: string }[]> => {
  const randomCount = Math.floor(Math.random() * (1000 - 10 + 1)) + 10
  const perPage = 100
  const pages = Math.ceil(randomCount / perPage)
  const requests: Promise<Image[]>[] = []

  // Create all the requests in parallel
  for (let page = 1; page <= pages; page++) {
    const remaining = randomCount - requests.length * perPage
    const limit = remaining > perPage ? perPage : remaining
    const request = fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
    ).then((res) => res.json())
    requests.push(request)
  }

  try {
    const data = await Promise.all(requests)

    const allImages = data.reduce((acc, current) => acc.concat(current), [])
    const formattedImages = allImages.map((image: Image) => ({
      id: image.id,
      url: `https://picsum.photos/id/${image.id}/${width}/${height}.webp?grayscale=1`,
      salt: generateSalt(),
    }))

    return formattedImages.slice(0, randomCount)
  } catch (error) {
    console.error('Error fetching images:', error)
    throw error
  }
}
