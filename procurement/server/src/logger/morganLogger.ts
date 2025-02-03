import morgan, { StreamOptions } from 'morgan';
import logger from './winstonLogger';

// Stream options for morgan to use winston
const stream: StreamOptions = {
  write: (message: string) => {
    // Log HTTP requests to winston
    logger.info(message.trim());
  },
};

// Create morgan middleware with a custom format
const morganMiddleware = morgan(':method :url :status :response-time ms - :res[content-length]', { stream });

export default morganMiddleware;
