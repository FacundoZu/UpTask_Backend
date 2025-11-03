import { CorsOptions } from 'cors'

const ACCEPTED_ORIGINS = [
    process.env.FRONTEND_URL || 'http://localhost:5173'
]

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = ACCEPTED_ORIGINS

        if (whiteList.includes(origin) || !origin) {
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    },
    credentials: true
}
