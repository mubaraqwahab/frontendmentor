export interface ShortenedURLResult {
	ok: boolean
	shortUrl?: string
	fullShortUrl?: string
	originalUrl?: string
}

export interface ShrtCodeAPIResponse {
	ok: boolean
	result: {
		short_link: string
		full_short_link: string
	}
}
