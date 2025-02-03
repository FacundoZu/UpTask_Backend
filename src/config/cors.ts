import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whitheList = [process.env.FRONTEND_URL]
        if (process.argv[2] === '--api') {
            whitheList.push(undefined)
        }
        if (whitheList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}