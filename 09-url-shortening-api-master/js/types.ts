// Do you still need this?
export interface ShortenedURLResult {
	ok?: boolean // ?
	shortUrl: string
	fullShortUrl: string
	originalUrl: string
	errorCode?: string // ?
}

export interface ShrtCodeAPIResponse {
	ok: boolean
	result?: {
		short_link: string
		full_short_link: string
		original_link: string
	}
	error_code?: number
}
